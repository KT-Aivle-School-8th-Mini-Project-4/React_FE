import { apiClient, USE_MOCK_API } from '../utils/api';
import { Review } from '../App';
import { COMMENT_ENDPOINTS } from './apiEndpoints';

// ============================================
// 타입 정의 (API 명세서 기반)
// ============================================

export interface CreateCommentRequest {
  comment: string;
  rating?: number;
}

// ============================================
// Mock API Implementation (개발용)
// ============================================
// 실제 백엔드 연동 전까지 사용하는 Mock 데이터
// USE_MOCK_API 환경변수로 제어

const mockCommentService = {
  // 댓글 등록 - POST /comment/{bookId}
  createComment: async (bookId: string, data: CreateCommentRequest): Promise<Review> => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newReview: Review = {
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

  // 댓글 삭제 - DELETE /comment/{commentId}
  deleteComment: async (commentId: string): Promise<void> => {
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
// 모든 엔드포인트는 apiEndpoints.ts에서 관리

const realCommentService = {
  // ✅ 댓글 등록 - POST /comment/{bookId}
  createComment: async (bookId: string, data: CreateCommentRequest): Promise<Review> => {
    // 🔌 외부 API 호출 - 백엔드에서 새로운 리뷰/댓글 생성
    return await apiClient.post<Review>(COMMENT_ENDPOINTS.CREATE_COMMENT(bookId), data);
  },

  // ✅ 댓글 삭제 - DELETE /comment/{commentId}
  deleteComment: async (commentId: string): Promise<void> => {
    // 🔌 외부 API 호출 - 백엔드에서 리뷰/댓글 삭제
    await apiClient.delete(COMMENT_ENDPOINTS.DELETE_COMMENT(commentId));
  }
};

// Export based on mode
export const commentService = USE_MOCK_API ? mockCommentService : realCommentService;