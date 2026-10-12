const defaultState = {
  name: 'يا جميلة',
  sender: 'الشخص الذي يحبكِ كثيرًا',
  date: '2024-02-14',
  message: 'أتمنى أن يأتيكِ هذا العام بكل ما يشبه قلبكِ: دافئًا، صادقًا، ومليئًا بالأشياء التي تجعلكِ تبتسمين دون سبب. شكرًا لأنكِ أنتِ — ببساطة، وبكل ما فيكِ.',
  photos: ['', '', '']
};
const saved = JSON.parse(localStorage.getItem('mydear-state') || 'null');
const state = { ...defaultState, ...(saved || {}) };
state.photos = [...defaultState.photos, ...(saved?.photos || [])].slice(0, 3);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fallbackPhotos = ['/images/memory-rose.jpg', '/images/memory-flowers.jpg', '/images/memory-sky.jpg'];
let memories = [
  { src: fallbackPhotos[0], kicker: 'المشهد الذي أتخيله', title: 'أن نضحك حتى نتعب' },
  { src: fallbackPhotos[1], kicker: 'تفصيل أحبّه فيكِ', title: 'أنكِ تجعلين المكان بيتًا' },
  { src: fallbackPhotos[2], kicker: 'مساحة لنا', title: 'كل الطرق معكِ' }
];
const letters = [
  { title: 'أحب فيكِ', copy: 'أحب أنكِ لا تحتاجين إلى أن تفعلي شيئًا استثنائيًا كي تكوني استثنائية. يكفيني حضوركِ، وطريقتكِ في تحويل التفاصيل الصغيرة إلى أمان.' },
  { title: 'أشتاق إلى', copy: 'أشتاق إلى كل لحظة عادية تجمعنا: سؤال سريع، مشوار بلا خطة، وضحكة لا يتذكر أيٌّ منا كيف بدأت.' },
  { title: 'أتمنى لنا', copy: 'أتمنى أن نكبر ونحن لا نزال نندهش من بعضنا، أن نختار بعضنا في الأيام السهلة والصعبة، وأن يبقى بيننا دائمًا مكان لشيء جديد.' }
];
const reasons = [
  'طريقة اهتمامكِ بالتفاصيل الصغيرة التي لا يلاحظها أحد.',
  'ضحكتكِ التي تأتي في الوقت الذي أحتاجها فيه بالضبط.',
  'قلبكِ الذي يجعل اللطف يبدو شيئًا طبيعيًا وسهلًا.',
  'شجاعتكِ حين تمشين نحو أحلامكِ حتى لو خفتِ.',
  'أنكِ تجعلينني أريد أن أكون نسخة أصدق وأحنّ من نفسي.'
];
const memoryCopies = {
  first: 'أحب الطريقة التي جعلتِ بها الأيام العادية تشبه شيئًا يستحق الاحتفال.',
  laugh: 'هناك ضحكات لا تُلتقط بالكاميرا، لكنها تبقى في الذاكرة أوضح من أي صورة.',
  today: 'اليوم، وبعد كل ما مرّ، ما زلتِ الخبر الجميل الذي لا أملّ من وصوله.'
};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function updateText() {
  $$('[data-name]').forEach((el) => el.textContent = state.name);
  $$('[data-sender]').forEach((el) => el.textContent = state.sender);
  $$('[data-final-message]').forEach((el) => el.textContent = state.message || defaultState.message);
  const date = new Date(`${state.date}T00:00:00`);
  const formatted = new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  $$('[data-date-label]').forEach((el) => el.textContent = formatted);
  document.title = `بيننا مجرّة — إلى ${state.name}`;
}
function updatePhotoCards() {
  $$('[data-lightbox]').forEach((card, index) => {
    const image = $('img', card);
    image.src = memories[index].src;
    image.onerror = () => { image.onerror = null; image.src = fallbackPhotos[index]; };
  });
}
function showToast(text) { const toast = $('#toast'); toast.textContent = text; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }
function openModal(id) { const modal = $(`#${id}`); if (!modal) return; modal.hidden = false; document.body.classList.add('modal-open'); const close = $('.modal-close', modal); close?.focus(); }
function closeModals() { $$('.modal:not([hidden])').forEach((modal) => modal.hidden = true); document.body.classList.remove('modal-open'); }
function popHeart(x, y) { if (reducedMotion) return; const el = document.createElement('span'); el.className = 'heart-pop'; el.style.left = `${x}px`; el.style.top = `${y}px`; document.body.appendChild(el); setTimeout(() => el.remove(), 1300); }

updateText();
updatePhotoCards();

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .15 });
$$('.reveal').forEach((el) => revealObserver.observe(el));

const sections = ['story', 'timeline', 'memories', 'letters', 'future', 'finale'].map((id) => document.getElementById(id));
const progressBar = $('#progress-bar'); const progressLabel = $('#progress-label');
const progressObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { const index = sections.indexOf(entry.target); progressLabel.textContent = String(index + 1).padStart(2, '0'); progressBar.style.width = `${((index + 1) / sections.length) * 100}%`; } }), { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
sections.forEach((section) => section && progressObserver.observe(section));

$$('[data-scroll]').forEach((button) => button.addEventListener('click', () => $(button.dataset.scroll)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })));
$('#start-journey')?.addEventListener('click', () => setTimeout(() => popHeart(innerWidth * .74, innerHeight * .7), 350));

$$('.timeline-item').forEach((item) => item.addEventListener('click', () => {
  $$('.timeline-item').forEach((el) => el.classList.remove('active')); item.classList.add('active');
  const reveal = $('#memory-reveal');
  if (!reducedMotion) reveal.animate([{ opacity: .25, transform: 'rotate(2deg) translateY(6px)' }, { opacity: 1, transform: 'rotate(2deg) translateY(0)' }], { duration: 350, easing: 'ease-out' });
  $('p', reveal).textContent = memoryCopies[item.dataset.memory];
}));

$$('.envelope').forEach((envelope) => envelope.addEventListener('click', (event) => {
  const index = Number(envelope.dataset.letter); const letter = letters[index];
  $$('.envelope').forEach((el) => el.classList.remove('opened')); envelope.classList.add('opened');
  $('#letter-message span').textContent = letter.title; $('#letter-message p').textContent = letter.copy;
  popHeart(event.clientX, event.clientY);
  if (index === 2) showToast('احتفظي بهذا الظرف للأيام التي تحتاجين فيها إلى ابتسامة.');
}));

$$('[data-lightbox]').forEach((card) => card.addEventListener('click', () => {
  const memory = memories[Number(card.dataset.lightbox)]; $('#lightbox-image').src = memory.src; $('#lightbox-image').alt = memory.title; $('#lightbox-kicker').textContent = memory.kicker; $('#lightbox-title').textContent = memory.title; openModal('lightbox-modal');
}));

let reasonIndex = 0;
$('#shuffle-reason')?.addEventListener('click', (event) => {
  reasonIndex = (reasonIndex + 1) % reasons.length;
  if (!reducedMotion) $('#reason-text').animate([{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'none' }], { duration: 360 });
  $('#reason-text').textContent = reasons[reasonIndex]; $('.reason-index').textContent = `${String(reasonIndex + 1).padStart(2, '0')} / ${String(reasons.length).padStart(2, '0')}`; $('.reason-progress i').style.width = `${((reasonIndex + 1) / reasons.length) * 100}%`; popHeart(event.clientX, event.clientY);
});

function updateCounter() { const start = new Date(`${state.date}T00:00:00`); const diff = Math.max(0, Date.now() - start.getTime()); const days = Math.floor(diff / 86400000); const hours = Math.floor((diff / 3600000) % 24); const minutes = Math.floor((diff / 60000) % 60); $('#days-count').textContent = String(days).padStart(3, '0'); $('#hours-count').textContent = String(hours).padStart(2, '0'); $('#minutes-count').textContent = String(minutes).padStart(2, '0'); }
updateCounter(); setInterval(updateCounter, 60000);

const foundStars = new Set(JSON.parse(sessionStorage.getItem('mydear-stars') || '[]'));
$$('[data-star]').forEach((star) => { if (foundStars.has(star.dataset.star)) star.classList.add('found'); star.addEventListener('click', (event) => { if (!foundStars.has(star.dataset.star)) { foundStars.add(star.dataset.star); sessionStorage.setItem('mydear-stars', JSON.stringify([...foundStars])); star.textContent = '♥'; star.style.color = '#ffb09b'; popHeart(event.clientX, event.clientY); showToast(foundStars.size === 3 ? 'وجدتِ كل النجوم… هذه علامة جيدة للحب الكبير.' : `وجدتِ نجمة مخفية (${foundStars.size} من 3)`); } }); });

function openCustomize() { const form = $('#customize-form'); form.name.value = state.name === defaultState.name ? '' : state.name; form.sender.value = state.sender === defaultState.sender ? '' : state.sender; form.date.value = state.date; form.message.value = state.message === defaultState.message ? '' : state.message; form.photo1.value = state.photos[0] || ''; form.photo2.value = state.photos[1] || ''; form.photo3.value = state.photos[2] || ''; openModal('customize-modal'); }
$('#personalize-open')?.addEventListener('click', openCustomize); $('#personalize-open-2')?.addEventListener('click', openCustomize);
$('#customize-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); state.name = data.get('name').trim() || defaultState.name; state.sender = data.get('sender').trim() || defaultState.sender; state.date = data.get('date') || defaultState.date; state.message = data.get('message').trim() || defaultState.message; state.photos = ['photo1', 'photo2', 'photo3'].map((key) => data.get(key).trim()); state.photos.forEach((src, index) => memories[index].src = src || fallbackPhotos[index]); localStorage.setItem('mydear-state', JSON.stringify(state)); updateText(); updatePhotoCards(); closeModals(); showToast('تم حفظ قصتكِ في هذا المتصفح. الآن صارت أقرب إليكما.'); });

$$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModals)); document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModals(); });

function confetti() { if (reducedMotion) return; for (let i = 0; i < 28; i += 1) { const piece = document.createElement('span'); piece.className = 'heart-pop'; piece.textContent = i % 3 ? '♥' : '✦'; piece.style.left = `${20 + Math.random() * 60}vw`; piece.style.top = `${35 + Math.random() * 25}vh`; piece.style.color = i % 2 ? '#ff765c' : '#ffb09b'; piece.style.animationDelay = `${Math.random() * .45}s`; document.body.appendChild(piece); setTimeout(() => piece.remove(), 1800); } }
$('#open-surprise')?.addEventListener('click', () => { confetti(); showToast(`كل عام وأنتِ بخير يا ${state.name}. هذه الرحلة لا تنتهي هنا.`); });
$('#restart-journey')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
$('#share-button')?.addEventListener('click', async () => { try { if (navigator.share) await navigator.share({ title: document.title, text: `هدية خاصة لـ ${state.name}`, url: location.href }); else { await navigator.clipboard.writeText(location.href); showToast('تم نسخ رابط الهدية. أرسليه لنفسكِ أولًا.'); } } catch { showToast('الرابط جاهز — انسخيه من شريط العنوان عندما تكونين مستعدة.'); } });

let audioContext; let audioNodes = [];
$('#music-toggle')?.addEventListener('click', () => { const button = $('#music-toggle'); if (audioContext) { audioNodes.forEach((node) => node.stop?.()); audioNodes = []; audioContext.close(); audioContext = null; button.classList.remove('playing'); showToast('أوقفتُ الموسيقى الاختيارية.'); return; } audioContext = new (window.AudioContext || window.webkitAudioContext)(); const gain = audioContext.createGain(); gain.gain.value = .025; gain.connect(audioContext.destination); [261.63, 329.63, 392].forEach((frequency, index) => { const osc = audioContext.createOscillator(); osc.type = 'sine'; osc.frequency.value = frequency; osc.detune.value = index * 4; osc.connect(gain); osc.start(); audioNodes.push(osc); }); button.classList.add('playing'); showToast('موسيقى صغيرة، لتكملي الحكاية.'); });
