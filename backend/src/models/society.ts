export interface Society {
  id: number;
  name: string;
  logo_url: string | null;
  chair_name: string;
  description: string;
  faculty_name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    limit: number;
    offset: number;
    count: number;
  };
}
