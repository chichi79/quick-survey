import { useEffect, useRef } from 'react';
import type { Question } from '../../models/question';
import { QuestionPreviewBody } from './QuestionPreviewBody';

interface PreviewPaneProps {
  questions: Question[];
  selectedId: string | null;
  onSelectQuestion: (id: string) => void;
}

export function PreviewPane({ questions, selectedId, onSelectQuestion }: PreviewPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 스크롤로 화면 가운데에 들어온 카드를 좌측 목록 선택 상태와 동기화
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || questions.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.questionId;
          if (!id) continue;
          ratios.set(id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestId !== selectedId) {
          onSelectQuestion(bestId);
        }
      },
      { root, threshold: [0.25, 0.5, 0.75, 1], rootMargin: '-30% 0px -30% 0px' },
    );

    for (const el of cardRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.map((q) => q.id).join(',')]);

  // 좌측 목록 클릭으로 선택이 바뀌면 해당 카드로 스크롤 이동
  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current.get(selectedId);
    const root = scrollRef.current;
    if (!el || !root) return;

    const elRect = el.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const isVisible = elRect.top >= rootRect.top && elRect.bottom <= rootRect.bottom;
    if (!isVisible) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedId]);

  if (questions.length === 0) {
    return (
      <div className="preview-pane">
        <div className="preview-card preview-card--empty">
          <p className="preview-pane__empty">왼쪽에서 문항을 추가하면 미리보기가 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-pane" ref={scrollRef}>
      {questions.map((question) => (
        <div
          key={question.id}
          data-question-id={question.id}
          ref={(el) => {
            if (el) cardRefs.current.set(question.id, el);
            else cardRefs.current.delete(question.id);
          }}
          className={`preview-card ${question.id === selectedId ? 'is-active' : ''}`}
          onClick={() => onSelectQuestion(question.id)}
        >
          <h3>
            {question.title || '(제목 없음)'}
            {question.required && <span className="preview-required">*</span>}
          </h3>
          {question.description && <p className="preview-description">{question.description}</p>}

          <QuestionPreviewBody question={question} />
        </div>
      ))}
    </div>
  );
}
