import type { Question } from '../../models/question';
import { ChoiceQuestionPreview } from './ChoiceQuestionPreview';
import { LikertQuestionPreview } from './LikertQuestionPreview';
import { OpenTextQuestionPreview } from './OpenTextQuestionPreview';
import { MatrixQuestionPreview } from './MatrixQuestionPreview';
import { NumericQuestionPreview } from './NumericQuestionPreview';
import { StarRatingQuestionPreview } from './StarRatingQuestionPreview';
import { NpsQuestionPreview } from './NpsQuestionPreview';
import { ImageChoiceQuestionPreview } from './ImageChoiceQuestionPreview';
import { RankingQuestionPreview } from './RankingQuestionPreview';
import { EmojiReactionQuestionPreview } from './EmojiReactionQuestionPreview';
import { YesNoQuestionPreview } from './YesNoQuestionPreview';
import { VsMatchQuestionPreview } from './VsMatchQuestionPreview';
import { DropdownQuestionPreview } from './DropdownQuestionPreview';
import { ContactConsentQuestionPreview, type ContactConsentAnswer } from './ContactConsentQuestionPreview';
import { SliderQuestionPreview } from './SliderQuestionPreview';

interface QuestionPreviewBodyProps {
  question: Question;
  /** 답변 가능한 모드(노출 미리보기)에서만 넘긴다. 없으면 빌더 편집용 정적 미리보기로 표시된다. */
  value?: unknown;
  onChange?: (value: unknown) => void;
}

export function QuestionPreviewBody({ question, value, onChange }: QuestionPreviewBodyProps) {
  switch (question.type) {
    case 'single_choice':
    case 'multiple_choice':
      return (
        <ChoiceQuestionPreview
          question={question}
          value={value as string | string[] | undefined}
          onChange={onChange as (value: string | string[]) => void}
        />
      );
    case 'likert_scale':
      return (
        <LikertQuestionPreview
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      );
    case 'open_text':
      return (
        <OpenTextQuestionPreview
          question={question}
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      );
    case 'matrix':
      return (
        <MatrixQuestionPreview
          question={question}
          value={value as Record<string, string> | undefined}
          onChange={onChange as (value: Record<string, string>) => void}
        />
      );
    case 'numeric':
      return (
        <NumericQuestionPreview
          question={question}
          value={value as Record<string, number> | undefined}
          onChange={onChange as (value: Record<string, number>) => void}
        />
      );
    case 'star_rating':
      return (
        <StarRatingQuestionPreview
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      );
    case 'nps':
      return (
        <NpsQuestionPreview
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      );
    case 'image_choice':
      return (
        <ImageChoiceQuestionPreview
          question={question}
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      );
    case 'ranking':
      return (
        <RankingQuestionPreview
          question={question}
          value={value as string[] | undefined}
          onChange={onChange as (value: string[]) => void}
        />
      );
    case 'emoji_reaction':
      return (
        <EmojiReactionQuestionPreview
          question={question}
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      );
    case 'yes_no':
      return (
        <YesNoQuestionPreview
          question={question}
          value={value as 'yes' | 'no' | undefined}
          onChange={onChange as (value: 'yes' | 'no') => void}
        />
      );
    case 'vs_match':
      return (
        <VsMatchQuestionPreview
          question={question}
          value={value as 'A' | 'B' | undefined}
          onChange={onChange as (value: 'A' | 'B') => void}
        />
      );
    case 'dropdown':
      return (
        <DropdownQuestionPreview
          question={question}
          value={value as string | undefined}
          onChange={onChange as (value: string) => void}
        />
      );
    case 'contact_consent':
      return (
        <ContactConsentQuestionPreview
          question={question}
          value={value as ContactConsentAnswer | undefined}
          onChange={onChange as (value: ContactConsentAnswer) => void}
        />
      );
    case 'slider':
      return (
        <SliderQuestionPreview
          question={question}
          value={value as number | undefined}
          onChange={onChange as (value: number) => void}
        />
      );
  }
}
