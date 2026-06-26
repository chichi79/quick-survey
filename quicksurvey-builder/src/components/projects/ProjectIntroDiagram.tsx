export function ProjectIntroDiagram() {
  return (
    <svg
      className="project-list-page__intro-diagram"
      viewBox="0 0 280 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="프로젝트 하나에 설문 여러 개가 담기는 구조 다이어그램"
    >
      <rect x="8" y="16" width="264" height="112" rx="16" fill="var(--color-accent-light)" stroke="var(--color-accent)" strokeWidth="1.5" />
      <text x="24" y="38" fontSize="13" fontWeight="700" fill="var(--color-accent)">
        프로젝트
      </text>

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${28 + i * 82}, 52)`}>
          <rect width="68" height="58" rx="10" fill="#fff" stroke="var(--color-border)" strokeWidth="1.5" />
          <rect x="10" y="12" width="48" height="6" rx="3" fill="var(--color-text-muted)" opacity="0.5" />
          <rect x="10" y="24" width="34" height="6" rx="3" fill="var(--color-text-muted)" opacity="0.3" />
          <rect x="10" y="40" width="22" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}
