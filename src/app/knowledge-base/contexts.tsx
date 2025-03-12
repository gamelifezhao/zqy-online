'use client';

import { createContext, useContext } from 'react';
import { Document, ViewMode, FilterOptions } from './types';

// 创建知识库文档上下文
export type KnowledgeBaseContextType = {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  selectedDocuments: string[];
  setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  selectedDocument: Document | null;
  setSelectedDocument: React.Dispatch<React.SetStateAction<Document | null>>;
};

// 创建上下文
export const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

// 创建hook
export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};
