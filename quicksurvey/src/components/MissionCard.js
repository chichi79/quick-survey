import { getStatusLabel, getTypeIcon } from '../models/missionCard.js';

/**
 * 미션 카드 DOM 엘리먼트 생성
 * @param {import('../models/missionCard.js').RewardMissionCard} card
 * @param {(card: any) => void} onClick
 * @returns {HTMLElement}
 */
export function renderMissionCard(card, onClick) {
  const el = document.createElement('article');
  el.className = `mission-card mission-card--${card.status}`;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.dataset.cardId = card.id;

  const thumb = document.createElement('div');
  thumb.className = 'mission-card__thumb';
  if (card.thumbnailUrl) {
    const img = document.createElement('img');
    img.src = card.thumbnailUrl;
    img.alt = card.title;
    thumb.appendChild(img);
  } else {
    thumb.textContent = getTypeIcon(card.type);
    thumb.classList.add('mission-card__thumb--placeholder');
  }

  const body = document.createElement('div');
  body.className = 'mission-card__body';

  const title = document.createElement('h3');
  title.className = 'mission-card__title';
  title.textContent = card.title;

  const meta = document.createElement('div');
  meta.className = 'mission-card__meta';

  const reward = document.createElement('span');
  reward.className = 'mission-card__reward';
  reward.textContent = `+${card.rewardPoint.toLocaleString()}P`;

  meta.appendChild(reward);

  if (card.estimatedMinutes) {
    const time = document.createElement('span');
    time.className = 'mission-card__time';
    time.textContent = `약 ${card.estimatedMinutes}분`;
    meta.appendChild(time);
  }

  const badge = document.createElement('span');
  badge.className = `mission-card__badge mission-card__badge--${card.status}`;
  badge.textContent = getStatusLabel(card.status);

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(badge);

  el.appendChild(thumb);
  el.appendChild(body);

  const isClickable = card.status === 'available';
  if (isClickable) {
    el.addEventListener('click', () => onClick?.(card));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(card);
      }
    });
  } else {
    el.classList.add('mission-card--disabled');
    el.setAttribute('aria-disabled', 'true');
  }

  return el;
}

/**
 * 미션 카드 리스트(그리드) 렌더링
 * @param {HTMLElement} container
 * @param {import('../models/missionCard.js').RewardMissionCard[]} cards
 * @param {(card: any) => void} onCardClick
 */
export function renderMissionList(container, cards, onCardClick) {
  container.innerHTML = '';

  if (!cards.length) {
    const empty = document.createElement('p');
    empty.className = 'mission-list__empty';
    empty.textContent = '지금 참여할 수 있는 설문이 없어요.';
    container.appendChild(empty);
    return;
  }

  cards.forEach((card) => {
    container.appendChild(renderMissionCard(card, onCardClick));
  });
}
