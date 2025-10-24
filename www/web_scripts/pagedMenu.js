const TRANSITION_MS = 220;

document.querySelectorAll('.pagedMenu').forEach(pagedMenu => {
  const pages = Array.from(pagedMenu.querySelectorAll('.menuPage'));
  const nextButtons = Array.from(pagedMenu.querySelectorAll('.pagedMenuNextPage'));
  const prevButtons = Array.from(pagedMenu.querySelectorAll('.pagedMenuPreviousPage'));
  const pageButtons = Array.from(pagedMenu.querySelectorAll('.pagedMenuPageButton'));
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

  nextButtons.forEach(btn => {
    if (!btn.dataset.defaultText) btn.dataset.defaultText = btn.innerHTML;
  });

  function waitTransitionEnd(el, timeout = TRANSITION_MS + 50) {
    return new Promise(resolve => {
      let done = false;
      const onEnd = e => {
        if (e.propertyName === 'opacity' && !done) { done = true; cleanup(); }
      };
      const timer = setTimeout(() => { if (!done) { done = true; cleanup(); } }, timeout);
      function cleanup() { el.removeEventListener('transitionend', onEnd); clearTimeout(timer); resolve(); }
      el.addEventListener('transitionend', onEnd);
    });
  }

  function updateButtons() {
    nextButtons.forEach(btn => {
      const onFinishText = btn.dataset.onFinishText;
      const defaultText = btn.dataset.defaultText;

      if (currentPage === pages.length - 1) {
        if (onFinishText) btn.innerHTML = onFinishText;
        btn.classList.add('on-finish');
      } else {
        btn.innerHTML = defaultText;
        btn.classList.remove('on-finish');
      }

    });
  }

  function updateNavButton() {
    pagedMenu.querySelectorAll(".pagedMenuPageButton.selected").forEach((b) => {
      b.classList.remove('selected');
    })
    pagedMenu.querySelectorAll(`[data-page='${currentPage}']`).forEach((b) => {
      b.classList.add('selected');
    })
  }

  async function changeTo(newIndex) {
    if (animating) return;
    if (newIndex === currentPage || newIndex < 0 || newIndex >= pages.length) return;
    animating = true;
    
    const outgoing = pages[currentPage];
    const incoming = pages[newIndex];
    
    document.dispatchEvent(new CustomEvent('pagedMenu:change', { detail: { page: newIndex, old: currentPage } }));
    currentPage = newIndex;
    updateNavButton();

    outgoing.classList.add('fading-out');
    outgoing.style.opacity = '0';
    await waitTransitionEnd(outgoing);

    outgoing.classList.add('hidden');
    outgoing.style.display = 'none';
    incoming.classList.remove('hidden');
    incoming.style.display = '';
    incoming.style.opacity = '0';
    getComputedStyle(incoming).opacity;
    incoming.style.opacity = '1';
    await waitTransitionEnd(incoming);

    animating = false;
    updateButtons();
  }

  nextButtons.forEach(b => b.addEventListener('click', async () => {
    if (currentPage === pages.length - 1) {
      const action = b.dataset.onFinishFunction;
      if (currentPage === pages.length - 1) {
        if (action) {
          document.dispatchEvent(new CustomEvent('pagedMenu:finish', { detail: { button: b } }));
        }
      }
      return;
    }
    await changeTo(currentPage + 1);
  }));

  prevButtons.forEach(b => b.addEventListener('click', async () => {
    await changeTo(currentPage - 1);
  }));

  pageButtons.forEach(b => b.addEventListener('click', async () => {
    await changeTo(Number(b.dataset.page));
  }))

  document.dispatchEvent(new CustomEvent('pagedMenu:change', { detail: { page: currentPage, old: currentPage } }));
  updateButtons();
  updateNavButton();
});
