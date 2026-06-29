import { useState } from 'react';
import { QUESTION_TYPE_LABELS, type Question, type QuestionType } from '../models/question';
import type { Survey } from '../models/project';

const ADDABLE_TYPES: QuestionType[] = [
  'single_choice',
  'multiple_choice',
  'open_text',
  'numeric',
  'likert_scale',
  'matrix',
  'star_rating',
  'nps',
  'image_choice',
  'ranking',
  'emoji_reaction',
  'yes_no',
  'vs_match',
  'dropdown',
  'contact_consent',
  'slider',
];

const TYPE_BADGE: Record<QuestionType, string> = {
  single_choice: '단일',
  multiple_choice: '복수',
  likert_scale: '평가형',
  open_text: '주관',
  matrix: '평가형 복수',
  numeric: '숫자 합계',
  star_rating: '별점',
  nps: 'NPS',
  image_choice: '이미지',
  ranking: '순위',
  emoji_reaction: '이모지',
  yes_no: '예/아니오',
  vs_match: 'VS 대결',
  dropdown: '드롭다운',
  contact_consent: '개인정보',
  slider: '슬라이더',
};

const TYPE_ICON: Record<QuestionType, string> = {
  single_choice: '✓',
  multiple_choice: '☑',
  likert_scale: '•••',
  open_text: '—',
  matrix: '⊞',
  numeric: '%',
  star_rating: '★',
  nps: '⌢',
  image_choice: '🖼',
  ranking: '⠿',
  emoji_reaction: '🙂',
  yes_no: '⚖',
  vs_match: '🆚',
  dropdown: '▾',
  contact_consent: '☎',
  slider: '↔',
};

interface QuestionListProps {
  questions: Question[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (type: QuestionType) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onDuplicate: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  /** 단일 문항 설문에서는 문항 추가/복제/삭제를 막아 항상 1개를 유지한다. */
  locked?: boolean;
  /** 같은 프로젝트/다른 프로젝트의 다른 설문 목록 — "다른 설문으로 복사" 대상 후보. */
  otherSurveys?: Survey[];
  onCopyToSurvey?: (questionId: string, targetSurveyId: string) => void;
}

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
  onMove,
  onDuplicate,
  onReorder,
  locked = false,
  otherSurveys = [],
  onCopyToSurvey,
}: QuestionListProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [copyMenuId, setCopyMenuId] = useState<string | null>(null);

  const resetDragState = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="panel question-list">
      <h2>문항 목록</h2>

      <ul className="question-list__items">
        {questions.map((q, index) => (
          <li
            key={q.id}
            draggable
            className={[
              'question-list__item',
              q.id === selectedId && 'is-selected',
              q.id === draggedId && 'is-dragging',
              q.id === dragOverId && q.id !== draggedId && 'is-drag-over',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(q.id)}
            onDragStart={(e) => {
              setDraggedId(q.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedId && draggedId !== q.id) setDragOverId(q.id);
            }}
            onDragLeave={() => {
              setDragOverId((current) => (current === q.id ? null : current));
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedId && draggedId !== q.id) onReorder(draggedId, q.id);
              resetDragState();
            }}
            onDragEnd={resetDragState}
          >
            <span className="question-list__drag-handle" title="드래그해서 순서 변경">
              ⠿
            </span>
            <span className="question-list__index">Q{index + 1}</span>
            {!q.title.trim() && (
              <span className="question-list__warning" title="제목이 비어있습니다">
                ⚠
              </span>
            )}
            <div className="question-list__item-main">
              <span className="question-list__title">{q.title || '(제목 없음)'}</span>
              <span className="question-list__badge">{TYPE_BADGE[q.type]}</span>
            </div>
            <div className="question-list__item-actions">
              <button
                type="button"
                title="위로 이동"
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(q.id, -1);
                }}
              >
                ↑
              </button>
              <button
                type="button"
                title="아래로 이동"
                disabled={index === questions.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(q.id, 1);
                }}
              >
                ↓
              </button>
              {!locked && (
                <button
                  type="button"
                  title="복제"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(q.id);
                  }}
                >
                  ⧉
                </button>
              )}
              {!locked && onCopyToSurvey && otherSurveys.length > 0 && (
                <div className="question-list__copy-menu-wrap" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    title="다른 설문으로 복사"
                    onClick={() => setCopyMenuId((current) => (current === q.id ? null : q.id))}
                  >
                    ↗
                  </button>
                  {copyMenuId === q.id && (
                    <div className="question-list__copy-menu">
                      <span className="question-list__copy-menu-title">다른 설문으로 복사</span>
                      {otherSurveys.map((survey) => (
                        <button
                          key={survey.id}
                          type="button"
                          onClick={() => {
                            onCopyToSurvey(q.id, survey.id);
                            setCopyMenuId(null);
                          }}
                        >
                          {survey.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!locked && (
                <button
                  type="button"
                  title="삭제"
                  className="question-list__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(q.id);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
        {questions.length === 0 && <li className="question-list__empty">문항을 추가해보세요.</li>}
      </ul>

      {!locked && (
      <div className="question-list__add">
        <button type="button" className="question-list__add-toggle" onClick={() => setIsAddMenuOpen((v) => !v)}>
          + 문항 추가
        </button>
        {isAddMenuOpen && (
          <div className="question-list__add-menu">
            <span className="question-list__add-menu-section">문항</span>
            {ADDABLE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(type);
                  setIsAddMenuOpen(false);
                }}
              >
                <span className="question-list__add-menu-icon">{TYPE_ICON[type]}</span>
                {QUESTION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
