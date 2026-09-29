export type HoverTheme = 'yellow' | 'orange' | 'baby-blue';

export interface GemTool {
  id: string;
  name: string;
  arabicTitle: string;
  arabicName?: string;
  role: string;
  arabicRole: string;
  url: string;
  hoverColor: HoverTheme;
  category: 'Comprehension' | 'Notes' | 'Visuals' | 'Video' | 'Clinical' | 'Data';
  badge: string;
  features: string[];
  arabicOverview: string;
  arabicBreakdown?: string[];
  whenToUse: string[];
}

export interface CourseFeedback {
  id: string;
  author: string;
  title: string;
  text: string;
  avatarBg: string;
  rating: number;
}

export interface Article {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  featured?: boolean;
}
