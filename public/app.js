const content = window.siteContent;
const screens = document.querySelectorAll('.screen');
const stageButtons = document.querySelectorAll('.stage-button');
const door = document.getElementById('main-door');
const openDoorButton = document.getElementById('open-door');
const puzzleInput = document.getElementById('puzzle-input');
const puzzleMessage = document.getElementById('puzzle-message');
const checkPuzzleButton = document.getElementById('check-puzzle');
const yearButtonsWrap = document.getElementById('year-buttons');
const stationYear = document.getElementById('station-year');
const stationPhase = document.getElementById('station-phase');
const stationText = document.getElementById('station-text');
const previousStationButton = document.getElementById('previous-station');
const nextStationButton = document.getElementById('next-station');
const stationProgress = document.getElementById('station-progress');
const starIntro = document.getElementById('star-intro');
const starProgress = document.getElementById('star-progress');
const starDecoration = document.getElementById('star-decoration');
const fallingStars = document.getElementById('falling-stars');
const starField = document.getElementById('star-field');
const starHeart = document.getElementById('star-heart');
const heartStars = document.getElementById('heart-stars');
const heartName = document.getElementById('heart-name');
const starClosing = document.getElementById('star-closing');
const starReplayList = document.getElementById('star-replay-list');
const continueFromStars = document.getElementById('continue-from-stars');
const starDialog = document.getElementById('star-dialog');
const starMessageText = document.getElementById('star-message-text');
const closeStarDialogButton = document.getElementById('close-star-dialog');
const starMessageDoneButton = document.getElementById('star-message-done');
const finalMessage = document.getElementById('final-message');
const signatureName = document.getElementById('signature-name');
const candle = document.getElementById('candle');
const extinguishButton = document.getElementById('extinguish-candle');
const finaleMessageCard = document.getElementById('finale-message-card');
const giftInvitation = document.getElementById('gift-invitation');
const giftTeaseFirst = document.getElementById('gift-tease-first');
const giftTeaseSecond = document.getElementById('gift-tease-second');
const openGiftStageButton = document.getElementById('open-gift-stage');
const giftPrompt = document.getElementById('gift-prompt');
const giftBoxScene = document.getElementById('gift-box-scene');
const giftSparkles = document.getElementById('gift-sparkles');
const openGiftButton = document.getElementById('open-gift');
const giftCard = document.getElementById('gift-card');
const giftCardSalutation = document.getElementById('gift-card-salutation');
const giftCardImage = document.getElementById('gift-card-image');
const giftCardParagraphs = document.getElementById('gift-card-paragraphs');
const giftCardClosing = document.getElementById('gift-card-closing');
const giftCardSignature = document.getElementById('gift-card-signature');
const giftCardHeart = document.getElementById('gift-card-heart');
const giftActions = document.getElementById('gift-actions');
const saveGiftCardButton = document.getElementById('save-gift-card');
const reopenGiftButton = document.getElementById('reopen-gift');
const restartButton = document.getElementById('restart-journey');
const restartFromGiftButton = document.getElementById('restart-from-gift');
const toast = document.getElementById('toast');

let activeScreen = 'secret-door';
let activeYearIndex = 0;
let discoveredStars = loadDiscoveredStars();
let previousStarFocus = null;
let giftAnimationTimers = [];
let giftInvitationTimer = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadDiscoveredStars() {
  try {
    const stored = JSON.parse(sessionStorage.getItem('mydear-discovered-stars') || '[]');
    return Array.isArray(stored)
      ? stored.filter((index) => Number.isInteger(index) && index >= 0 && index < content.stars.messages.length)
      : [];
  } catch (error) {
    console.warn('تعذر استعادة تقدم النجوم من جلسة المتصفح.', error);
    return [];
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('show'), 2600);
}

function showScreen(name) {
  activeScreen = name;
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === name);
  });
  stageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.screen === name);
  });
  window.scrollTo(0, 0);
}

function applyPersonalizedContent() {
  document.title = content.title;
  document.querySelector('meta[name="description"]').content = content.title;
  document.querySelector('.brand > span:last-child').textContent = `إلى ${content.herName}`;
  document.querySelector('.door-text').textContent = `${content.herName}...`;

  const secretCopy = document.querySelector('.secret-copy');
  secretCopy.querySelector('.eyebrow').textContent = content.secretDoor.eyebrow;
  secretCopy.querySelectorAll('p:not(.eyebrow)').forEach((paragraph, index) => {
    paragraph.textContent = content.secretDoor.intro[index];
  });
  openDoorButton.textContent = content.secretDoor.button;

  document.querySelector('#puzzle .eyebrow').textContent = content.puzzle.eyebrow;
  document.querySelector('#puzzle h2').textContent = content.puzzle.title;
  document.querySelector('#puzzle .soft-copy').textContent = content.puzzle.description;
  puzzleInput.placeholder = content.puzzle.placeholder;
  checkPuzzleButton.textContent = content.puzzle.button;
  document.querySelector('#finale .finale-card h2').textContent = content.finalGreeting;
  starIntro.textContent = content.stars.intro;
  starClosing.textContent = content.stars.closing;
  continueFromStars.textContent = content.stars.continue;
  giftTeaseFirst.textContent = content.gift.teaseFirst;
  giftTeaseSecond.textContent = content.gift.teaseSecond;
  giftPrompt.textContent = content.gift.prompt;
  renderGiftCard();
}

function openDoorSequence() {
  door.classList.add('opened');
  setTimeout(() => showScreen('puzzle'), 700);
}

function renderPuzzle() {
  const label = document.querySelector('#puzzle label');
  label.textContent = content.puzzle.question;
  puzzleInput.value = '';
  puzzleMessage.textContent = '';
  puzzleMessage.className = 'puzzle-message';
}

function renderTimeMachine() {
  yearButtonsWrap.innerHTML = '';

  content.years.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `year-button${index === 0 ? ' active' : ''}`;
    button.textContent = item.year;
    button.setAttribute('aria-label', `${item.year} ${item.phase}`);
    const angle = (index / content.years.length) * Math.PI * 2 - Math.PI / 2;
    const radiusPercent = 40;
    const x = 50 + Math.cos(angle) * radiusPercent;
    const y = 50 + Math.sin(angle) * radiusPercent;
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.addEventListener('click', () => {
      activeYearIndex = index;
      renderStation();
    });
    yearButtonsWrap.appendChild(button);
  });

  renderStation();
}

function renderStation() {
  const current = content.years[activeYearIndex];
  stationYear.textContent = current.year;
  stationPhase.textContent = current.phase;
  stationText.textContent = current.text;

  const buttons = document.querySelectorAll('.year-button');
  buttons.forEach((button, index) => {
    button.classList.toggle('active', index === activeYearIndex);
    button.setAttribute('aria-pressed', String(index === activeYearIndex));
  });
  previousStationButton.disabled = activeYearIndex === 0;
  nextStationButton.disabled = false;
  nextStationButton.textContent = activeYearIndex === content.years.length - 1
    ? 'اكتملت الذكريات'
    : 'المحطة التالية';
  stationProgress.textContent = `${activeYearIndex + 1} / ${content.years.length}`;
}

function moveStation(offset) {
  const nextIndex = activeYearIndex + offset;
  if (nextIndex < 0) return;
  if (nextIndex >= content.years.length) {
    renderStars();
    showScreen('star-sky');
    return;
  }
  activeYearIndex = nextIndex;
  renderStation();
}

function renderStars() {
  starDecoration.innerHTML = '';
  starField.innerHTML = '';
  heartStars.innerHTML = '';
  starReplayList.innerHTML = '';
  const positions = [
    [14, 34],
    [34, 19],
    [50, 42],
    [68, 23],
    [86, 37]
  ];

  for (let index = 0; index < 36; index += 1) {
    const fleck = document.createElement('span');
    fleck.className = 'star-fleck';
    fleck.style.left = `${(index * 47 + 13) % 100}%`;
    fleck.style.top = `${(index * 71 + 17) % 100}%`;
    fleck.style.animationDelay = `${(index % 9) * -0.47}s`;
    starDecoration.appendChild(fleck);
  }

  content.stars.messages.forEach((message, index) => {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = `interactive-star${discoveredStars.includes(index) ? ' discovered' : ''}`;
    star.style.left = `${positions[index][0]}%`;
    star.style.top = `${positions[index][1]}%`;
    star.setAttribute('aria-label', discoveredStars.includes(index)
      ? `إعادة قراءة الرسالة ${index + 1}`
      : `اكتشفي النجمة ${index + 1}`);
    star.setAttribute('aria-pressed', String(discoveredStars.includes(index)));
    star.innerHTML = '<span aria-hidden="true">✦</span>';
    star.addEventListener('click', () => openStarMessage(index, star));
    starField.appendChild(star);

    const heartStar = document.createElement('span');
    heartStar.className = 'heart-constellation-star';
    heartStar.textContent = '✦';
    heartStars.appendChild(heartStar);

    const replayButton = document.createElement('button');
    replayButton.type = 'button';
    replayButton.textContent = String(index + 1);
    replayButton.setAttribute('aria-label', `إعادة قراءة الرسالة ${index + 1}`);
    replayButton.addEventListener('click', () => openStarMessage(index, replayButton));
    starReplayList.appendChild(replayButton);
  });

  updateStarProgress();
}

function updateStarProgress() {
  const found = discoveredStars.length;
  starProgress.textContent = `${found} / ${content.stars.messages.length} ${content.stars.progress}`;
  starField.querySelectorAll('.interactive-star').forEach((star, index) => {
    const discovered = discoveredStars.includes(index);
    star.classList.toggle('discovered', discovered);
    star.setAttribute('aria-pressed', String(discovered));
    star.setAttribute('aria-label', discovered
      ? `إعادة قراءة الرسالة ${index + 1}`
      : `اكتشفي النجمة ${index + 1}`);
  });

  const complete = found === content.stars.messages.length;
  starHeart.hidden = !complete;
  continueFromStars.hidden = !complete;
  starField.classList.toggle('complete', complete);
  if (complete && !starHeart.classList.contains('revealed')) {
    requestAnimationFrame(() => starHeart.classList.add('revealed'));
  }
}

function openStarMessage(index, starButton) {
  previousStarFocus = starButton;
  starMessageText.textContent = content.stars.messages[index];
  starDialog.hidden = false;
  document.body.classList.add('dialog-open');
  closeStarDialogButton.focus();

  if (!discoveredStars.includes(index)) {
    discoveredStars.push(index);
    try {
      sessionStorage.setItem('mydear-discovered-stars', JSON.stringify(discoveredStars));
    } catch (error) {
      console.warn('تعذر حفظ تقدم النجوم في جلسة المتصفح؛ سيبقى محفوظًا لهذه الزيارة.', error);
    }
    updateStarProgress();
  }
}

function closeStarMessage() {
  if (starDialog.hidden) return;
  starDialog.hidden = true;
  document.body.classList.remove('dialog-open');
  if (previousStarFocus) previousStarFocus.focus();
}

function renderGiftCard() {
  const gift = content.gift;
  giftCardSalutation.textContent = gift.salutation;
  giftCardParagraphs.innerHTML = '';
  gift.paragraphs.forEach((paragraph) => {
    const element = document.createElement('p');
    element.textContent = paragraph;
    giftCardParagraphs.appendChild(element);
  });
  giftCardClosing.textContent = gift.closing;
  giftCardSignature.textContent = gift.signature;
  giftCardHeart.textContent = gift.heart;

  giftCardImage.hidden = !gift.image;
  if (gift.image) {
    giftCardImage.src = gift.image;
    giftCardImage.alt = `صورة تذكارية لريما`;
    giftCardImage.onerror = () => {
      giftCardImage.hidden = true;
      showToast('تعذر تحميل صورة البطاقة؛ يمكنكِ متابعة الهدية دونها.');
    };
  } else {
    giftCardImage.removeAttribute('src');
  }
}

function clearGiftTimers() {
  giftAnimationTimers.forEach((timer) => window.clearTimeout(timer));
  giftAnimationTimers = [];
  window.clearTimeout(giftInvitationTimer);
}

function revealGiftInvitation() {
  giftInvitation.hidden = false;
  giftTeaseFirst.classList.add('visible');
  giftInvitationTimer = window.setTimeout(() => {
    giftTeaseSecond.classList.add('visible');
    openGiftStageButton.classList.add('visible');
  }, reducedMotion ? 0 : 900);
}

function resetGiftStage() {
  giftAnimationTimers.forEach((timer) => window.clearTimeout(timer));
  giftAnimationTimers = [];
  giftBoxScene.classList.remove('opening', 'opened');
  giftSparkles.innerHTML = '';
  giftCard.hidden = true;
  giftCard.classList.remove('revealed');
  giftActions.hidden = true;
  openGiftButton.hidden = false;
  openGiftButton.disabled = false;
  openGiftButton.textContent = 'افتحي هديتكِ';
}

function openGift() {
  if (giftBoxScene.classList.contains('opening') || giftBoxScene.classList.contains('opened')) return;
  openGiftButton.disabled = true;
  giftBoxScene.classList.add('opening');

  giftAnimationTimers.push(window.setTimeout(() => {
    giftBoxScene.classList.add('opened');
    createGiftSparkles();
  }, reducedMotion ? 0 : 550));

  giftAnimationTimers.push(window.setTimeout(() => {
    giftCard.hidden = false;
    giftActions.hidden = false;
    openGiftButton.hidden = true;
    giftCard.classList.add('revealed');
  }, reducedMotion ? 0 : 1450));
}

function createGiftSparkles() {
  const symbols = ['✦', '♥', '✧', '·', '♡', '✦', '·', '♥'];
  symbols.forEach((symbol, index) => {
    const particle = document.createElement('span');
    particle.className = 'gift-particle';
    particle.textContent = symbol;
    particle.style.setProperty('--particle-x', `${(index % 2 ? 1 : -1) * (35 + (index * 19) % 100)}px`);
    particle.style.setProperty('--particle-y', `${-45 - (index * 23) % 115}px`);
    particle.style.animationDelay = `${(index % 4) * 90}ms`;
    giftSparkles.appendChild(particle);
  });
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      context.fillText(line, x, currentY, maxWidth);
      currentY += lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) {
    context.fillText(line, x, currentY, maxWidth);
    currentY += lineHeight;
  }
  return currentY;
}

async function saveGiftCardAsPng() {
  saveGiftCardButton.disabled = true;
  try {
    const scale = 2;
    const width = 1200;
    const height = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable in this browser.');
    context.scale(scale, scale);

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#fff4f7');
    background.addColorStop(1, '#f2d9e3');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = '#9d315c';
    context.lineWidth = 3;
    context.strokeRect(42, 42, width - 84, height - 84);
    context.strokeStyle = 'rgba(157, 49, 92, 0.32)';
    context.lineWidth = 1;
    context.strokeRect(58, 58, width - 116, height - 116);
    context.textAlign = 'center';
    context.direction = 'rtl';
    context.fillStyle = '#a52f5b';
    context.font = '52px Tahoma, Arial, sans-serif';
    context.fillText('✦', width / 2, 140);
    context.textAlign = 'right';
    context.fillStyle = '#55182f';
    context.font = 'bold 54px Tahoma, Arial, sans-serif';
    let y = drawWrappedText(context, content.gift.salutation, width - 105, 250, width - 210, 82);

    if (content.gift.image) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = content.gift.image;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error('تعذر تحميل صورة البطاقة للتصدير.'));
      });
      const imageWidth = 330;
      const imageHeight = image.height * (imageWidth / image.width);
      context.drawImage(image, (width - imageWidth) / 2, y, imageWidth, imageHeight);
      y += imageHeight + 48;
    }

    context.fillStyle = '#5a3546';
    context.font = '34px Tahoma, Arial, sans-serif';
    content.gift.paragraphs.forEach((paragraph) => {
      y = drawWrappedText(context, paragraph, width - 105, y, width - 210, 62) + 24;
    });
    context.fillStyle = '#8e2851';
    context.font = '38px Tahoma, Arial, sans-serif';
    y = drawWrappedText(context, content.gift.closing, width - 105, y + 12, width - 210, 64);
    context.font = 'bold 42px Tahoma, Arial, sans-serif';
    drawWrappedText(context, `${content.gift.signature} ${content.gift.heart}`, width - 105, y + 24, width - 210, 68);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('تعذر إنشاء صورة PNG في هذا المتصفح.');
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'هدية-ريما.png';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    showToast('تم تجهيز البطاقة التذكارية بصيغة PNG.');
  } catch (error) {
    console.error('تعذر حفظ بطاقة الهدية كصورة PNG.', error);
    showToast('تعذر حفظ البطاقة كصورة. جربي متصفحًا أحدث أو أزيلي الصورة الاختيارية.');
  } finally {
    saveGiftCardButton.disabled = false;
  }
}

function checkPuzzle() {
  const answer = (puzzleInput.value || '').trim();
  if (!answer) {
    showToast('اكتب الإجابة أولًا');
    return;
  }

  if (answer === content.puzzle.answer) {
    puzzleMessage.textContent = `${content.puzzle.success} ${content.puzzle.successDetail}`;
    puzzleMessage.className = 'puzzle-message success';
    showToast('أحسنتِ، المفتاح الأول موجود.');
    setTimeout(() => {
      renderTimeMachine();
      showScreen('time-machine');
    }, 800);
  } else {
    puzzleMessage.textContent = content.puzzle.fail;
    puzzleMessage.className = 'puzzle-message error';
    showToast('اقتربتِ... حاول مرة أخرى');
  }
}

function finalizeMessage() {
  finalMessage.textContent = content.finalMessage;
  signatureName.textContent = content.finalSignature;
}

function prepareCandleStage() {
  candle.classList.remove('off');
  candle.classList.add('lit');
  finaleMessageCard.hidden = true;
  extinguishButton.textContent = 'إطفاء الشمعة';
  extinguishButton.disabled = false;
}

function resetJourney() {
  clearGiftTimers();
  door.classList.remove('opened');
  activeYearIndex = 0;
  discoveredStars = [];
  starHeart.classList.remove('revealed');
  try {
    sessionStorage.removeItem('mydear-discovered-stars');
  } catch (error) {
    console.warn('تعذر مسح تقدم النجوم من جلسة المتصفح.', error);
  }
  closeStarMessage();
  renderStars();
  renderTimeMachine();
  renderPuzzle();
  prepareCandleStage();
  giftInvitation.hidden = true;
  giftTeaseFirst.classList.remove('visible');
  giftTeaseSecond.classList.remove('visible');
  openGiftStageButton.classList.remove('visible');
  resetGiftStage();
  showScreen('secret-door');
}

openDoorButton.addEventListener('click', openDoorSequence);
checkPuzzleButton.addEventListener('click', checkPuzzle);
previousStationButton.addEventListener('click', () => moveStation(-1));
nextStationButton.addEventListener('click', () => moveStation(1));
continueFromStars.addEventListener('click', () => {
  prepareCandleStage();
  showScreen('finale');
});
puzzleInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkPuzzle();
  }
});

stageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.screen;
    if (target === 'time-machine') {
      renderTimeMachine();
    }
    if (target === 'star-sky') {
      renderStars();
    }
    if (target === 'finale' && !candle.classList.contains('off')) {
      prepareCandleStage();
    }
    showScreen(target);
  });
});

closeStarDialogButton.addEventListener('click', closeStarMessage);
starMessageDoneButton.addEventListener('click', closeStarMessage);
starDialog.querySelectorAll('[data-close-star-dialog]').forEach((element) => {
  element.addEventListener('click', closeStarMessage);
});
document.addEventListener('keydown', (event) => {
  if (starDialog.hidden) return;
  if (event.key === 'Escape') {
    closeStarMessage();
    return;
  }
  if (event.key === 'Tab') {
    const first = closeStarDialogButton;
    const last = starMessageDoneButton;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
const starScene = document.querySelector('.star-scene');
starScene.addEventListener('pointermove', (event) => {
  if (activeScreen !== 'star-sky' || reducedMotion || event.pointerType === 'touch') return;
  const bounds = starScene.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -8;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -6;
  starField.style.setProperty('--parallax-x', `${x}px`);
  starField.style.setProperty('--parallax-y', `${y}px`);
});
starScene.addEventListener('pointerleave', () => {
  starField.style.setProperty('--parallax-x', '0px');
  starField.style.setProperty('--parallax-y', '0px');
});

extinguishButton.addEventListener('click', () => {
  if (candle.classList.contains('off')) return;
  clearGiftTimers();
  candle.classList.add('off');
  candle.classList.remove('lit');
  finalizeMessage();
  finaleMessageCard.hidden = false;
  giftInvitation.hidden = true;
  giftTeaseFirst.classList.remove('visible');
  giftTeaseSecond.classList.remove('visible');
  openGiftStageButton.classList.remove('visible');
  extinguishButton.textContent = 'انطفأت الشمعة';
  extinguishButton.disabled = true;
  showToast('كل عام وأنتِ بخير يا ريما');
  giftInvitationTimer = window.setTimeout(revealGiftInvitation, reducedMotion ? 0 : 850);
});

openGiftStageButton.addEventListener('click', () => {
  resetGiftStage();
  renderGiftCard();
  showScreen('gift-box-stage');
});
openGiftButton.addEventListener('click', openGift);
reopenGiftButton.addEventListener('click', () => {
  resetGiftStage();
  openGift();
});
saveGiftCardButton.addEventListener('click', saveGiftCardAsPng);
restartFromGiftButton.addEventListener('click', resetJourney);
restartButton.addEventListener('click', resetJourney);

renderPuzzle();
renderStars();
renderTimeMachine();
prepareCandleStage();
applyPersonalizedContent();
heartName.textContent = content.herName;
showScreen('secret-door');
