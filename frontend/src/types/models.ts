// src/types/models.ts

export interface ParagraphItem {
    type: 'PARAGRAPH';
    html: string;
  }
  
  export interface FileItem {
    type: 'FILE';
    url: string;
    name: string;
  }
  
  export interface ImageItem {
    type: 'IMAGE';
    src: string;
    alt: string;
  }
  
  // Union type for content items
  export type ContentItem = ParagraphItem | FileItem | ImageItem;
  
  export interface Article {
    id: number;
    title: string;
    category: string;
    content: ContentItem[];
  }
  
  // For creating/editing, ID might not be present initially
  export type ArticleInput = Omit<Article, 'id'> & { id?: number };
  