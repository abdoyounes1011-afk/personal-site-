export type HoverTheme = 'yellow' | 'orange' | 'baby-blue';

export interface GemTool {
  id: string;
  name: string;
  arabicName?: string;
  role: string;
  arabicRole: string;
  url: string;
  hoverColor: HoverTheme;
  category: 'Comprehension' | 'Notes' | 'Visuals' | 'Video' | 'Clinical' | 'Data';
  badge: string;
  features: string[];
}

export interface Article {
  id: string;
  title: string;
  englishTitle: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[];
  summary: string;
}

export interface CourseFeedback {
  id: string;
  author: string;
  title: string;
  text: string;
  avatarBg: string;
  rating: number;
}
