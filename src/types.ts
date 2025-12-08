// src/types.ts

export interface Review {
    id: string;
    userId: string;
    comment: string;
    timestamp: Date;
}

export interface Rating {
    userId: string;
    rating: number;
    timestamp: Date;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    coverImage: string;
    publishedYear: number;
    createdBy: string;
    createdAt: Date;
    stock: number;
    price?: number;      // 가격 (없으면 기본값 사용)
    ratings: Rating[];
    reviews: Review[];
}

export interface User {
    id: string;
    password?: string;
    role: 'admin' | 'user';
}

export interface OrderItem {
    bookId: string;
    title?: string;     // 상세 조회 시 제공됨
    quantity: number;
    price?: number;     // 상세 조회 시 제공됨
    subtotal?: number;  // 상세 조회 시 제공됨
}

export interface Order {
    id: string;  // orderId
    userId: string;
    status: "UNPAID" | "PAID" | "CANCELLED";
    totalPrice: number;
    purchaseDate: Date;
    items: OrderItem[]; // 상세조회에서 사용
}

// 변경 이력 관리용 (EditHistory)
export interface EditRecord {
    id: string;
    bookId: string;
    timestamp: Date;
    before: Book;
    after: Book;
    changes: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
}

// 삭제 이력 관리용 (DeleteHistory)
export interface DeleteRecord {
    id: string;
    book: Book;
    timestamp: Date;
}