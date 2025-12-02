// API Configuration and Utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Token management
export const TokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  setTokens: (access: string, refresh: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  },

  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public status: number,
    public data: any,
    message?: string
  ) {
    super(message || 'API Error');
    this.name = 'APIError';
  }
}

// Refresh token function
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = TokenManager.getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      TokenManager.setTokens(data.access, refreshToken);
      return data.access;
    }
    
    // Refresh token is invalid, clear tokens
    TokenManager.clearTokens();
    return null;
  } catch (error) {
    TokenManager.clearTokens();
    return null;
  }
}

// Generic API fetch wrapper with automatic token refresh
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = TokenManager.getAccessToken();

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401 && accessToken) {
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } else {
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        throw new APIError(401, null, 'Authentication failed');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data, data.detail || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, null, 'Network error');
  }
}

// API service methods
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const data = await apiFetch<{ access: string; refresh: string; user: any }>(
        '/api/users/login/',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      TokenManager.setTokens(data.access, data.refresh);
      return data;
    },

    register: async (userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      role: 'ADMIN' | 'HEALTH_OFFICIAL' | 'LAB_TECH' | 'PHARMACIST';
    }) => {
      const data = await apiFetch<{ access: string; refresh: string; user: any }>(
        '/api/users/register/',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        }
      );
      TokenManager.setTokens(data.access, data.refresh);
      return data;
    },

    logout: async () => {
      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    },

    getProfile: async () => {
      return apiFetch<any>('/api/users/profile/');
    },
  },

  // Datasets
  datasets: {
    list: async () => {
      return apiFetch<any[]>('/api/datasets/');
    },

    upload: async (file: File, metadata: any) => {
      const formData = new FormData();
      formData.append('file', file);
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      const accessToken = TokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/datasets/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new APIError(response.status, data);
      }

      return response.json();
    },

    getById: async (id: number) => {
      return apiFetch<any>(`/api/datasets/${id}/`);
    },
  },

  // Forecasting
  forecasting: {
    // Models
    listModels: async () => {
      return apiFetch<any[]>('/api/forecasting/models/');
    },

    getModel: async (id: number) => {
      return apiFetch<any>(`/api/forecasting/models/${id}/`);
    },

    createModel: async (modelData: { name: string; version: string; algorithm: string; dataset: number }) => {
      return apiFetch<any>('/api/forecasting/models/', {
        method: 'POST',
        body: JSON.stringify(modelData),
      });
    },

    retrainModel: async (id: number) => {
      return apiFetch<any>(`/api/forecasting/models/${id}/retrain/`, {
        method: 'POST',
      });
    },

    // Forecasts
    listForecasts: async (params?: { disease?: string; region?: string; model?: number }) => {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiFetch<any[]>(`/api/forecasting/forecasts/${queryString}`);
    },

    getForecast: async (id: number) => {
      return apiFetch<any>(`/api/forecasting/forecasts/${id}/`);
    },

    createForecast: async (forecastData: { model: number; disease: string; region: string; forecast_date: string }) => {
      return apiFetch<any>('/api/forecasting/forecasts/', {
        method: 'POST',
        body: JSON.stringify(forecastData),
      });
    },

    // Get forecasts by disease
    getForecastsByDisease: async (disease: string, days: number = 7) => {
      return apiFetch<any[]>(`/api/forecasting/forecasts/?disease=${disease}&limit=${days}`);
    },

    // Data range for training
    getDataRange: async (disease: string) => {
      return apiFetch<any>(`/api/forecasting/data-range/?disease=${disease}`);
    },

    // Training sessions
    createTrainingSession: async (sessionData: {
      disease: string;
      training_start_date: string;
      training_end_date: string;
      forecast_start_date: string;
      forecast_end_date: string;
    }) => {
      return apiFetch<any>('/api/forecasting/training-sessions/', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
    },

    listTrainingSessions: async () => {
      return apiFetch<any[]>('/api/forecasting/training-sessions/');
    },

    // Available forecast dates
    getAvailableDates: async (disease: string) => {
      return apiFetch<any>(`/api/forecasting/forecasts/available_dates/?disease=${disease}`);
    },

    // Detailed forecasts for date range
    getForecastDetail: async (params: { disease: string; start_date: string; days_ahead: number }) => {
      const queryString = new URLSearchParams(params as any).toString();
      return apiFetch<any>(`/api/forecasting/forecasts/forecast_detail/?${queryString}`);
    },
  },

  // Reports
  reports: {
    list: async () => {
      return apiFetch<any[]>('/api/reports/');
    },

    generate: async (reportType: string, params: any) => {
      return apiFetch<any>('/api/reports/generate/', {
        method: 'POST',
        body: JSON.stringify({ report_type: reportType, ...params }),
      });
    },

    download: async (id: number) => {
      const accessToken = TokenManager.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/reports/${id}/download/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new APIError(response.status, null);
      }

      return response.blob();
    },

    auditLog: async () => {
      return apiFetch<any[]>('/api/reports/audit/');
    },
  },
};
