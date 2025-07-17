// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'clinician' | 'admin';
  trustName?: string;
  createdAt: string;
  updatedAt: string;
}

// Guideline types
export interface Guideline {
  id: string;
  trustName: string;
  title: string;
  description: string;
  medicalSpeciality: MedicalSpeciality;
  url?: string; // S3 URL for PDFs
  content?: string; // For text-based guidelines
  fileType: 'pdf' | 'text';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  isActive: boolean;
}

// Medical specialities
export type MedicalSpeciality = 
  | 'cardiology'
  | 'respiratory'
  | 'neurology'
  | 'oncology'
  | 'pediatrics'
  | 'emergency'
  | 'surgery'
  | 'psychiatry'
  | 'dermatology'
  | 'orthopedics'
  | 'radiology'
  | 'pathology'
  | 'anesthesiology'
  | 'general_medicine'
  | 'other';

// Search and filter types
export interface GuidelineFilters {
  search?: string;
  trustName?: string;
  medicalSpeciality?: MedicalSpeciality;
  tags?: string[];
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Guideline creation/update types
export interface CreateGuidelineRequest {
  title: string;
  description: string;
  medicalSpeciality: MedicalSpeciality;
  trustName: string;
  content?: string;
  tags?: string[];
  file?: File | any; // For file uploads
}

export interface UpdateGuidelineRequest extends Partial<CreateGuidelineRequest> {
  id: string;
  isActive?: boolean;
}

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  guidelineId?: string; // Reference to guideline if relevant
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  GuidelineDetail: { guideline: Guideline };
  AdminDashboard: undefined;
  CreateGuideline: undefined;
  EditGuideline: { guideline: Guideline };
};

export type MainTabParamList = {
  Guidelines: undefined;
  Search: undefined;
  AIChat: undefined;
  Profile: undefined;
};

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

