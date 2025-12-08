/**
 * API 엔드포인트 상수 정의
 * 백엔드 API 명세서와 100% 일치
 * 
 * 총 19개 엔드포인트 정의됨
 */

// ============================================
// User 도메인 (6개)
// ============================================
export const USER_ENDPOINTS = {
  // 회원가입
  SIGNUP: '/user/signup', // POST
  
  // 로그인
  LOGIN: '/user/login', // POST
  
  // 로그아웃
  LOGOUT: '/user/logout', // POST
  
  // 토큰 재발급
  REFRESH: '/auth/refresh', // POST
  
  // 본인 도서 조회
  GET_USER_BOOKS: (userId: string) => `/user/book/${userId}`, // GET
  
  // 본인 주문 목록 조회
  GET_USER_ORDERS: (userId: string) => `/user/order/${userId}`, // GET
} as const;

// ============================================
// Book 도메인 (7개)
// ============================================
export const BOOK_ENDPOINTS = {
  // 도서 전체 조회
  GET_ALL_BOOKS: '/book', // GET
  
  // 신규 도서 등록
  CREATE_BOOK: '/book', // POST
  
  // 도서 상세정보 조회
  GET_BOOK_BY_ID: (bookId: string) => `/book/${bookId}`, // GET
  
  // 도서 수정
  UPDATE_BOOK: (bookId: string) => `/book/${bookId}`, // PUT
  
  // 도서 삭제
  DELETE_BOOK: (bookId: string) => `/book/${bookId}`, // DELETE
  
  // AI 표지 재생성
  REGENERATE_COVER: (bookId: string) => `/book/${bookId}`, // PATCH
  
  // 도서 재고 업데이트 (ADMIN)
  UPDATE_STOCK: (bookId: string) => `/book/${bookId}/stock`, // PUT
} as const;

// ============================================
// Comment 도메인 (2개)
// ============================================
export const COMMENT_ENDPOINTS = {
  // 댓글 등록
  CREATE_COMMENT: (bookId: string) => `/comment/${bookId}`, // POST
  
  // 댓글 삭제
  DELETE_COMMENT: (commentId: string) => `/comment/${commentId}`, // DELETE
} as const;

// ============================================
// Order 도메인 (4개)
// ============================================
export const ORDER_ENDPOINTS = {
  // 주문 생성
  CREATE_ORDER: '/order', // POST
  
  // 주문 결제 처리
  PAY_ORDER: (orderId: string) => `/order/${orderId}/pay`, // POST
  
  // 주문 취소
  CANCEL_ORDER: (orderId: string) => `/order/${orderId}/cancel`, // POST
  
  // 주문 상세 조회
  GET_ORDER: (orderId: string) => `/order/${orderId}`, // GET
} as const;

/**
 * 전체 API 엔드포인트 개수: 19개
 * - User: 6개
 * - Book: 7개
 * - Comment: 2개
 * - Order: 4개
 */
