import { useState } from 'react';
import { Book } from '../App';
import { X, Heart, Trash2, ShoppingCart, CheckSquare, Square } from 'lucide-react';

interface WishlistDialogProps {
  wishlist: string[];
  books: Book[];
  onClose: () => void;
  onRemoveFromWishlist: (bookId: string) => void;
  onRemoveFromWishlistBulk?: (bookIds: string[]) => void;
  onAddToCart?: (book: Book, quantity: number, silent?: boolean) => boolean;
  onPurchaseBook?: (bookId: string, quantity: number, silent?: boolean) => void;
  isDarkMode?: boolean;
}

export function WishlistDialog({ 
  wishlist, 
  books, 
  onClose, 
  onRemoveFromWishlist,
  onRemoveFromWishlistBulk,
  onAddToCart,
  onPurchaseBook,
  isDarkMode 
}: WishlistDialogProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

  // Get book details for wishlist items
  const wishlistBooks = wishlist
    .map(id => books.find(book => book.id === id))
    .filter((book): book is Book => book !== undefined);

  // Calculate total price of selected books
  const calculateSelectedTotal = () => {
    return Array.from(selectedBooks)
      .reduce((total, bookId) => {
        const book = books.find(b => b.id === bookId);
        return total + (book?.price || 0);
      }, 0);
  };

  // Toggle book selection
  const toggleBookSelection = (bookId: string) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectedBooks.size === wishlistBooks.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(wishlistBooks.map(b => b.id)));
    }
  };

  // Add selected books to cart
  const handleAddToCart = () => {
    if (!onAddToCart || selectedBooks.size === 0) return;
    
    let addedCount = 0;
    let failedCount = 0;
    const selectedArray = Array.from(selectedBooks);
    const successfulBookIds: string[] = [];
    
    // Add all books to cart silently and check success
    selectedArray.forEach(bookId => {
      const book = books.find(b => b.id === bookId);
      if (book) {
        const success = onAddToCart(book, 1, true); // silent = true, returns boolean
        if (success) {
          successfulBookIds.push(bookId);
          addedCount++;
        } else {
          failedCount++;
        }
      } else {
        failedCount++;
      }
    });
    
    // Remove all successful additions from wishlist at once
    if (onRemoveFromWishlistBulk && successfulBookIds.length > 0) {
      onRemoveFromWishlistBulk(successfulBookIds);
    } else {
      // Fallback to individual removal
      successfulBookIds.forEach(bookId => {
        onRemoveFromWishlist(bookId);
      });
    }
    
    setSelectedBooks(new Set());
    
    // Show single consolidated alert - removed "찜 목록에서 제거" text
    if (addedCount > 0 && failedCount === 0) {
      alert(`${addedCount}권의 도서를 장바구니에 담았습니다.`);
    } else if (addedCount > 0 && failedCount > 0) {
      alert(`${addedCount}권 장바구니 담기 성공, ${failedCount}권 실패 (재고 부족 또는 이미 담김)`);
    } else {
      alert('장바구니에 담을 수 있는 도서가 없습니다. (재고 부족 또는 이미 담김)');
    }
  };

  // Purchase selected books
  const handlePurchaseBooks = () => {
    if (!onPurchaseBook || selectedBooks.size === 0) return;
    
    let purchasedCount = 0;
    let failedCount = 0;
    const selectedArray = Array.from(selectedBooks);
    const successfulBookIds: string[] = []    ;
    
    // Process all purchases silently and track success
    selectedArray.forEach(bookId => {
      const book = books.find(b => b.id === bookId);
      if (book && book.stock > 0) {
        const success = onPurchaseBook(bookId, 1, true); // silent = true to prevent individual alerts
        if (success) {
          successfulBookIds.push(bookId);
          purchasedCount++;
        } else {
          failedCount++;
        }
      } else {
        failedCount++;
      }
    });
    
    // Remove all successful purchases from wishlist at once
    if (onRemoveFromWishlistBulk && successfulBookIds.length > 0) {
      onRemoveFromWishlistBulk(successfulBookIds);
    } else {
      // Fallback to individual removal
      successfulBookIds.forEach(bookId => {
        onRemoveFromWishlist(bookId);
      });
    }
    
    setSelectedBooks(new Set());
    
    // Show single consolidated alert - removed "찜 목록에서 제거" text
    if (purchasedCount > 0 && failedCount === 0) {
      alert(`${purchasedCount}권의 도서 구매가 완료되었습니다.`);
    } else if (purchasedCount > 0 && failedCount > 0) {
      alert(`${purchasedCount}권 구매 성공, ${failedCount}권 실패 (재고 부족)`);
    } else {
      alert('구매 가능한 도서가 없습니다. (재고 부족)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-pink-900' : 'bg-pink-100'
            }`}>
              <Heart className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
            <div>
              <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>찜한 도서</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {wishlistBooks.length}권의 도서
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {wishlistBooks.length === 0 ? (
            <div className={`p-12 rounded-lg text-center transition-colors ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Heart className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <p className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                찜한 도서가 없습니다
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                마음에 드는 도서를 찜해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistBooks.map((book) => {
                const avgRating = book.ratings.length > 0
                  ? book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length
                  : 0;
                const isSelected = selectedBooks.has(book.id);

                return (
                  <div
                    key={book.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      isDarkMode 
                        ? `bg-gray-700 border-gray-600 ${isSelected ? 'ring-2 ring-blue-500' : ''}` 
                        : `bg-white border-gray-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`
                    }`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleBookSelection(book.id)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Square className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                        )}
                      </button>

                      {/* Book Cover */}
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                      />

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className={`mb-1 line-clamp-1 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {book.title}
                        </h3>
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {book.author}
                        </p>

                        <div className="flex items-center gap-3">
                          {/* Genre & Year */}
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {book.genre}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {book.publishedYear}
                          </span>

                          {/* Rating */}
                          {avgRating > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= avgRating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {avgRating.toFixed(1)} ({book.ratings.length})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-sm mb-2 ${
                          book.stock === 0 
                            ? 'text-red-600' 
                            : book.stock <= 3 
                            ? 'text-yellow-600' 
                            : isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {book.stock === 0 ? '품절' : book.stock <= 3 ? '재고 부족' : '재고 충분'}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {book.stock}권
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveFromWishlist(book.id)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                        title="찜 해제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t transition-colors ${
          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                총 {wishlistBooks.length}권의 도서
              </p>
              {selectedBooks.size > 0 && (
                <>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {selectedBooks.size}권 선택됨
                  </p>
                  <p className={`${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                    총 가격: {calculateSelectedTotal().toLocaleString()}원
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {wishlistBooks.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {selectedBooks.size === wishlistBooks.length ? '전체 해제' : '전체 선택'}
                </button>
              )}
              {onAddToCart && selectedBooks.size > 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={selectedBooks.size === 0}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>장바구니 담기 ({selectedBooks.size})</span>
                </button>
              )}
              {onPurchaseBook && selectedBooks.size > 0 && (
                <button
                  onClick={handlePurchaseBooks}
                  disabled={selectedBooks.size === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>구매하기 ({selectedBooks.size})</span>
                </button>
              )}
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}