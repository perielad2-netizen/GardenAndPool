// Basic interactivity: counters and smooth scroll
(function(){
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

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target){ e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();
