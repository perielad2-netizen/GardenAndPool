// Tabs, counters, forms, chat, and plan purchase wiring
(function(){
  // Smooth counters
  const counters = document.querySelectorAll('[data-counter]');
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    let start = 0, startTs = 0;
    const step = (ts) => {
      if(!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / 1200);
      const val = Math.floor(ease(p) * target);
      if(val !== start){ start = val; el.textContent = String(val); }
      if(p < 1) requestAnimationFrame(step);
    };
    if(target > 0) requestAnimationFrame(step);
  });

  // Tabs + Chips
  const buttons = document.querySelectorAll('[data-tab]');
  const panels = {
    'diagnosis': document.getElementById('panel-diagnosis'),
    'scheduler': document.getElementById('panel-scheduler'),
    'cabinet': document.getElementById('panel-cabinet'),
    'subscription': document.getElementById('panel-subscription'),
    'garden': document.getElementById('panel-garden'),
    'garden-subscription': document.getElementById('panel-garden-subscription'),
    'chat': document.getElementById('panel-chat'),
    'portal': document.getElementById('panel-portal')
  };
  function setActive(id, opts){
    const o = Object.assign({ scroll: true }, opts || {});
    Object.values(panels).forEach(el => el && el.classList.add('hidden'));
    const panel = panels[id];
    if(panel){
      panel.classList.remove('hidden');
      if (o.scroll) {
        try{ panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_){ }
      }
    }

    // highlight chip
    document.querySelectorAll('#serviceChips button').forEach(b => b.classList.remove('active'));
    const chip = document.querySelector(`#serviceChips button[data-tab="${id}"]`);
    if (chip) chip.classList.add('active');

    // bottom nav active icon
    document.querySelectorAll('#bottomNav .nav-icon').forEach(i => i.classList.remove('active'));
    const icon = document.querySelector(`#bottomNav [data-tab="${id}"] .nav-icon`);
    if (icon) icon.classList.add('active');
  }
  buttons.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); const id = btn.getAttribute('data-tab'); if (id) { setActive(id, { scroll: true }); location.hash = id; } }));

  // Default panel from URL (#panel or ?panel=) with fallback to diagnosis
  const hashPanel = (location.hash || '').replace('#','');
  const urlPanel = new URLSearchParams(location.search).get('panel');
  const initial = panels[hashPanel] ? hashPanel : (panels[urlPanel] ? urlPanel : 'diagnosis');
  // Do not auto-scroll on initial load unless a panel was explicitly requested
  setActive(initial, { scroll: Boolean(hashPanel || urlPanel) });

  // Keep hash in sync when switching
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#','');
    if (panels[h]) setActive(h, { scroll: true });
  });

  // ---- Supabase Auth + Portal (read-only) ----
  async function supa() {
    try {
      const res = await fetch('/api/config/env');
      const cfg = await res.json();
      const url = cfg?.supabase?.url;
      const anon = cfg?.supabase?.anon;
      if (!url || !anon || !window.supabase) return null;
      return window.supabase.createClient(url, anon);
    } catch { return null; }
  }

  // Format window label HH:MM–HH:MM in he-IL
  function formatWindow(startIso, endIso){
    const s = new Date(startIso);
    const e = new Date(endIso);
    const opts = { hour: '2-digit', minute: '2-digit' };
    return `${s.toLocaleTimeString('he-IL', opts)}–${e.toLocaleTimeString('he-IL', opts)}`;
  }

  // Attach cancel handlers to buttons rendered in the portal
  function attachCancelHandlers(client, refreshPortal){
    document.querySelectorAll('[data-cancel]').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      if (btn.hasAttribute('disabled')) return; // skip disabled (same-day)
      btn.dataset.bound = '1';
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-cancel');
        if (!id) return;
        btn.setAttribute('disabled','true');
        try {
          const { error } = await client.from('appointments').update({ status: 'cancelled' }).eq('id', id);
          if (error) alert('שגיאה: ' + error.message);
        } catch (_) {
          // ignore
        } finally {
          await refreshPortal();
        }
      });
    });
  }

  // Israel-time same-day helper: returns true if ISO falls on today in Asia/Jerusalem
  function isSameDayIL(iso){
    if (!iso) return false;
    const tz = 'Asia/Jerusalem';
    const todayIL = new Date().toLocaleDateString('he-IL', { timeZone: tz });
    const dayIL   = new Date(iso).toLocaleDateString('he-IL', { timeZone: tz });
    return todayIL === dayIL;
  }

  // Auth Modal logic
  function openAuthModal(){
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    const close = document.getElementById('authModalClose');
    close && close.addEventListener('click', ()=> modal.classList.add('hidden'));
    modal.addEventListener('click', (e)=>{ if (e.target === modal) modal.classList.add('hidden'); });
  }
  const openAuthBtn = document.getElementById('openAuthModal');
  if (openAuthBtn) openAuthBtn.addEventListener('click', (e)=>{ e.preventDefault(); openAuthModal(); });
  // Also open modal when selecting the auth service chip
  const authChip = document.querySelector('#serviceChips button[data-tab="auth"]');
  if (authChip) authChip.addEventListener('click', (e)=>{ e.preventDefault(); openAuthModal(); });

  (async () => {
    const client = await supa();
    if (!client) return;

    // Modal controls (primary)
    const authEmailModal = document.getElementById('authEmailModal');
    const authPasswordModal = document.getElementById('authPasswordModal');
    const btnLoginModal = document.getElementById('btnLoginModal');
    const btnRegisterModal = document.getElementById('btnRegisterModal');
    const btnResetModal = document.getElementById('btnResetModal');
    const btnLogoutModal = document.getElementById('btnLogoutModal');
    const authStatusModal = document.getElementById('authStatusModal');

    const portalSignedOut = document.getElementById('portalSignedOut');
    const portalContent = document.getElementById('portalContent');
    const portalProfile = document.getElementById('portalProfile');
    const portalSubs = document.getElementById('portalSubs');
    const portalAppts = document.getElementById('portalAppts');
    const portalInvoices = document.getElementById('portalInvoices');
    const portalSummary = document.getElementById('portalSummary');

    // Header auth zone (swap CTA to logged-in state)
    const headerAuthZone = document.getElementById('headerAuthZone');

    async function refreshPortal() {
      // Allow external triggers
      if (!window.__portalRefreshBound) { window.addEventListener('portal-refresh', async ()=> { await refreshPortal(); }); window.__portalRefreshBound = true; }
      const { data: { user } } = await client.auth.getUser();
      const modal = document.getElementById('authModal');
      if (!user) {
        portalSignedOut?.classList.remove('hidden');
        portalContent?.classList.add('hidden');
        portalSummary && (portalSummary.textContent = 'טרם מחובר/ת');
        btnLogoutModal?.classList.add('hidden');
        if (headerAuthZone) headerAuthZone.innerHTML = `
          <a href="#auth" id="openAuthModal" class="btn btn-cta-header">
            <i class="fas fa-user-lock"></i>
            התחברות / הרשמה
          </a>`;
        const newOpen = document.getElementById('openAuthModal');
        newOpen && newOpen.addEventListener('click', (e)=>{ e.preventDefault(); openAuthModal(); });
        return;
      }
      btnLogoutModal?.classList.remove('hidden');
      portalSignedOut?.classList.add('hidden');
      portalContent?.classList.remove('hidden');
      portalSummary && (portalSummary.textContent = `מחובר/ת כ-${user.email}`);
      // Close modal after successful login
      modal && modal.classList.add('hidden');
      // Swap header CTA to logged-in dropdown/actions
      if (headerAuthZone) headerAuthZone.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-white/90 text-sm hidden sm:inline">${user.email}</span>
          <button id="headerLogout" class="btn btn-cta-header"><i class="fas fa-right-from-bracket"></i> התנתק</button>
        </div>`;
      const headerLogout = document.getElementById('headerLogout');
      headerLogout && headerLogout.addEventListener('click', async ()=>{
        await client.auth.signOut();
        authStatusModal && (authStatusModal.textContent = 'התנתקת');
        await refreshPortal();
      });

      // Basic read-only pulls
      const uid = user.id;
      const prof = await client.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (!portalProfile) return;
      if (!prof.data) {
        portalProfile.innerHTML = `
          <div class="text-sm text-slate-700 mb-2">אין פרופיל עדיין – מלא/י את הפרטים וניצור עבורך כרטיס לקוח.</div>
          <div class="grid gap-2">
            <input id="pf_full_name" class="border rounded-lg px-3 py-2" placeholder="שם מלא" />
            <input id="pf_phone" class="border rounded-lg px-3 py-2" placeholder="טלפון" />
            <input id="pf_address" class="border rounded-lg px-3 py-2" placeholder="כתובת" />
            <div class="grid grid-cols-2 gap-2">
              <input id="pf_pool_type" class="border rounded-lg px-3 py-2" placeholder="סוג בריכה" />
              <input id="pf_pool_size" class="border rounded-lg px-3 py-2" placeholder="גודל בריכה" />
            </div>
            <textarea id="pf_notes" class="border rounded-lg px-3 py-2" placeholder="הוראות מיוחדות"></textarea>
            <button id="pf_save" class="btn btn-primary">שמירת פרופיל</button>
            <div id="pf_status" class="text-xs text-slate-500"></div>
          </div>
        `;
        const pfSave = document.getElementById('pf_save');
        const status = document.getElementById('pf_status');
        pfSave?.addEventListener('click', async () => {
          status.textContent = 'שומר...';
          const payload = {
            id: uid,
            full_name: document.getElementById('pf_full_name').value.trim() || (user.email || '').split('@')[0],
            phone: document.getElementById('pf_phone').value.trim() || null,
            address: document.getElementById('pf_address').value.trim() || null,
            pool_type: document.getElementById('pf_pool_type').value.trim() || null,
            pool_size: document.getElementById('pf_pool_size').value.trim() || null,
            special_instructions: document.getElementById('pf_notes').value.trim() || null,
          };
          const { error } = await client.from('profiles').upsert(payload);
          status.textContent = error ? ('שגיאה: ' + error.message) : 'נשמר בהצלחה';
          if (!error) await refreshPortal();
        });
      } else {
        const p = prof.data;
        portalProfile.innerHTML = `
          <div class="grid gap-1">
            <div><span class="text-slate-500">שם:</span> ${p.full_name || ''}</div>
            <div><span class="text-slate-500">טלפון:</span> ${p.phone || ''}</div>
            <div><span class="text-slate-500">כתובת:</span> ${p.address || ''}</div>
            <div><span class="text-slate-500">סוג בריכה:</span> ${p.pool_type || ''}</div>
            <div><span class="text-slate-500">גודל בריכה:</span> ${p.pool_size || ''}</div>
            <div><span class="text-slate-500">הוראות:</span> ${p.special_instructions || ''}</div>
          </div>
        `;
      }

      const subs = await client.from('subscriptions').select('*').eq('user_id', uid).limit(5);
      if (portalSubs) {
        if (!subs.data || subs.data.length === 0) portalSubs.textContent = 'אין מנויים';
        else portalSubs.innerHTML = subs.data.map(s => `
          <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
            <div>
              <div class="font-medium">${s.plan_type}</div>
              <div class="text-xs text-slate-500">${s.status} • מתחיל ב-${s.start_date || ''}</div>
            </div>
            <div class="text-blue-700 font-semibold">${s.price ? '₪'+s.price : ''}</div>
          </div>
        `).join('');
      }

      const appts = await client.rpc('get_upcoming_appointments_for_user', { p_user: uid }).catch(() => ({ data: null }));
      if (!appts || !appts.data) {
        const a = await client.from('appointments')
          .select('*')
          .eq('user_id', uid)
          .order('scheduled_date', { ascending: true })
          .limit(5);
        if (portalAppts) {
          if (!a.data || a.data.length===0) portalAppts.textContent = 'אין תורים';
          else portalAppts.innerHTML = a.data.map(x => {
            const start = x.window_start || x.scheduled_date;
            const end = x.window_end || new Date(new Date(x.scheduled_date).getTime() + 2*60*60*1000).toISOString();
            const sameDay = isSameDayIL(start);
            const cancelBtn = x.status === 'pending'
              ? (sameDay
                  ? `<button class="text-xs text-slate-400 cursor-not-allowed" title="לא ניתן לבטל ביום התור" disabled>בטל</button>`
                  : `<button class="text-xs text-red-600 underline" data-cancel="${x.id}" title="בטל תור">בטל</button>`)
              : '';
            return `
            <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
              <div>
                <div class="font-medium">${x.service_type}</div>
                <div class="text-xs text-slate-500">${formatWindow(start, end)}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-xs text-slate-500">${x.status}</div>
                ${cancelBtn}
              </div>
            </div>`;
          }).join('');
        }
      } else {
        if (portalAppts) portalAppts.innerHTML = appts.data.map(x => {
          const sameDay = isSameDayIL(x.scheduled_date);
          const cancelBtn = x.status === 'pending'
            ? (sameDay
                ? `<button class="text-xs text-slate-400 cursor-not-allowed" title="לא ניתן לבטל ביום התור" disabled>בטל</button>`
                : `<button class="text-xs text-red-600 underline" data-cancel="${x.id}" title="בטל תור">בטל</button>`)
            : '';
          return `
          <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
            <div>
              <div class="font-medium">${x.service_type}</div>
              <div class="text-xs text-slate-500">${formatWindow(x.scheduled_date, x.window_end)}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-xs text-slate-500">${x.status}</div>
              ${cancelBtn}
            </div>
          </div>`;
        }).join('');
      }

      attachCancelHandlers(client, refreshPortal);
      const inv = await client.from('invoices').select('*').eq('user_id', uid).order('due_date', { ascending: false }).limit(5);
      if (portalInvoices) {
        if (!inv.data || inv.data.length===0) portalInvoices.textContent = 'אין חשבוניות';
        else portalInvoices.innerHTML = inv.data.map(i => `
          <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
            <div>
              <div class="font-medium">חשבונית #${i.invoice_number || i.id.slice(0,6)}</div>
              <div class="text-xs text-slate-500">לתשלום עד ${i.due_date || ''}</div>
            </div>
            <div class="font-semibold ${i.status==='paid'?'text-emerald-600':'text-blue-700'}">₪${i.amount}</div>
          </div>
        `).join('');
      }
    }

    // Modal listeners (primary)
    btnLoginModal?.addEventListener('click', async () => {
      authStatusModal.textContent = 'מתחבר...';
      const { error } = await client.auth.signInWithPassword({ email: authEmailModal.value, password: authPasswordModal.value });
      authStatusModal.textContent = error ? ('שגיאה: ' + error.message) : 'מחובר';
      await refreshPortal();
    });
    btnRegisterModal?.addEventListener('click', async () => {
      authStatusModal.textContent = 'נרשם...';
      const { error } = await client.auth.signUp({ email: authEmailModal.value, password: authPasswordModal.value });
      authStatusModal.textContent = error ? ('שגיאה: ' + error.message) : 'נרשם! בדוק/י דוא"ל לאימות';
      await refreshPortal();
    });
    btnResetModal?.addEventListener('click', async () => {
      authStatusModal.textContent = 'שולח קישור לאיפוס...';
      const { error } = await client.auth.resetPasswordForEmail(authEmailModal.value, { redirectTo: window.location.origin });
      authStatusModal.textContent = error ? ('שגיאה: ' + error.message) : 'קישור איפוס נשלח לדוא"ל';
    });
    btnLogoutModal?.addEventListener('click', async () => {
      await client.auth.signOut();
      authStatusModal.textContent = 'התנתקת';
      await refreshPortal();
    });

    // On load, refresh
    await refreshPortal();
  })();

  // Diagnosis file display
  const diagFile = document.getElementById('diagFile');
  const diagFileName = document.getElementById('diagFileName');
  if (diagFile && diagFileName) {
    diagFile.addEventListener('change', () => {
      const f = diagFile.files && diagFile.files[0];
      diagFileName.textContent = f ? f.name : 'לא נבחר קובץ';
    });
  }

  // Diagnosis form
  const diagForm = document.getElementById('diagnosisForm');
  const diagOut = document.getElementById('diagnosisResult');
  if (diagForm) {
    diagForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(diagForm);
      diagOut.textContent = 'Analyzing...';
      try {
        // If AI disabled, show maintenance modal
        const cfg = await fetch('/api/config/env').then(r=>r.json()).catch(()=>({features:{aiEnabled:false}}));
        if (!cfg.features?.aiEnabled) {
          openFeatureModal();
          diagOut.textContent = 'AI temporarily unavailable.';
          return;
        }
        const res = await fetch('/api/diagnose', { method: 'POST', body: fd });
        const data = await res.json();
        diagOut.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        diagOut.textContent = 'Error during analysis.';
      }
    });
  }

  // Scheduler submit
  const schedulerForm = document.getElementById('schedulerForm');
  if (schedulerForm) {
    schedulerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('schedulerStatus');
      status && (status.textContent = 'שומר...');
      try {
        const client = await supa();
        if (!client) { status && (status.textContent = 'שגיאת חיבור'); return; }
        const { data: { user } } = await client.auth.getUser();
        if (!user) { status && (status.textContent = 'יש להתחבר'); return; }

        const service = document.getElementById('sched_service').value;
        const date = document.getElementById('sched_date').value;
        const winStart = document.getElementById('sched_window').value; // e.g. 08:00
        const notes = document.getElementById('sched_notes').value.trim() || null;
        if (!date || !winStart) { status && (status.textContent = 'נא למלא תאריך וחלון'); return; }
        const startIso = new Date(`${date}T${winStart}:00`).toISOString();
        // calculate 2-hour end
        const [h, m] = winStart.split(':').map(Number);
        const endDate = new Date(`${date}T${winStart}:00`);
        endDate.setHours(h + 2);
        const endIso = endDate.toISOString();

        const payload = {
          user_id: user.id,
          service_type: service,
          window_start: startIso,
          window_end: endIso,
          status: 'pending',
          notes
        };
        // Check availability before insert (server-side constraint will enforce too)
        const existing = await client.from('appointments')
          .select('id')
          .eq('window_start', startIso)
          .eq('window_end', endIso)
          .in('status', ['pending','confirmed'])
          .limit(1);
        if (existing.data && existing.data.length > 0) { status && (status.textContent = 'החלון תפוס, בחר/י חלון אחר'); return; }

        const { error } = await client.from('appointments').insert(payload).select('id');
        status && (status.textContent = error ? ('שגיאה: ' + error.message) : 'נשמר!');
        if (!error) {
          // refresh portal appointments if visible
          const evt = new Event('portal-refresh');
          window.dispatchEvent(evt);
        }
      } catch (e) {
        status && (status.textContent = 'שגיאה');
      }
    });
  }

  // Chat
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatLog = document.getElementById('chatLog');
  async function sendChat(){
    const q = chatInput.value.trim();
    if (!q) return;
    const bubble = document.createElement('div');
    bubble.className = 'p-2 rounded-lg bg-slate-100';
    bubble.textContent = 'You: ' + q;
    chatLog.appendChild(bubble);
    chatInput.value = '';
    try {
      const cfg = await fetch('/api/config/env').then(r=>r.json()).catch(()=>({features:{aiEnabled:false}}));
      if (!cfg.features?.aiEnabled) {
        openFeatureModal();
        const reply = document.createElement('div');
        reply.className = 'p-2 rounded-lg bg-white border';
        reply.textContent = 'AI chat temporarily unavailable.';
        chatLog.appendChild(reply);
        return;
      }
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
      const data = await res.json();
      const reply = document.createElement('div');
      reply.className = 'p-2 rounded-lg bg-white border';
      reply.textContent = data.answer || data.error || 'No response';
      chatLog.appendChild(reply);
    } catch (e) {
      const reply = document.createElement('div');
      reply.className = 'p-2 rounded-lg bg-white border';
      reply.textContent = 'Error contacting server.';
      chatLog.appendChild(reply);
    }
  }
  if (chatSend) chatSend.addEventListener('click', sendChat);
  if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  // Feature modal helper
  function openFeatureModal(){
    const modal = document.getElementById('featureModal');
    const close = document.getElementById('featureModalClose');
    if (!modal) return;
    modal.classList.remove('hidden');
    close && close.addEventListener('click', ()=> modal.classList.add('hidden'));
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });
  }

  // Purchase buttons
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const plan = btn.getAttribute('data-plan');
      btn.setAttribute('disabled', 'true');
      try {
        const cfg = await fetch('/api/config/env').then(r=>r.json()).catch(()=>({features:{stripeEnabled:false}}));
        if (!cfg.features?.stripeEnabled) { openFeatureModal(); return; }
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url; else alert('Failed to create session');
      } catch (e) {
        alert('Error creating checkout session');
      } finally {
        btn.removeAttribute('disabled');
      }
    });
  });
})();
