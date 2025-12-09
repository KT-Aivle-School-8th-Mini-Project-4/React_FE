import { apiClient, USE_MOCK_API } from '../utils/api.js';
import { BOOK_ENDPOINTS } from './apiEndpoints.js';

// ============================================
// 📋 타입 정의 (JSDoc으로 대체)
// ============================================

/**
 * 신규 도서 등록 요청 데이터 타입
 * @typedef {Object} CreateBookRequest
 * @property {string} title - 도서 제목
 * @property {string} author - 저자명
 * @property {string} genre - 장르 (예: 소설, 과학, 역사 등)
 * @property {string} description - 도서 설명
 * @property {number} publishedYear - 출판 연도
 * @property {number} price - 가격 (원)
 * @property {number} [stock] - 초기 재고 수량 (기본값: 백엔드에서 설정)
 */

/**
 * 도서 정보 수정 요청 데이터 타입
 * @typedef {Object} UpdateBookRequest
 * @property {string} [title] - 수정할 도서 제목
 * @property {string} [author] - 수정할 저자명
 * @property {string} [genre] - 수정할 장르
 * @property {string} [description] - 수정할 도서 설명
 * @property {number} [publishedYear] - 수정할 출판 연도
 * @property {number} [price] - 수정할 가격
 */

/**
 * 도서 재고 업데이트 요청 데이터 타입 (ADMIN 전용)
 * @typedef {Object} UpdateStockRequest
 * @property {number} stock - 새로운 재고 수량
 */

// ============================================
// Mock API Implementation (개발용)
// ============================================
// 실제 백엔드 연동 전까지 사용하는 Mock 데이터
// USE_MOCK_API 환경변수로 제어

const mockBookService = {
  /**
   * 도서 전체 조회 - GET /book
   * @returns {Promise<Array>}
   */
  getAllBooks: async () => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    return books;
  },

  /**
   * 도서 상세정보 조회 - GET /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<Object>}
   */
  getBookById: async (bookId) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      throw new Error('도서를 찾을 수 없습니다.');
    }
    return book;
  },

  /**
   * 신규 도서 등록 - POST /book
   * @param {CreateBookRequest} data - 도서 정보
   * @returns {Promise<Object>}
   */
  createBook: async (data) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const newBook = {
      id: `book_${Date.now()}`,
      ...data,
      coverImage: `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop`,
      createdBy: 'current_user',
      createdAt: new Date(),
      ratings: [],
      reviews: [],
      stock: data.stock || 10,
      wishlistedBy: []
    };
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    return newBook;
  },

  /**
   * 도서 수정 - PUT /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @param {UpdateBookRequest} data - 수정할 도서 정보
   * @returns {Promise<Object>}
   */
  updateBook: async (bookId, data) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
      throw new Error('도서를 찾을 수 없습니다.');
    }
    books[index] = { ...books[index], ...data };
    localStorage.setItem('books', JSON.stringify(books));
    return books[index];
  },

  /**
   * 도서 삭제 - DELETE /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<void>}
   */
  deleteBook: async (bookId) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const filtered = books.filter((b) => b.id !== bookId);
    localStorage.setItem('books', JSON.stringify(filtered));
  },

  /**
   * AI 표지 재생성 - PATCH /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<Object>}
   */
  regenerateCover: async (bookId) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
      throw new Error('도서를 찾을 수 없습니다.');
    }
    // Mock: Generate new random cover
    books[index].coverImage = `https://images.unsplash.com/photo-${Date.now()}?w=300&h=400&fit=crop`;
    localStorage.setItem('books', JSON.stringify(books));
    return books[index];
  },

  /**
   * 도서 재고 업데이트 (ADMIN) - PUT /book/{bookId}/stock
   * @param {string} bookId - 도서 ID
   * @param {UpdateStockRequest} data - 재고 정보
   * @returns {Promise<Object>}
   */
  updateStock: async (bookId, data) => {
    // TODO: 실제 API 연동 시 제거
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
      throw new Error('도서를 찾을 수 없습니다.');
    }
    books[index].stock = data.stock;
    localStorage.setItem('books', JSON.stringify(books));
    return books[index];
  }
};

// ============================================
// Real API Implementation (실제 백엔드 연동)
// ============================================
// 실제 백엔드 API와 통신하는 부분
// 모든 엔드포인트는 apiEndpoints.js에서 관리

const realBookService = {
  /**
   * ✅ 도서 전체 조회 - GET /book
   * @returns {Promise<Array>}
   */
  getAllBooks: async () => {
    // 🔌 외부 API 호출 - 백엔드에서 전체 도서 목록 조회
    return await apiClient.get(BOOK_ENDPOINTS.GET_ALL_BOOKS);
  },

  /**
   * ✅ 도서 상세정보 조회 - GET /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<Object>}
   */
  getBookById: async (bookId) => {
    // 🔌 외부 API 호출 - 백엔드에서 특정 도서의 상세 정보 조회
    return await apiClient.get(BOOK_ENDPOINTS.GET_BOOK_BY_ID(bookId));
  },

  /**
   * ✅ 신규 도서 등록 - POST /book
   * @param {CreateBookRequest} data - 도서 정보
   * @returns {Promise<Object>}
   */
  createBook: async (data) => {
    // 🔌 외부 API 호출 - 백엔드에서 새로운 도서 생성 (AI 표지 생성 포함)
    return await apiClient.post(BOOK_ENDPOINTS.CREATE_BOOK, data);
  },

  /**
   * ✅ 도서 수정 - PUT /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @param {UpdateBookRequest} data - 수정할 도서 정보
   * @returns {Promise<Object>}
   */
  updateBook: async (bookId, data) => {
    // 🔌 외부 API 호출 - 백엔드에서 도서 정보 수정
    return await apiClient.put(BOOK_ENDPOINTS.UPDATE_BOOK(bookId), data);
  },

  /**
   * ✅ 도서 삭제 - DELETE /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<void>}
   */
  deleteBook: async (bookId) => {
    // 🔌 외부 API 호출 - 백엔드에서 도서 삭제
    await apiClient.delete(BOOK_ENDPOINTS.DELETE_BOOK(bookId));
  },

  /**
   * ✅ AI 표지 재생성 - PATCH /book/{bookId}
   * @param {string} bookId - 도서 ID
   * @returns {Promise<Object>}
   */
  regenerateCover: async (bookId) => {
    // 🔌 외부 API 호출 - 백엔드에서 AI를 사용하여 새로운 표지 이미지 생성
    return await apiClient.patch(BOOK_ENDPOINTS.REGENERATE_COVER(bookId));
  },

  /**
   * ✅ 도서 재고 업데이트 (ADMIN) - PUT /book/{bookId}/stock
   * @param {string} bookId - 도서 ID
   * @param {UpdateStockRequest} data - 재고 정보
   * @returns {Promise<Object>}
   */
  updateStock: async (bookId, data) => {
    // 🔌 외부 API 호출 - 백엔드에서 도서 재고 수량 업데이트 (관리자 전용)
    return await apiClient.put(BOOK_ENDPOINTS.UPDATE_STOCK(bookId), data);
  }
};

// Export based on mode
export const bookService = USE_MOCK_API ? mockBookService : realBookService;
