const menuButton = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const search = document.querySelector('#record-search');
if (search) {
  const records = [...document.querySelectorAll('.record')];
  const count = document.querySelector('#record-count');
  const filter = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    records.forEach(record => {
      const show = record.textContent.toLocaleLowerCase().includes(query);
      record.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} of ${records.length} records shown`;
  };
  search.addEventListener('input', filter);
  filter();
}
