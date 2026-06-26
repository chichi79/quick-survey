export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'likert_scale'
  | 'open_text'
  | 'matrix'
  | 'numeric'
  | 'star_rating'
  | 'nps'
  | 'image_choice'
  | 'ranking'
  | 'emoji_reaction'
  | 'yes_no'
  | 'vs_match'
  | 'dropdown'
  | 'contact_consent'
  | 'slider';

export interface ChoiceOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface MatrixRow {
  id: string;
  label: string;
}

export interface MatrixColumn {
  id: string;
  label: string;
}

export interface ChoiceQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice';
  title: string;
  description: string;
  required: boolean;
  order: number;
  options: ChoiceOption[];
  maxSelect: number | null;
  allowOther: boolean;
}

export interface LikertQuestion {
  id: string;
  type: 'likert_scale';
  title: string;
  description: string;
  required: boolean;
  order: number;
  scaleMin: number;
  scaleMax: number;
  minLabel: string;
  maxLabel: string;
}

export interface OpenTextQuestion {
  id: string;
  type: 'open_text';
  title: string;
  description: string;
  required: boolean;
  order: number;
  maxLength: number;
  multiline: boolean;
}

export interface MatrixQuestion {
  id: string;
  type: 'matrix';
  title: string;
  description: string;
  required: boolean;
  order: number;
  rows: MatrixRow[];
  columns: MatrixColumn[];
}

export interface NumericItem {
  id: string;
  label: string;
}

export interface NumericQuestion {
  id: string;
  type: 'numeric';
  title: string;
  description: string;
  required: boolean;
  order: number;
  items: NumericItem[];
  targetSum: number | null;
}

export interface StarRatingQuestion {
  id: string;
  type: 'star_rating';
  title: string;
  description: string;
  required: boolean;
  order: number;
  maxStars: number;
}

export interface NpsQuestion {
  id: string;
  type: 'nps';
  title: string;
  description: string;
  required: boolean;
  order: number;
  minLabel: string;
  maxLabel: string;
}

export interface ImageOption {
  id: string;
  label: string;
  imageUrl: string;
}

export interface ImageChoiceQuestion {
  id: string;
  type: 'image_choice';
  title: string;
  description: string;
  required: boolean;
  order: number;
  options: ImageOption[];
}

export interface RankingItem {
  id: string;
  label: string;
}

export interface RankingQuestion {
  id: string;
  type: 'ranking';
  title: string;
  description: string;
  required: boolean;
  order: number;
  items: RankingItem[];
}

export interface EmojiOption {
  id: string;
  emoji: string;
  label: string;
}

export interface EmojiReactionQuestion {
  id: string;
  type: 'emoji_reaction';
  title: string;
  description: string;
  required: boolean;
  order: number;
  options: EmojiOption[];
}

export interface YesNoQuestion {
  id: string;
  type: 'yes_no';
  title: string;
  description: string;
  required: boolean;
  order: number;
  yesLabel: string;
  noLabel: string;
}

export interface VsMatchOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface VsMatchQuestion {
  id: string;
  type: 'vs_match';
  title: string;
  description: string;
  required: boolean;
  order: number;
  optionA: VsMatchOption;
  optionB: VsMatchOption;
}

export interface DropdownQuestion {
  id: string;
  type: 'dropdown';
  title: string;
  description: string;
  required: boolean;
  order: number;
  options: ChoiceOption[];
  placeholder: string;
}

export interface ContactConsentQuestion {
  id: string;
  type: 'contact_consent';
  title: string;
  description: string;
  required: boolean;
  order: number;
  collectName: boolean;
  collectPhone: boolean;
  collectEmail: boolean;
  consentText: string;
}

export interface SliderQuestion {
  id: string;
  type: 'slider';
  title: string;
  description: string;
  required: boolean;
  order: number;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  unit: string;
}

export type Question =
  | ChoiceQuestion
  | LikertQuestion
  | OpenTextQuestion
  | MatrixQuestion
  | NumericQuestion
  | StarRatingQuestion
  | NpsQuestion
  | ImageChoiceQuestion
  | RankingQuestion
  | EmojiReactionQuestion
  | YesNoQuestion
  | VsMatchQuestion
  | DropdownQuestion
  | ContactConsentQuestion
  | SliderQuestion;

let nextId = 1;
function genId(prefix: string): string {
  // Date.now() + 카운터: 페이지를 새로고침해도(카운터가 1로 리셋돼도) localStorage에 남아있는
  // 기존 문항 id와 충돌하지 않도록 한다. 카운터만 쓰면 새로고침 후 만든 문항이 이전에
  // 만든 문항과 같은 id(q-1 등)를 갖게 되어 선택/스크롤이 뒤섞이는 버그가 있었다.
  return `${prefix}-${Date.now()}-${nextId++}`;
}

export function createChoiceQuestion(params: Partial<ChoiceQuestion> = {}): ChoiceQuestion {
  return {
    id: params.id ?? genId('q'),
    type: params.type === 'multiple_choice' ? 'multiple_choice' : 'single_choice',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    options: params.options ?? [
      { id: genId('opt'), label: '옵션 1' },
      { id: genId('opt'), label: '옵션 2' },
    ],
    maxSelect: params.maxSelect ?? null,
    allowOther: params.allowOther ?? false,
  };
}

export function createLikertQuestion(params: Partial<LikertQuestion> = {}): LikertQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'likert_scale',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    scaleMin: params.scaleMin ?? 1,
    scaleMax: params.scaleMax ?? 5,
    minLabel: params.minLabel ?? '',
    maxLabel: params.maxLabel ?? '',
  };
}

export function createOpenTextQuestion(params: Partial<OpenTextQuestion> = {}): OpenTextQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'open_text',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    maxLength: params.maxLength ?? 200,
    multiline: params.multiline ?? false,
  };
}

export function createMatrixQuestion(params: Partial<MatrixQuestion> = {}): MatrixQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'matrix',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    rows: params.rows ?? [
      { id: genId('row'), label: '행 1' },
      { id: genId('row'), label: '행 2' },
    ],
    columns: params.columns ?? [
      { id: genId('col'), label: '열 1' },
      { id: genId('col'), label: '열 2' },
    ],
  };
}

export function createNumericQuestion(params: Partial<NumericQuestion> = {}): NumericQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'numeric',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    items: params.items ?? [
      { id: genId('item'), label: '항목 1' },
      { id: genId('item'), label: '항목 2' },
    ],
    targetSum: params.targetSum ?? null,
  };
}

export function createStarRatingQuestion(params: Partial<StarRatingQuestion> = {}): StarRatingQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'star_rating',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    maxStars: params.maxStars ?? 5,
  };
}

export function createNpsQuestion(params: Partial<NpsQuestion> = {}): NpsQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'nps',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    minLabel: params.minLabel ?? '전혀 추천하지 않음',
    maxLabel: params.maxLabel ?? '매우 추천함',
  };
}

export function createImageChoiceQuestion(params: Partial<ImageChoiceQuestion> = {}): ImageChoiceQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'image_choice',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    options: params.options ?? [
      { id: genId('opt'), label: '옵션 1', imageUrl: '' },
      { id: genId('opt'), label: '옵션 2', imageUrl: '' },
    ],
  };
}

export function createRankingQuestion(params: Partial<RankingQuestion> = {}): RankingQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'ranking',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    items: params.items ?? [
      { id: genId('item'), label: '항목 1' },
      { id: genId('item'), label: '항목 2' },
      { id: genId('item'), label: '항목 3' },
    ],
  };
}

export function createEmojiReactionQuestion(params: Partial<EmojiReactionQuestion> = {}): EmojiReactionQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'emoji_reaction',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    options: params.options ?? [
      { id: genId('emoji'), emoji: '😊', label: '좋아요' },
      { id: genId('emoji'), emoji: '😢', label: '슬퍼요' },
      { id: genId('emoji'), emoji: '😡', label: '화나요' },
    ],
  };
}

export function createYesNoQuestion(params: Partial<YesNoQuestion> = {}): YesNoQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'yes_no',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    yesLabel: params.yesLabel ?? '예',
    noLabel: params.noLabel ?? '아니오',
  };
}

export function createVsMatchQuestion(params: Partial<VsMatchQuestion> = {}): VsMatchQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'vs_match',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    optionA: params.optionA ?? { id: genId('opt'), label: 'A', imageUrl: '' },
    optionB: params.optionB ?? { id: genId('opt'), label: 'B', imageUrl: '' },
  };
}

export function createDropdownQuestion(params: Partial<DropdownQuestion> = {}): DropdownQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'dropdown',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    options: params.options ?? [
      { id: genId('opt'), label: '옵션 1' },
      { id: genId('opt'), label: '옵션 2' },
    ],
    placeholder: params.placeholder ?? '선택해주세요',
  };
}

export function createContactConsentQuestion(
  params: Partial<ContactConsentQuestion> = {},
): ContactConsentQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'contact_consent',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    collectName: params.collectName ?? true,
    collectPhone: params.collectPhone ?? true,
    collectEmail: params.collectEmail ?? false,
    consentText: params.consentText ?? '수집한 개인정보는 이벤트 진행 목적으로만 사용되며, 목적 달성 후 즉시 파기됩니다.',
  };
}

export function createSliderQuestion(params: Partial<SliderQuestion> = {}): SliderQuestion {
  return {
    id: params.id ?? genId('q'),
    type: 'slider',
    title: params.title ?? '',
    description: params.description ?? '',
    required: params.required ?? true,
    order: params.order ?? 0,
    min: params.min ?? 0,
    max: params.max ?? 100,
    step: params.step ?? 1,
    minLabel: params.minLabel ?? '',
    maxLabel: params.maxLabel ?? '',
    unit: params.unit ?? '%',
  };
}

export function createQuestionByType(type: QuestionType, order: number): Question {
  switch (type) {
    case 'single_choice':
      return createChoiceQuestion({ type: 'single_choice', order });
    case 'multiple_choice':
      return createChoiceQuestion({ type: 'multiple_choice', order });
    case 'likert_scale':
      return createLikertQuestion({ order });
    case 'open_text':
      return createOpenTextQuestion({ order });
    case 'matrix':
      return createMatrixQuestion({ order });
    case 'numeric':
      return createNumericQuestion({ order });
    case 'star_rating':
      return createStarRatingQuestion({ order });
    case 'nps':
      return createNpsQuestion({ order });
    case 'image_choice':
      return createImageChoiceQuestion({ order });
    case 'ranking':
      return createRankingQuestion({ order });
    case 'emoji_reaction':
      return createEmojiReactionQuestion({ order });
    case 'yes_no':
      return createYesNoQuestion({ order });
    case 'vs_match':
      return createVsMatchQuestion({ order });
    case 'dropdown':
      return createDropdownQuestion({ order });
    case 'contact_consent':
      return createContactConsentQuestion({ order });
    case 'slider':
      return createSliderQuestion({ order });
  }
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: '객관식 (단일 선택)',
  multiple_choice: '객관식 (복수 선택)',
  likert_scale: '평가형',
  open_text: '주관식',
  matrix: '평가형 복수',
  numeric: '숫자 합계형',
  star_rating: '별점 평가형',
  nps: 'NPS',
  image_choice: '이미지 선택형',
  ranking: '순위 선택형',
  emoji_reaction: '이모지 반응형',
  yes_no: '예/아니오',
  vs_match: 'VS 대결형',
  dropdown: '드롭다운 선택형',
  contact_consent: '개인정보 수집형',
  slider: '슬라이더형',
};
