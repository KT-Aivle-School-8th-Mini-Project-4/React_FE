import { apiClient, USE_MOCK_API } from '../utils/api.js';
import { COMMENT_ENDPOINTS } from './apiEndpoints.js';

// ============================================
// 📋 타입 정의 (JSDoc으로 대체)
// ============================================

/**
 * 댓글/리뷰 등록 요청 데이터 타입
 * @typedef {Object} CreateCommentRequest
 * @property {string} comment - 리뷰 내용 (본문 텍스트)
 * @property {number} [rating] - 평점 (선택 사항, 1-5 사이의 숫자)
 */

// ============================================
// Mock API Implementation (개발용)
// ============================================
// 실제 백엔드 연동 전까지 사용하는 Mock 데이터
// USE_MOCK_API 환경변수로 제어

const mockCommentService = {
  /**
   * 댓글 등록 - POST /comment/{bookId}
   * @param {string} bookId - 도서 ID
   * @param {CreateCommentRequest} data - 댓글 정보
   * @returns {Promise<Object>}
   */
  createComment: async (bookId, data) => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newReview = {
      id: `review_${Date.now()}`,
      userId: currentUser.id || 'anonymous',
      comment: data.comment,
      timestamp: new Date(),
      likes: [],
      reports: [],
      isHidden: false
    };

    // Store in localStorage (mock)
    const reviews = JSON.parse(localStorage.getItem(`reviews_${bookId}`) || '[]');
    reviews.push(newReview);
    localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));

    return newReview;
  },

  /**
   * 댓글 삭제 - DELETE /comment/{commentId}
   * @param {string} commentId - 댓글 ID
   * @returns {Promise<void>}
   */
  deleteComment: async (commentId) => {
    // TODO: 실제 API 연동 시 제거
    // Mock: Remove from all book reviews
    // In real implementation, backend would handle this
    console.log('Mock: Deleting comment', commentId);
  }
};

// ============================================
// Real API Implementation (실제 백엔드 연동)
// ============================================
// 실제 백엔드 API와 통신하는 부분
// 모든 엔드포인트는 apiEndpoints.js에서 관리

const realCommentService = {
  /**
   * ✅ 댓글 등록 - POST /comment/{bookId}
   * @param {string} bookId - 도서 ID
   * @param {CreateCommentRequest} data - 댓글 정보
   * @returns {Promise<Object>}
   */
  createComment: async (bookId, data) => {
    // 🔌 외부 API 호출 - 백엔드에서 새로운 리뷰/댓글 생성
    return await apiClient.post(COMMENT_ENDPOINTS.CREATE_COMMENT(bookId), data);
  },

  /**
   * ✅ 댓글 삭제 - DELETE /comment/{commentId}
   * @param {string} commentId - 댓글 ID
   * @returns {Promise<void>}
   */
  deleteComment: async (commentId) => {
    // 🔌 외부 API 호출 - 백엔드에서 리뷰/댓글 삭제
    await apiClient.delete(COMMENT_ENDPOINTS.DELETE_COMMENT(commentId));
  }
};

// Export based on mode
export const commentService = USE_MOCK_API ? mockCommentService : realCommentService;
