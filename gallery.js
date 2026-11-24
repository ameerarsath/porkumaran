const galleryDialog = document.querySelector('.gallery-dialog');
const galleryImage = galleryDialog?.querySelector('img');
const galleryTitle = galleryDialog?.querySelector('strong');
const galleryCredit = galleryDialog?.querySelector('span');
const gallerySource = galleryDialog?.querySelector('a');
const galleryCards = [...document.querySelectorAll('.gallery-card')];
const galleryButtons = galleryCards.map((card) => card.querySelector('.gallery-open'));
const filterButtons = [...document.querySelectorAll('.gallery-filters button')];
const moreButton = document.querySelector('.gallery-more');
const status = document.querySelector('#gallery-status');
const pageSize = 24;
let activeFilter = 'all';
let visibleCount = pageSize;
let activeIndex = 0;

function matchingCards() {
  return galleryCards.filter((card) => activeFilter === 'all' || card.dataset.category === activeFilter);
}

function renderGallery() {
  const matches = matchingCards();
  const allowed = new Set(matches.slice(0, visibleCount));
  galleryCards.forEach((card) => { card.hidden = !allowed.has(card); });
  if (status) status.textContent = `Showing ${Math.min(visibleCount, matches.length)} of ${matches.length} photographs`;
  if (moreButton) moreButton.hidden = visibleCount >= matches.length;
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    visibleCount = pageSize;
    renderGallery();
  });
});

moreButton?.addEventListener('click', () => {
  visibleCount += pageSize;
  renderGallery();
});
if (moreButton && 'IntersectionObserver' in window) {
  const loader = new IntersectionObserver((entries) => {
    if (!moreButton.hidden && entries.some((entry) => entry.isIntersecting)) {
      visibleCount += pageSize;
      renderGallery();
    }
  }, { rootMargin: '700px' });
  loader.observe(moreButton);
}

function showImage(button) {
  if (!galleryDialog || !galleryImage || !galleryTitle || !galleryCredit || !gallerySource) return;
  const activeButtons = matchingCards().map((card) => card.querySelector('.gallery-open'));
  activeIndex = activeButtons.indexOf(button);
  galleryImage.src = button.dataset.full;
  galleryImage.alt = button.dataset.title;
  galleryTitle.textContent = button.dataset.title;
  galleryCredit.textContent = button.dataset.credit;
  gallerySource.href = button.dataset.full;
  if (!galleryDialog.open) galleryDialog.showModal();
}

galleryButtons.forEach((button) => button.addEventListener('click', () => showImage(button)));
galleryDialog?.querySelector('.gallery-close')?.addEventListener('click', () => galleryDialog.close());
galleryDialog?.addEventListener('click', (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  const buttons = matchingCards().map((card) => card.querySelector('.gallery-open'));
  const step = event.key === 'ArrowRight' ? 1 : -1;
  showImage(buttons[(activeIndex + step + buttons.length) % buttons.length]);
});

renderGallery();
