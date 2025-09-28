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
    'chat': document.getElementById('panel-chat')
  };
  function setActive(id){
    Object.values(panels).forEach(el => el && el.classList.add('hidden'));
    const panel = panels[id];
    if(panel) panel.classList.remove('hidden');

    // highlight chip
    document.querySelectorAll('#serviceChips button').forEach(b => b.classList.remove('active'));
    const chip = document.querySelector(`#serviceChips button[data-tab="${id}"]`);
    if (chip) chip.classList.add('active');

    // bottom nav active icon
    document.querySelectorAll('#bottomNav .nav-icon').forEach(i => i.classList.remove('active'));
    const icon = document.querySelector(`#bottomNav [data-tab="${id}"] .nav-icon`);
    if (icon) icon.classList.add('active');
  }
  buttons.forEach(btn => btn.addEventListener('click', () => setActive(btn.getAttribute('data-tab'))));

  // Default to Diagnosis on load
  setActive('diagnosis');

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
        const res = await fetch('/api/diagnose', { method: 'POST', body: fd });
        const data = await res.json();
        diagOut.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        diagOut.textContent = 'Error during analysis.';
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

  // Purchase buttons
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const plan = btn.getAttribute('data-plan');
      btn.setAttribute('disabled', 'true');
      try {
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
