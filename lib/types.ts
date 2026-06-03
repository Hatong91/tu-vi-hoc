export type VisualKind =
  | "mindmap"
  | "flowchart"
  | "table"
  | "timeline"
  | "infographic"
  | "interactive-ngu-hanh"
  | "interactive-cung-bieu";

export type Visual = {
  kind: VisualKind;
  caption: string;
  data: unknown;
};

export type ContentChunk = {
  type: "definition" | "example" | "note" | "application";
  text: string;
};

export type LessonSection = {
  title: string;
  body: string;
  chunks: ContentChunk[];
  visual: Visual | null;
};

export type QuizItem = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  module: string;
  order: number;
  duration_minutes: number;
  story_hook: string;
  key_metaphor: string;
  content: {
    sections: LessonSection[];
  };
  quiz: QuizItem[];
  faq: FaqItem[];
};

export type PhaseInfo = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  modules: string[];
};

export type PhaseFile = {
  phase: PhaseInfo;
  lessons: Lesson[];
};
