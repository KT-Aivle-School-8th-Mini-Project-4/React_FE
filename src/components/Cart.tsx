import { useState } from 'react';
import { Book } from '../App';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onCheckout: () => void;
}

export function Cart({ cartItems, onClose, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity, 0); // 가격 대신 수량 표시

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <div>
              <h2>장바구니</h2>
              <p className="text-sm opacity-90">
                {totalItems}권의 도서
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">장바구니가 비어있습니다</p>
              <p className="text-sm text-gray-500">도서를 추가해주세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.book.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1 line-clamp-2">{item.book.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.book.author}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.book.id, item.quantity - 1);
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 min-w-[3rem] text-center">
                            {item.quantity}권
                          </span>
                          <button
                            onClick={() => {
                              if (item.quantity < item.book.stock) {
                                onUpdateQuantity(item.book.id, item.quantity + 1);
                              } else {
                                alert(`최대 재고는 ${item.book.stock}권입니다.`);
                              }
                            }}
                            disabled={item.quantity >= item.book.stock}
                            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        재고: {item.book.stock}권
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>총 수량</span>
                <span>{totalItems}권</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              구매하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
