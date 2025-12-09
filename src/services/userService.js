import { apiClient, tokenManager, USE_MOCK_API } from '../utils/api.js';
import { USER_ENDPOINTS } from './apiEndpoints.js';

// ============================================
// 📋 타입 정의 (JSDoc으로 대체)
// ============================================

/**
 * 회원가입 요청 데이터 타입
 * @typedef {Object} SignupRequest
 * @property {string} id - 사용자 아이디 (고유값)
 * @property {string} password - 비밀번호 (평문으로 전송, 백엔드에서 암호화)
 * @property {'admin'|'user'} [role] - 사용자 권한 (기본값: 'user')
 */

/**
 * 로그인 요청 데이터 타입
 * @typedef {Object} LoginRequest
 * @property {string} id - 사용자 아이디
 * @property {string} password - 비밀번호
 */

/**
 * 로그인 응답 데이터 타입
 * @typedef {Object} LoginResponse
 * @property {string} accessToken - 액세스 토큰 (짧은 유효기간)
 * @property {string} refreshToken - 리프레시 토큰 (긴 유효기간)
 * @property {Object} user - 사용자 정보
 * @property {string} user.id - 사용자 아이디
 * @property {'admin'|'user'} user.role - 사용자 권한
 */

/**
 * 사용자 정보 타입
 * @typedef {Object} User
 * @property {string} id - 사용자 아이디
 * @property {'admin'|'user'} role - 사용자 권한
 */

// ============================================
// Mock API Implementation (개발용)
// ============================================
// 실제 백엔드 연동 전까지 사용하는 Mock 데이터
// USE_MOCK_API 환경변수로 제어

const mockUserService = {
  /**
   * 회원가입 - POST /user/signup
   * @param {SignupRequest} data - 회원가입 정보
   * @returns {Promise<void>}
   */
  signup: async (data) => {
    // TODO: 실제 API 연동 시 제거
    // Mock signup - store in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u) => u.id === data.id)) {
      throw new Error('이미 존재하는 아이디입니다.');
    }

    users.push({
      id: data.id,
      password: data.password,
      role: data.role || 'user'
    });
    
    localStorage.setItem('users', JSON.stringify(users));
  },

  /**
   * 로그인 - POST /user/login
   * @param {LoginRequest} data - 로그인 정보
   * @returns {Promise<LoginResponse>}
   */
  login: async (data) => {
    // TODO: 실제 API 연동 시 제거
    // Mock login - check localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.id === data.id && u.password === data.password);

    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    const mockAccessToken = `mock_access_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_token_${Date.now()}`;

    return {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: {
        id: user.id,
        role: user.role
      }
    };
  },

  /**
   * 로그아웃 - POST /user/logout
   * @returns {Promise<void>}
   */
  logout: async () => {
    // TODO: 실제 API 연동 시 제거
    // Mock logout
    tokenManager.clearTokens();
  },

  /**
   * 본인 도서 조회 - GET /user/book/{userId}
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>}
   */
  getUserBooks: async (userId) => {
    // TODO: 실제 API 연동 시 제거
    // Mock - return from localStorage
    const purchases = JSON.parse(localStorage.getItem(`purchases_${userId}`) || '[]');
    return purchases;
  },

  /**
   * 본인 주문 목록 조회 - GET /user/order/{userId}
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>}
   */
  getUserOrders: async (userId) => {
    // TODO: 실제 API 연동 시 제거
    // Mock - return from localStorage
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
    return orders;
  }
};

// ============================================
// Real API Implementation (실제 백엔드 연동)
// ============================================
// 실제 백엔드 API와 통신하는 부분
// 모든 엔드포인트는 apiEndpoints.js에서 관리

const realUserService = {
  /**
   * ✅ 회원가입 - POST /user/signup
   * @param {SignupRequest} data - 회원가입 정보
   * @returns {Promise<void>}
   */
  signup: async (data) => {
    // 🔌 외부 API 호출 - 백엔드에서 회원 정보 생성
    await apiClient.post(USER_ENDPOINTS.SIGNUP, data);
  },

  /**
   * ✅ 로그인 - POST /user/login
   * @param {LoginRequest} data - 로그인 정보
   * @returns {Promise<LoginResponse>}
   */
  login: async (data) => {
    // 🔌 외부 API 호출 - 백엔드에서 인증 처리
    const response = await apiClient.post(USER_ENDPOINTS.LOGIN, data);
    
    // Store tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);
    
    return response;
  },

  /**
   * ✅ 로그아웃 - POST /user/logout
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // 🔌 외부 API 호출 - 백엔드에서 토큰 무효화
      await apiClient.post(USER_ENDPOINTS.LOGOUT);
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * ✅ 본인 도서 조회 - GET /user/book/{userId}
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>}
   */
  getUserBooks: async (userId) => {
    // 🔌 외부 API 호출 - 백엔드에서 사용자의 구매한 도서 목록 조회
    return await apiClient.get(USER_ENDPOINTS.GET_USER_BOOKS(userId));
  },

  /**
   * ✅ 본인 주문 목록 조회 - GET /user/order/{userId}
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>}
   */
  getUserOrders: async (userId) => {
    // 🔌 외부 API 호출 - 백엔드에서 사용자의 주문 목록 조회
    return await apiClient.get(USER_ENDPOINTS.GET_USER_ORDERS(userId));
  }
};

// Export based on mode
export const userService = USE_MOCK_API ? mockUserService : realUserService;
