import { create, ApiResponse as ApisauceResponse } from 'apisauce';
import { Config } from '../config/env';
import { 
  Guideline, 
  GuidelineFilters, 
  PaginationParams, 
  PaginatedResponse,
  CreateGuidelineRequest,
  UpdateGuidelineRequest,
  LoginRequest,
  LoginResponse,
  ApiResponse,
  User
} from '../types';
import { getStoredToken, removeStoredToken } from '../utils/storage';

// Create the API instance
const api = create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.addRequestTransform((request) => {
  const token = getStoredToken();
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }
});

// Handle auth errors
api.addResponseTransform((response) => {
  if (response.status === 401) {
    removeStoredToken();
    // Navigate to login screen
  }
});

// Helper function to handle API responses
const handleResponse = <T>(response: ApisauceResponse<ApiResponse<T>>): ApiResponse<T> => {
  if (response.ok && response.data) {
    return response.data;
  }
  
  return {
    success: false,
    error: response.data?.error || response.problem || 'An error occurred',
  };
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return handleResponse(response);
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return handleResponse(response);
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return handleResponse(response);
  },
};

// Guidelines API
export const guidelinesApi = {
  getGuidelines: async (
    filters: GuidelineFilters = {},
    pagination: PaginationParams = { page: 1, limit: Config.DEFAULT_PAGE_SIZE }
  ): Promise<ApiResponse<PaginatedResponse<Guideline>>> => {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };
    
    const response = await api.get<ApiResponse<PaginatedResponse<Guideline>>>('/guidelines', params);
    return handleResponse(response);
  },
  
  getGuidelineById: async (id: string): Promise<ApiResponse<Guideline>> => {
    const response = await api.get<ApiResponse<Guideline>>(`/guidelines/${id}`);
    return handleResponse(response);
  },
  
  createGuideline: async (data: CreateGuidelineRequest): Promise<ApiResponse<Guideline>> => {
    // Handle file upload if present
    if (data.file) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await api.post<ApiResponse<Guideline>>('/guidelines', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return handleResponse(response);
    }
    
    const response = await api.post<ApiResponse<Guideline>>('/guidelines', data);
    return handleResponse(response);
  },
  
  updateGuideline: async (data: UpdateGuidelineRequest): Promise<ApiResponse<Guideline>> => {
    const { id, ...updateData } = data;
    
    // Handle file upload if present
    if (updateData.file) {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await api.put<ApiResponse<Guideline>>(`/guidelines/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return handleResponse(response);
    }
    
    const response = await api.put<ApiResponse<Guideline>>(`/guidelines/${id}`, updateData);
    return handleResponse(response);
  },
  
  deleteGuideline: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/guidelines/${id}`);
    return handleResponse(response);
  },
  
  searchGuidelines: async (
    query: string,
    filters: Omit<GuidelineFilters, 'search'> = {},
    pagination: PaginationParams = { page: 1, limit: Config.DEFAULT_PAGE_SIZE }
  ): Promise<ApiResponse<PaginatedResponse<Guideline>>> => {
    const params = {
      search: query,
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };
    
    const response = await api.get<ApiResponse<PaginatedResponse<Guideline>>>('/guidelines/search', params);
    return handleResponse(response);
  },
};

// AI Chat API (if enabled)
export const aiChatApi = {
  sendMessage: async (message: string, guidelineId?: string): Promise<ApiResponse<{ response: string }>> => {
    const response = await api.post<ApiResponse<{ response: string }>>('/ai/chat', {
      message,
      guidelineId,
    });
    return handleResponse(response);
  },
};

export default api;

