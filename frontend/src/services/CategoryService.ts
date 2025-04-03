// src/services/CategoryService.ts
import { api } from 'boot/axios'; // Use the configured Axios instance
import type {
  Category,
  List,
  CreateCategoryDto,
  UpdateCategoryDto,
  FilterCategoryDto,
  CreateListDto,
  UpdateListDto,
  FilterListDto,
  PaginatedResponse,
} from 'src/types/models'; // Adjust path if needed

const CATEGORY_ENDPOINT = '/categories'; // Base path from your NestJS controller

// Helper to clean filter objects (remove undefined/empty string values)
const cleanFilters = (filters: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            cleaned[key] = filters[key];
        }
    }
    // Ensure default pagination if not provided - API likely handles defaults, but good practice
    if (!cleaned.page) cleaned.page = 1;
    if (!cleaned.limit) cleaned.limit = 10; // Or your API's default
    return cleaned;
}

export const CategoryService = {

  // --- Category Operations ---

  async getCategories(filters: FilterCategoryDto): Promise<PaginatedResponse<Category>> {
    const response = await api.get<PaginatedResponse<Category>>(CATEGORY_ENDPOINT, {
        params: cleanFilters(filters),
    });
    return response.data;
  },

  async getCategoryById(id: number, includeLists = false): Promise<Category> {
    const response = await api.get<Category>(`${CATEGORY_ENDPOINT}/${id}`, {
        params: { includeLists }
    });
    return response.data;
  },

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    // No need to manually add Auth headers if interceptor is set up
    const response = await api.post<Category>(CATEGORY_ENDPOINT, data);
    return response.data;
  },

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch<Category>(`${CATEGORY_ENDPOINT}/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
    // DELETE often returns 204 No Content, so no data expected
  },

  // --- List Item Operations ---

  async getListsForCategory(categoryId: number, filters: FilterListDto): Promise<PaginatedResponse<List>> {
     const response = await api.get<PaginatedResponse<List>>(`${CATEGORY_ENDPOINT}/${categoryId}/lists`, {
        params: cleanFilters(filters),
    });
    return response.data;
  },

   // Note: getOneList endpoint is /categories/lists/:listId in your backend
   async getListById(listId: number): Promise<List> {
    const response = await api.get<List>(`${CATEGORY_ENDPOINT}/lists/${listId}`);
    return response.data;
   },

  async createList(categoryId: number, data: CreateListDto): Promise<List> {
    const response = await api.post<List>(`${CATEGORY_ENDPOINT}/${categoryId}/lists`, data);
    return response.data;
  },

   // Note: updateList endpoint is /categories/lists/:listId in your backend
  async updateList(listId: number, data: UpdateListDto): Promise<List> {
    const response = await api.patch<List>(`${CATEGORY_ENDPOINT}/lists/${listId}`, data);
    return response.data;
  },

   // Note: deleteList endpoint is /categories/lists/:listId in your backend
  async deleteList(listId: number): Promise<void> {
    await api.delete(`${CATEGORY_ENDPOINT}/lists/${listId}`);
  },
};