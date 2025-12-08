// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// ============================================
// 환경 변수 설정 가이드
// ============================================
// .env 파일에 다음 값을 설정하세요:
// 
// VITE_API_BASE_URL=http://your-backend-server.com
// VITE_USE_MOCK_API=false  (실제 API 사용시)
// VITE_USE_MOCK_API=true   (Mock API 사용시)
// ============================================

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  setRefreshToken: (token: string) => localStorage.setItem('refreshToken', token),
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = tokenManager.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request
            return this.request(endpoint, options);
          } else {
            tokenManager.clearTokens();
            throw new ApiError(401, '인증이 만료되었습니다. 다시 로그인해주세요.');
          }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || '요청 처리 중 오류가 발생했습니다.',
          errorData
        );
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, '네트워크 오류가 발생했습니다.');
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      // ✅ 토큰 재발급 - POST /auth/refresh
      // 🔌 외부 API 호출 - 백엔드에서 새로운 액세스 토큰 발급
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        tokenManager.setAccessToken(data.accessToken);
        if (data.refreshToken) {
          tokenManager.setRefreshToken(data.refreshToken);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { USE_MOCK_API };