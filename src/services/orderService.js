import { apiClient, USE_MOCK_API } from '../utils/api.js';
import { ORDER_ENDPOINTS } from './apiEndpoints.js';

// ============================================
// 📋 타입 정의 (JSDoc으로 대체)
// ============================================

/**
 * 주문 생성 요청 데이터 타입
 * @typedef {Object} CreateOrderRequest
 * @property {Array<{bookId: string, quantity: number}>} items - 주문 항목 목록
 */

/**
 * 주문 응답 데이터 타입
 * @typedef {Object} OrderResponse
 * @property {string} orderId - 주문 고유 ID
 * @property {'pending'|'paid'|'shipped'|'delivered'|'cancelled'} status - 주문 상태
 * @property {number} totalAmount - 총 주문 금액 (원)
 * @property {Array<{bookId: string, quantity: number, price: number}>} items - 주문 항목 목록
 * @property {Date} createdAt - 주문 생성 일시
 */

// ============================================
// Mock API Implementation (개발용)
// ============================================
// 실제 백엔드 연동 전까지 사용하는 Mock 데이터
// USE_MOCK_API 환경변수로 제어

const mockOrderService = {
  /**
   * 주문 생성 - POST /order
   * @param {CreateOrderRequest} data - 주문 정보
   * @returns {Promise<OrderResponse>}
   */
  createOrder: async (data) => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    const orderId = `order_${Date.now()}`;
    const items = data.items.map(item => {
      const book = books.find((b) => b.id === item.bookId);
      return {
        bookId: item.bookId,
        quantity: item.quantity,
        price: book?.price || 0
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
      orderId,
      status: 'pending',
      totalAmount,
      items,
      createdAt: new Date()
    };

    // Store order
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    orders.push(order);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));

    return order;
  },

  /**
   * 주문 결제 처리 - POST /order/{orderId}/pay
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  payOrder: async (orderId) => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    order.status = 'paid';
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));

    // Create purchases
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    order.items.forEach((item) => {
      purchases.push({
        id: `purchase_${Date.now()}_${Math.random()}`,
        bookId: item.bookId,
        userId: currentUser.id,
        purchaseDate: new Date(),
        status: 'shipped'
      });
    });
    localStorage.setItem('purchases', JSON.stringify(purchases));

    return order;
  },

  /**
   * 주문 취소 - POST /order/{orderId}/cancel
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  cancelOrder: async (orderId) => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    order.status = 'cancelled';
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));

    return order;
  },

  /**
   * 주문 상세 조회 - GET /order/{orderId}
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  getOrder: async (orderId) => {
    // TODO: 실제 API 연동 시 제거
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    return order;
  }
};

// ============================================
// Real API Implementation (실제 백엔드 연동)
// ============================================
// 실제 백엔드 API와 통신하는 부분
// 모든 엔드포인트는 apiEndpoints.js에서 관리

const realOrderService = {
  /**
   * ✅ 주문 생성 - POST /order
   * @param {CreateOrderRequest} data - 주문 정보
   * @returns {Promise<OrderResponse>}
   */
  createOrder: async (data) => {
    // 🔌 외부 API 호출 - 백엔드에서 새로운 주문 생성
    return await apiClient.post(ORDER_ENDPOINTS.CREATE_ORDER, data);
  },

  /**
   * ✅ 주문 결제 처리 - POST /order/{orderId}/pay
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  payOrder: async (orderId) => {
    // 🔌 외부 API 호출 - 백엔드에서 주문 결제 처리 (재고 차감 포함)
    return await apiClient.post(ORDER_ENDPOINTS.PAY_ORDER(orderId));
  },

  /**
   * ✅ 주문 취소 - POST /order/{orderId}/cancel
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  cancelOrder: async (orderId) => {
    // 🔌 외부 API 호출 - 백엔드에서 주문 취소 처리 (재고 복구 포함)
    return await apiClient.post(ORDER_ENDPOINTS.CANCEL_ORDER(orderId));
  },

  /**
   * ✅ 주문 상세 조회 - GET /order/{orderId}
   * @param {string} orderId - 주문 ID
   * @returns {Promise<OrderResponse>}
   */
  getOrder: async (orderId) => {
    // 🔌 외부 API 호출 - 백엔드에서 주문 상세 정보 조회
    return await apiClient.get(ORDER_ENDPOINTS.GET_ORDER(orderId));
  }
};

// Export based on mode
export const orderService = USE_MOCK_API ? mockOrderService : realOrderService;
