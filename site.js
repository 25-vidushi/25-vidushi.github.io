const theme = document.querySelector('#theme');
const root = document.documentElement;
theme.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
theme.addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  theme.setAttribute('aria-pressed', String(dark));
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});

const copy = document.querySelector('#copy');
let resetCopy;
copy?.addEventListener('click', async () => {
  const mail = document.querySelector('#email-address');
  try {
    await navigator.clipboard.writeText(mail.textContent);
    copy.textContent = 'Copied';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(mail);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copy.textContent = 'Email selected';
  }
  clearTimeout(resetCopy);
  resetCopy = setTimeout(() => { copy.textContent = 'Copy'; }, 1800);
});

const pages = [
  ['Home', 'index.html'],
  ['Research', 'research.html'],
  ['Distilled language models · IISc', 'research.html#p-distill'],
  ['VR driving and biosignals · IIT Kharagpur', 'research.html#p-bio'],
  ['Experience · Goldman Sachs, Decentro, Ecera', 'experience.html'],
  ['Projects · Q-Secure, hybrid cloud', 'projects.html'],
  ['Education · IIT Kharagpur', 'projects.html#education'],
  ['Honors · Mitacs, Nomura, Codeforces', 'projects.html#honors'],
  ['Mentoring and service · Goldman Sachs and IIT Kharagpur', 'projects.html#mentoring'],
  ['Contact · email, LinkedIn, GitHub, CV', 'contact.html'],
  ['CV (PDF)', 'assets/vidushi-agarwal-cv.pdf']
];
const finder = document.querySelector('#finder');
const query = document.querySelector('#query');
const results = document.querySelector('#results');
function updateResults() {
  results.replaceChildren();
  for (const [name, url] of pages) {
    if (!name.toLowerCase().includes(query.value.trim().toLowerCase())) continue;
    const link = document.createElement('a');
    link.textContent = name;
    link.href = url;
    const item = document.createElement('li');
    item.append(link);
    results.append(item);
  }
  if (!results.childElementCount) {
    const empty = document.createElement('li');
    empty.textContent = 'No matches.';
    results.append(empty);
  }
}
function openSearch() {
  query.value = '';
  updateResults();
  finder.showModal();
  query.focus();
}
document.querySelector('#search').addEventListener('click', openSearch);
query.addEventListener('input', updateResults);
results.addEventListener('click', event => {
  if (event.target.closest('a')) finder.close();
});
query.addEventListener('keydown', event => {
  if (event.key === 'Enter') results.querySelector('a')?.click();
  if (event.key === 'Escape') { event.preventDefault(); finder.close(); }
});
finder.addEventListener('click', event => { if (event.target === finder) finder.close(); });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (finder.open) finder.close();
    else openSearch();
  }
});
