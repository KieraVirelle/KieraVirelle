const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const moths = document.querySelectorAll('.moth-icon--fly');
const cards = document.querySelectorAll('.card');
const cardModal = document.getElementById('card-modal');
const cardModalBody = cardModal ? cardModal.querySelector('.card-modal__body') : null;
const cardModalClose = cardModal ? cardModal.querySelector('.card-modal__close') : null;

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;

    tabButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn === button);
      btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.id === target);
    });
  });
});

document.querySelectorAll('[data-accordion]').forEach((item) => {
  const trigger = item.querySelector('.accordion__trigger');
  const body = item.querySelector('.accordion__body');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('[data-accordion]').forEach((acc) => {
      acc.classList.remove('is-open');
      acc.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      acc.querySelector('.accordion__body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = `${body.scrollHeight}px`;
    }
  });
});

const randomBetween = (min, max) => Math.random() * (max - min) + min;

moths.forEach((moth) => {
  const size = randomBetween(110, 170);
  const dur = randomBetween(14, 22);
  const delay = randomBetween(-6, 3);
  const x0 = `${randomBetween(-50, 50)}px`;
  const y0 = `${randomBetween(-35, 35)}px`;
  const x1 = `${randomBetween(-150, 180)}px`;
  const y1 = `${randomBetween(-120, 120)}px`;
  const r0 = `${randomBetween(-4, 4)}deg`;
  const r1 = `${randomBetween(-12, 12)}deg`;

  const posTop = randomBetween(6, 88);
  const posLeft = randomBetween(6, 90);

  moth.style.setProperty('--size', `${size}px`);
  moth.style.setProperty('--dur', `${dur}s`);
  moth.style.setProperty('--x0', x0);
  moth.style.setProperty('--y0', y0);
  moth.style.setProperty('--x1', x1);
  moth.style.setProperty('--y1', y1);
  moth.style.setProperty('--r0', r0);
  moth.style.setProperty('--r1', r1);
  moth.style.top = `${posTop}%`;
  moth.style.left = `${posLeft}%`;
  moth.style.animationDelay = `${delay}s`;
});

const openCardModal = (card) => {
  if (!cardModal || !cardModalBody) return;
  cardModalBody.innerHTML = card.innerHTML;
  cardModal.classList.add('is-active');
  document.body.classList.add('modal-open');
};

cards.forEach((card) => {
  card.addEventListener('click', () => openCardModal(card));
});

if (cardModalClose) {
  cardModalClose.addEventListener('click', () => {
    cardModal.classList.remove('is-active');
    document.body.classList.remove('modal-open');
  });
}

if (cardModal) {
  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) {
      cardModal.classList.remove('is-active');
      document.body.classList.remove('modal-open');
    }
  });
}
