/**
 * 진행률 바 렌더링
 * @param {number} current - 현재 문항 번호 (1부터 시작)
 * @param {number} total
 * @returns {HTMLElement}
 */
export function renderProgressBar(current, total) {
  const wrapper = document.createElement('div');
  wrapper.className = 'progress-bar';

  const track = document.createElement('div');
  track.className = 'progress-bar__track';

  const fill = document.createElement('div');
  fill.className = 'progress-bar__fill';
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  fill.style.width = `${percent}%`;

  track.appendChild(fill);

  const label = document.createElement('span');
  label.className = 'progress-bar__label';
  label.textContent = `${current} / ${total}`;

  wrapper.appendChild(track);
  wrapper.appendChild(label);

  return wrapper;
}
