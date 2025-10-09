const TRANSITION_MS = 220;

document.querySelectorAll('.pagedMenu').forEach(pagedMenu => {
  const pages = Array.from(pagedMenu.querySelectorAll('.menuPage'));
  const nextButtons = Array.from(pagedMenu.querySelectorAll('.pagedMenuNextPage'));
  const prevButtons = Array.from(pagedMenu.querySelectorAll('.pagedMenuPreviousPage'));
  let currentPage = 0;
  let animating = false;

  pages.forEach((p, i) => {
    if (i === currentPage) {
      p.classList.remove('hidden','fading-out');
      p.style.display = ''; p.style.opacity = '1';
    } else {
      p.classList.add('hidden');
      p.style.display = 'none'; p.style.opacity = '0';
    }
  });

  function waitTransitionEnd(el, timeout = TRANSITION_MS + 50) {
    return new Promise(resolve => {
      let done = false;
      const onEnd = (e) => { if (e.propertyName === 'opacity' && !done) { done = true; cleanup(); } };
      const timer = setTimeout(() => { if (!done) { done = true; cleanup(); } }, timeout);
      function cleanup() { el.removeEventListener('transitionend', onEnd); clearTimeout(timer); resolve(); }
      el.addEventListener('transitionend', onEnd);
    });
  }

  async function changeTo(newIndex) {
    if (animating) return;
    if (newIndex === currentPage || newIndex < 0 || newIndex >= pages.length) return;
    animating = true;

    const outgoing = pages[currentPage];
    const incoming = pages[newIndex];

    outgoing.classList.add('fading-out');
    outgoing.style.opacity = '0';

    await waitTransitionEnd(outgoing);

    outgoing.classList.remove('fading-out');
    outgoing.classList.add('hidden');
    outgoing.style.display = 'none';
    outgoing.style.opacity = '0';

    incoming.classList.remove('hidden');
    incoming.style.display = '';
    incoming.style.opacity = '0';
    getComputedStyle(incoming).opacity;
    incoming.style.opacity = '1';

    await waitTransitionEnd(incoming);

    incoming.classList.remove('fading-out','hidden');
    incoming.style.opacity = '1';

    currentPage = newIndex;
    animating = false;
  }

  nextButtons.forEach(b => b.addEventListener('click', () => changeTo(Math.min(currentPage + 1, pages.length - 1))));
  prevButtons.forEach(b => b.addEventListener('click', () => changeTo(Math.max(currentPage - 1, 0))));
});
