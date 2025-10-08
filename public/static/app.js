// Tabs, counters, forms, chat, and plan purchase wiring
(function(){
  let supabaseDown = false;
  let allowMockAuth = false;
  const MOCK_TOKEN_KEY = 'mock_token';
  let supaClient = null;
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
      if (supaClient) return supaClient;
      const res = await fetch('/api/config/env');
      const cfg = await res.json();
      allowMockAuth = Boolean(cfg?.features?.mockAuthFallback);
      const url = cfg?.supabase?.url;
      const anon = cfg?.supabase?.anon;
      if (!url || !anon || !window.supabase) return null;
      supaClient = window.supabase.createClient(url, anon, { auth: { storageKey: 'watn-auth' } });
      return supaClient;
    } catch { return null; }
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
      window.addEventListener('portal-refresh', async ()=> { await refreshPortal(); });
      let user = null;
      try {
        const res = await client.auth.getUser();
        user = res?.data?.user || null;
      } catch (e) {
        supabaseDown = true;
      }
      // Fallback to mock only if explicitly allowed
      if (!user && supabaseDown && allowMockAuth) {
        try {
          const t = localStorage.getItem(MOCK_TOKEN_KEY);
          if (t) {
            const me = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + t } }).then(r=>r.ok?r.json():null).catch(()=>null);
            if (me && me.email) user = { id: 'mock', email: me.email };
          }
        } catch {}
      }
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
        try { await client.auth.signOut(); } catch {}
        try { localStorage.removeItem(MOCK_TOKEN_KEY); } catch {}
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

      // Prefer server-side list to avoid client RLS issues
      let list = null;
      try {
        const sess = await client.auth.getSession();
        const jwt = sess?.data?.session?.access_token;
        if (jwt) {
          const resp = await fetch('/api/portal/appointments', { headers: { 'Authorization': 'Bearer ' + jwt } });
          const j = await resp.json();
          if (resp.ok && Array.isArray(j?.data)) list = j.data;
        }
      } catch {}
      if (!list) {
        const appts = await client.rpc('get_upcoming_appointments_for_user', { p_user: uid }).catch(() => ({ data: null }));
        list = Array.isArray(appts?.data) && appts.data.length > 0 ? appts.data : null;
      }
      if (!list) {
        const a = await client
          .from('appointments')
          .select('*')
          .eq('user_id', uid)
          .order('window_start', { ascending: true })
          .limit(10);
        list = a.data || [];
      }
      if (portalAppts) {
        if (!list || list.length === 0) portalAppts.textContent = 'אין תורים';
        else portalAppts.innerHTML = list.map(x => {
          const dt = new Date(x.window_start || x.scheduled_date);
          const hh = String(dt.getHours()).padStart(2,'0');
          const mm = String(dt.getMinutes()).padStart(2,'0');
          const end = new Date(dt.getTime() + 2*60*60*1000);
          const eh = String(end.getHours()).padStart(2,'0');
          const em = String(end.getMinutes()).padStart(2,'0');
          const windowLabel = `${hh}:${mm}–${eh}:${em}`;
          const serviceLabel = x.service_type === 'maintenance' ? 'תחזוקה' : x.service_type === 'cleaning' ? 'ניקיון' : x.service_type === 'repair' ? 'תיקון' : x.service_type === 'garden' ? 'גינון' : (x.service_type || 'שירות');
          const statusLabel = x.status === 'scheduled' ? 'מתוזמן' : x.status === 'pending' ? 'בהמתנה' : x.status === 'confirmed' ? 'מאושר' : x.status === 'cancelled' ? 'בוטל' : (x.status || '');
          return `
          <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
            <div>
              <div class="font-medium">${serviceLabel}</div>
              <div class="text-xs text-slate-500">${windowLabel}, ${dt.toLocaleDateString('he-IL')}</div>
            </div>
            <div class="text-xs text-slate-500">${statusLabel}</div>
          </div>`;
        }).join('');
      }

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

      // Same-day cancel prohibition (Israel time)
      if (portalAppts) {
        try {
          const tz = 'Asia/Jerusalem';
          const nowIL = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
          // Add cancel buttons for pending appointments not on the same IL date
          const a = await client.from('appointments').select('*').eq('user_id', uid).order('window_start',{ascending:true}).limit(10);
          if (a && a.data && a.data.length > 0) {
            portalAppts.innerHTML = a.data.map(x => {
              const startIL = new Date(new Date(x.window_start).toLocaleString('en-US', { timeZone: tz }));
              const isSameDay = startIL.getFullYear()===nowIL.getFullYear() && startIL.getMonth()===nowIL.getMonth() && startIL.getDate()===nowIL.getDate();
              const canCancel = x.status !== 'cancelled' && !isSameDay;
              const hh = String(startIL.getHours()).padStart(2,'0');
              const mm = String(startIL.getMinutes()).padStart(2,'0');
              const end = new Date(startIL.getTime() + 2*60*60*1000);
              const eh = String(end.getHours()).padStart(2,'0');
              const em = String(end.getMinutes()).padStart(2,'0');
              const win = `${hh}:${mm}–${eh}:${em}`;
              const serviceLabel = x.service_type === 'maintenance' ? 'תחזוקה' : x.service_type === 'cleaning' ? 'ניקיון' : x.service_type === 'repair' ? 'תיקון' : x.service_type === 'garden' ? 'גינון' : (x.service_type || 'שירות');
              const statusLabel = x.status === 'scheduled' ? 'מתוזמן' : x.status === 'pending' ? 'בהמתנה' : x.status === 'confirmed' ? 'מאושר' : x.status === 'cancelled' ? 'בוטל' : (x.status || '');
              return `
                <div class="flex items-center justify-between border rounded-lg p-2 mb-2">
                  <div>
                    <div class="font-medium">${serviceLabel}</div>
                    <div class="text-xs text-slate-500">${win}, ${startIL.toLocaleDateString('he-IL')}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-xs text-slate-500">${statusLabel}</div>
                    ${canCancel ? `<button class="btn btn-accent" data-cancel="${x.id}">בטל</button>` : `<span class="text-xs text-slate-400">לא ניתן לבטל היום</span>`}
                  </div>
                </div>`;
            }).join('');
            // Wire cancel buttons
            portalAppts.querySelectorAll('[data-cancel]').forEach(btn => {
              btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-cancel');
                try {
                  // Call server to enforce same-day rule (Israel time)
                  const res = await fetch('/api/appointments/cancel', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
                  if (!res.ok) {
                    const data = await res.json().catch(()=>({}));
                    alert(data?.error === 'same_day_forbidden' ? 'לא ניתן לבטל באותו היום' : 'שגיאה בביטול');
                    return;
                  }
                  const evt = new Event('portal-refresh');
                  window.dispatchEvent(evt);
                } catch {
                  alert('שגיאת רשת');
                }
              });
            });
          }
        } catch {}
      }
    }

    // Modal listeners (primary)
    btnLoginModal?.addEventListener('click', async () => {
      authStatusModal.textContent = 'מתחבר...';
      try {
        if (!supabaseDown) {
          const { error } = await client.auth.signInWithPassword({ email: authEmailModal.value, password: authPasswordModal.value });
          if (!error) { authStatusModal.textContent = 'מחובר'; await refreshPortal(); return; }
          // if Supabase returned an error (not network), show it and stop
          authStatusModal.textContent = 'שגיאה: ' + error.message;
          return;
        }
      } catch (e) {
        // network error – handled below
      }
      if (!allowMockAuth) {
        authStatusModal.textContent = 'שירות התחברות אינו זמין זמנית. נסה/י שוב בעוד מספר דקות.';
        return;
      }
      // Mock fallback when allowed explicitly
      try {
        const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: authEmailModal.value, password: authPasswordModal.value }) });
        const data = await res.json();
        if (data && data.token) {
          localStorage.setItem(MOCK_TOKEN_KEY, data.token);
          authStatusModal.textContent = 'מחובר (מצב תחזוקה)';
        } else {
          authStatusModal.textContent = 'שגיאה בהתחברות (מצב תחזוקה)';
        }
      } catch {
        authStatusModal.textContent = 'שגיאת רשת';
      }
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
      try { await client.auth.signOut(); } catch {}
      try { localStorage.removeItem(MOCK_TOKEN_KEY); } catch {}
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
      diagOut.textContent = 'מנתח...';
      try {
        // If AI disabled, show maintenance modal
        const cfg = await fetch('/api/config/env').then(r=>r.json()).catch(()=>({features:{aiEnabled:false}}));
        if (!cfg.features?.aiEnabled) {
          openFeatureModal();
          diagOut.textContent = 'ה-AI אינו זמין זמנית.';
          return;
        }
        const res = await fetch('/api/diagnose', { method: 'POST', body: fd });
        const data = await res.json();
        diagOut.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        diagOut.textContent = 'שגיאה בזמן הניתוח.';
      }
    });
  }

  // Scheduler submit
  const schedulerForm = document.getElementById('schedulerForm');
  const dateInput = document.getElementById('sched_date');
  const windowSelect = document.getElementById('sched_window');

  // Disable booked windows when date changes
  async function refreshWindowAvailability() {
    if (!dateInput || !windowSelect) return;
    const date = dateInput.value;
    // Reset all options enabled by default
    Array.from(windowSelect.options).forEach(opt => opt.disabled = false);
    if (!date) return;
    try {
      const client = await supa();
      if (!client) return;
      // Fetch appointments for that date (assumes a 'window_start' column ISO date)
      const startDay = new Date(`${date}T00:00:00`).toISOString();
      const endDay = new Date(`${date}T23:59:59`).toISOString();
      const { data, error } = await client
        .from('appointments')
        .select('window_start, window_end')
        .gte('window_start', startDay)
        .lte('window_start', endDay);
      if (error || !data) return;
      const taken = new Set(
        data.map(r => {
          try {
            const s = new Date(r.window_start);
            const hh = String(s.getHours()).padStart(2,'0');
            const mm = String(s.getMinutes()).padStart(2,'0');
            // assume fixed 2h window
            const label = `${hh}:${mm}-${String((s.getHours()+2)).padStart(2,'0')}:${mm}`;
            return label;
          } catch { return ''; }
        })
      );
      Array.from(windowSelect.options).forEach(opt => {
        if (taken.has(opt.value)) opt.disabled = true;
      });
    } catch {}
  }
  if (dateInput) {
    dateInput.addEventListener('change', refreshWindowAvailability);
    // initial try
    setTimeout(refreshWindowAvailability, 0);
  }

  if (schedulerForm) {
    schedulerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('schedulerStatus');
      status && (status.textContent = 'שומר...');
      try {
        if (supabaseDown) { status && (status.textContent = 'שירות נתונים לא זמין זמנית'); return; }
        const client = await supa();
        if (!client) { status && (status.textContent = 'שגיאת חיבור'); return; }
        const { data: { user } } = await client.auth.getUser();
        if (!user) { status && (status.textContent = 'יש להתחבר'); return; }

        const service = document.getElementById('sched_service').value;
        const date = document.getElementById('sched_date').value;
        const windowVal = document.getElementById('sched_window').value; // e.g. "08:00-10:00"
        const notes = document.getElementById('sched_notes').value.trim() || null;
        if (!date || !windowVal) { status && (status.textContent = 'נא לבחור תאריך וחלון'); return; }
        const [start, end] = windowVal.split('-');
        const startIso = new Date(`${date}T${start}:00`).toISOString();
        const endIso = new Date(`${date}T${end}:00`).toISOString();

        // Server-side uniqueness (basic guard)
        const exist = await client
          .from('appointments')
          .select('id')
          .eq('window_start', startIso)
          .maybeSingle();
        if (exist && exist.data) { status && (status.textContent = 'החלון כבר נתפס. בחר/י חלון אחר.'); await refreshWindowAvailability(); return; }

        // Server-side conflict check (optional; no-op if server not configured)
        try {
          const chk = await fetch('/api/schedule/check', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ date, window: windowVal }) });
          if (chk.status === 409) { status && (status.textContent = 'החלון כבר נתפס. בחר/י חלון אחר.'); await refreshWindowAvailability(); return; }
        } catch {}

        const payload = {
          user_id: user.id,
          service_type: service,
          window_start: startIso,
          window_end: endIso,
          notes
        };
        const { error } = await client.from('appointments').insert(payload);
        status && (status.textContent = error ? ('שגיאה: ' + error.message) : 'נשמר!');
        if (!error) {
          await refreshWindowAvailability();
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
    bubble.textContent = 'את/ה: ' + q;
    chatLog.appendChild(bubble);
    chatInput.value = '';
    try {
      const cfg = await fetch('/api/config/env').then(r=>r.json()).catch(()=>({features:{aiEnabled:false}}));
      if (!cfg.features?.aiEnabled) {
        openFeatureModal();
        const reply = document.createElement('div');
        reply.className = 'p-2 rounded-lg bg-white border';
        reply.textContent = 'צ׳אט ה-AI אינו זמין זמנית.';
        chatLog.appendChild(reply);
        return;
      }
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
      const data = await res.json();
      const reply = document.createElement('div');
      reply.className = 'p-2 rounded-lg bg-white border';
      reply.textContent = data.answer || data.error || 'אין תגובה';
      chatLog.appendChild(reply);
    } catch (e) {
      const reply = document.createElement('div');
      reply.className = 'p-2 rounded-lg bg-white border';
      reply.textContent = 'שגיאה בתקשור לשרת.';
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

  // Purchase buttons - removed (no purchase buttons in current UI)
  // If re-enabled in the future, restore Stripe handler here.

  // ==== Cabinet (Equipment & Maintenance) ====
  (async function initCabinet(){
    const listEl = document.getElementById('cabinetList');
    const appEl = document.getElementById('cabinetApp');
    const signedOutEl = document.getElementById('cabinetSignedOut');
    if (!listEl) return;
    const client = await (typeof supa === 'function' ? supa() : null);
    if (!client) return;

    const sess = await client.auth.getSession();
    const uid = sess?.data?.session?.user?.id;
    if (!uid) { signedOutEl?.classList.remove('hidden'); appEl?.classList.add('hidden'); return; }
    signedOutEl?.classList.add('hidden'); appEl?.classList.remove('hidden');

    const defaults = [
      { key: 'cal_hypo_65', name: 'כלור גרגרים Cal-Hypo 65%', type: 'chemicals', unit:'ק"ג', min: 5, max: 15 },
      { key: 'muriatic_33', name: 'חומצה מוריאטית 33%', type: 'chemicals', unit:'ליטר', min: 2, max: 4 },
      { key: 'salt_chlorinator', name: 'מלח לכלורינטור', type: 'chemicals', unit:'ק"ג', min: 10, max: 50 },
      { key: 'leaf_net', name: 'רשת לאיסוף עלים', type: 'tools', unit:'יח׳', min: 1, max: 2 },
      { key: 'oring_50mm', name: 'O-Ring 50mm', type: 'parts', unit:'יח׳', min: 5, max: 20 },
      { key: 'nitrile_gloves', name: 'כפפות ניטריל', type: 'tools', unit:'זוגות', min: 8, max: 20 }
    ];

    async function save(item){
      try {
        await client.from('pool_cabinet').upsert({
          user_id: uid,
          key: item.key,
          qty: item.qty,
          threshold: item.threshold,
          notes: item.notes
        });
      } catch {}
    }

    function levelClass(item){
      if (item.qty <= 0) return 'bg-red-50 border-red-200';
      if (item.qty < item.threshold) return 'bg-amber-50 border-amber-200';
      return 'bg-emerald-50 border-emerald-200';
    }

    function levelTag(item){
      if (item.qty <= 0) return '<span class="text-red-700 text-xs">חסר</span>';
      if (item.qty < item.threshold) return '<span class="text-amber-700 text-xs">נמוך</span>';
      return '<span class="text-emerald-700 text-xs">מלא</span>';
    }

    function badgeFor(it){
      return it.type==='chemicals' ? '<span class="badge badge-chem"><i class="fas fa-flask"></i> כימיקלים</span>' :
             it.type==='tools' ? '<span class="badge badge-tool"><i class="fas fa-wrench"></i> כלים</span>' :
             '<span class="badge badge-part"><i class="fas fa-cog"></i> חלקים</span>';
    }

    function pct(it){
      const denom = Math.max(1, it.threshold||1);
      return Math.min(100, Math.round((Math.max(0,it.qty||0) / denom) * 100));
    }

    function renderAlerts(items){
      const alertsEl = document.getElementById('cabinetAlerts');
      if (!alertsEl) return;
      const missing = items.filter(i => (i.qty||0) <= 0);
      const low = items.filter(i => (i.qty||0) > 0 && (i.qty||0) < (i.threshold||0));
      if (missing.length===0 && low.length===0) { alertsEl.innerHTML = ''; return; }
      alertsEl.innerHTML = `
        <div class="alert">
          <div class="alert-title">התראות מלאי</div>
          ${missing.length>0 ? `<div class="alert-item">חסר: ${missing.map(m=>m.name).join(', ')}</div>` : ''}
          ${low.length>0 ? `<div class="alert-item">נמוך: ${low.map(m=>m.name).join(', ')}</div>` : ''}
        </div>`;
    }

    function render(items){
      renderAlerts(items);
      listEl.innerHTML = items.map(it => `
        <div class="rounded-xl border p-3 ${levelClass(it)}">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold">${it.name}</div>
              <div class="text-xs text-slate-500 flex items-center gap-2">${badgeFor(it)}
                <span>מלאי נוכחי: <b>${it.qty}</b> ${it.unit}</span>
                <span>מינימום:</span>
                <input class="border rounded px-2 py-1 text-xs w-16" type="number" min="0" value="${it.threshold}" data-thr="${it.key}" />
              </div>
            </div>
            <div>${levelTag(it)}</div>
          </div>
          <div class="mt-2">
            <div class="progress"><span style="width:${pct(it)}%;"></span></div>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <button class="btn" data-dec="${it.key}">-</button>
            <span class="text-sm w-10 text-center" data-qty="${it.key}">${it.qty}</span>
            <button class="btn" data-inc="${it.key}">+</button>
            ${ (it.qty||0) < (it.threshold||0) ? `<button class="btn btn-accent ml-auto" data-order="${it.key}">הזן הזמנה</button>` : `` }
          </div>
        </div>
      `).join('');

      // Wire inc/dec/order/threshold
      items.forEach(it => {
        const dec = listEl.querySelector(`[data-dec="${it.key}"]`);
        const inc = listEl.querySelector(`[data-inc="${it.key}"]`);
        const qEl = listEl.querySelector(`[data-qty="${it.key}"]`);
        const order = listEl.querySelector(`[data-order="${it.key}"]`);
        const thr = listEl.querySelector(`[data-thr="${it.key}"]`);
        dec?.addEventListener('click', async ()=>{ it.qty = Math.max(0, (it.qty||0)-1); qEl.textContent = it.qty; await save(it); load(); });
        inc?.addEventListener('click', async ()=>{ it.qty = (it.qty||0)+1; qEl.textContent = it.qty; await save(it); load(); });
        order?.addEventListener('click', ()=>{ alert('פתיחת הזמנה (דמו). בעתיד: חיבור ל-Stripe/ספקים.'); });
        thr?.addEventListener('change', async ()=>{ const v = parseInt(thr.value||'0',10); it.threshold = isNaN(v)?0:Math.max(0,v); await save(it); load(); });
      });
    }

    async function load(){
      let rows = [];
      try {
        const { data } = await client.from('pool_cabinet').select('*').eq('user_id', uid);
        rows = Array.isArray(data) ? data : [];
      } catch { rows = []; }
      const map = new Map(rows.map(r => [r.key, r]));
      const merged = defaults.map(d => ({ ...d, qty: map.get(d.key)?.qty ?? 0, threshold: map.get(d.key)?.threshold ?? d.min, notes: map.get(d.key)?.notes ?? '' }));
      render(merged);
    }

    // Filter buttons
    document.querySelectorAll('[data-cabinet-filter]').forEach(btn => {
      btn.addEventListener('click', async ()=>{
        const type = btn.getAttribute('data-cabinet-filter');
        const { data } = await client.from('pool_cabinet').select('*').eq('user_id', uid);
        const map = new Map((data||[]).map(r => [r.key, r]));
        const merged = defaults.map(d => ({ ...d, qty: map.get(d.key)?.qty ?? 0, threshold: map.get(d.key)?.threshold ?? d.min, notes: map.get(d.key)?.notes ?? '' }));
        const filtered = type === 'all' ? merged : merged.filter(i => i.type === type);
        render(filtered);
      });
    });

    await load();
  })();
})();
