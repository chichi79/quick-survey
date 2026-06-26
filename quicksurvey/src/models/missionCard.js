/**
 * 리워드 미션 카드 (설문, 오퍼월 광고 등 공통)
 *
 * 1단계(연애폴/퀵서베이 카드)와 2단계(오퍼월 전체 미션)가
 * 동일한 카드 컴포넌트를 재사용할 수 있도록 type 필드로 확장하는 구조.
 *
 * @typedef {Object} RewardMissionCard
 * @property {string} id
 * @property {'survey'|'ad_view'|'app_install'|'sns_follow'|'game'} type
 * @property {string} title
 * @property {string} [thumbnailUrl]
 * @property {number} rewardPoint
 * @property {number} [estimatedMinutes]
 * @property {'available'|'completed'|'closed'|'upcoming'} status
 * @property {string} actionUrl - 클릭 시 이동할 URL (딥링크)
 */

export function createMissionCard({
  id,
  type = 'survey',
  title,
  thumbnailUrl = '',
  rewardPoint = 0,
  estimatedMinutes = null,
  status = 'available',
  actionUrl = '#',
}) {
  return {
    id,
    type,
    title,
    thumbnailUrl,
    rewardPoint,
    estimatedMinutes,
    status,
    actionUrl,
  };
}

/**
 * 상태별 배지 텍스트
 */
export function getStatusLabel(status) {
  const map = {
    available: '참여 가능',
    completed: '참여 완료',
    closed: '종료',
    upcoming: '예정',
  };
  return map[status] || '';
}

/**
 * 타입별 아이콘(이모지) — 실제 서비스에서는 아이콘 컴포넌트로 교체
 */
export function getTypeIcon(type) {
  const map = {
    survey: '📋',
    ad_view: '📺',
    app_install: '📲',
    sns_follow: '🔔',
    game: '🎮',
  };
  return map[type] || '🎁';
}
