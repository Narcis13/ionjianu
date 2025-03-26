// src/services/ArticleService.ts
import { api } from 'boot/axios'; // Import configured Axios instance
import { Article, ArticleInput } from 'src/types/models';

const API_ENDPOINT = '/articles';

export const ArticleService = {
  async getArticles(): Promise<Article[]> {
    const response = await api.get<Article[]>(API_ENDPOINT);
    return response.data;
  },

  async getArticleById(id: number): Promise<Article> {
    const response = await api.get<Article>(`${API_ENDPOINT}/${id}`);
    return response.data;
  },

  async createArticle(articleData: ArticleInput): Promise<Article> {
    // Ensure content array exists even if empty
    const payload = { ...articleData, content: articleData.content || [] };
    const response = await api.post<Article>(API_ENDPOINT, payload);
    return response.data;
  },

  async updateArticle(id: number, articleData: ArticleInput): Promise<Article> {
     // Ensure content array exists even if empty
    const payload = { ...articleData, content: articleData.content || [] };
    const response = await api.put<Article>(`${API_ENDPOINT}/${id}`, payload);
    return response.data;
  },

  async deleteArticle(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINT}/${id}`);
  },
};