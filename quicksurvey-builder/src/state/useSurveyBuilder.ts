import { useCallback, useEffect, useState } from 'react';
import {
  createQuestionByType,
  type Question,
  type QuestionType,
} from '../models/question';

export function useSurveyBuilder(initialQuestions: Question[] = [], onChange?: (questions: Question[]) => void) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    onChange?.(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const addQuestion = useCallback((type: QuestionType) => {
    setQuestions((prev) => {
      const next = createQuestionByType(type, prev.length);
      setSelectedId(next.id);
      return [...prev, next];
    });
  }, []);

  const updateQuestion = useCallback((id: string, updater: (q: Question) => Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? updater(q) : q)));
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const next = prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i }));
      setSelectedId((current) => (current === id ? next[0]?.id ?? null : current));
      return next;
    });
  }, []);

  const moveQuestion = useCallback((id: string, direction: -1 | 1) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((q, i) => ({ ...q, order: i }));
    });
  }, []);

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (index < 0) return prev;
      const clone: Question = {
        ...prev[index],
        id: `${prev[index].id}-copy-${Date.now()}`,
      };
      const next = [...prev.slice(0, index + 1), clone, ...prev.slice(index + 1)];
      setSelectedId(clone.id);
      return next.map((q, i) => ({ ...q, order: i }));
    });
  }, []);

  const reorderQuestion = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    setQuestions((prev) => {
      const fromIndex = prev.findIndex((q) => q.id === draggedId);
      const toIndex = prev.findIndex((q) => q.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((q, i) => ({ ...q, order: i }));
    });
  }, []);

  const selectedQuestion = questions.find((q) => q.id === selectedId) ?? null;

  return {
    questions,
    selectedId,
    selectedQuestion,
    selectQuestion: setSelectedId,
    addQuestion,
    updateQuestion,
    removeQuestion,
    moveQuestion,
    duplicateQuestion,
    reorderQuestion,
  };
}
