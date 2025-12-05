import { useState } from 'react';
import { X, BookOpen, User as UserIcon, Calendar, Hash, Tag, Star, MessageSquare, Send, Edit2, Trash2, Check, XCircle, Package, Plus, Minus } from 'lucide-react';

export function BookDetailDialog({ book, currentUser, loans, onClose, onUpdateBook, onLoanBook, onReturnBook, hasOverdueLoans }) {
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editingReviewText, setEditingReviewText] = useState('');

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Calculate average rating
    const calculateAverageRating = () => {
        if (book.ratings.length === 0) return 0;
        const sum = book.ratings.reduce((acc, r) => acc + r.rating, 0);
        return sum / book.ratings.length;
    };

    // Check if current user has already rated
    const userRating = book.ratings.find(r => r.userId === currentUser.id);
    const currentRating = userRating?.rating || 0;

    // Handle rating
    const handleRating = (rating) => {
        const existingRatingIndex = book.ratings.findIndex(r => r.userId === currentUser.id);

        let newRatings;
        if (existingRatingIndex >= 0) {
            // Update existing rating
            newRatings = [...book.ratings];
            newRatings[existingRatingIndex] = {
                userId: currentUser.id,
                rating,
                timestamp: new Date()
            };
        } else {
            // Add new rating
            newRatings = [
                ...book.ratings,
                {
                    userId: currentUser.id,
                    rating,
                    timestamp: new Date()
                }
            ];
        }

        onUpdateBook({
            ...book,
            ratings: newRatings
        });
    };

    // Handle review submission
    const handleSubmitReview = async () => {
        // 1. 유효성 검사 (내용이 없으면 바로 리턴)
        if (!reviewText.trim()) {
            alert("내용이 없는 댓글은 작성 불가합니다.");
            return;
        }
        try {
            // 2. 토큰 가져오기
            const token = localStorage.getItem('accessToken');

            if (!token) {
                alert("로그인이 필요한 기능입니다.");
                return;
            }

            const requestBody = {
                description: reviewText.trim()
            };

            // 3. API 호출 (인증 헤더 추가)
            const response = await fetch(`http://your-api-server.com/api/books/${book.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 명세서 반영: Bearer 토큰 방식
                },
                body: JSON.stringify(requestBody)
            });

            // 4. 응답 처리
            if (!response.ok) {
                // 에러 상황일 때 서버가 보내주는 JSON을 파싱
                const errorData = await response.json();

                // 명세서에 키값이 "Error Message"로 되어 있으므로 대괄호 표기법 사용 필수
                const serverErrorMessage = errorData["Error Message"];

                // 401 Unauthorized (인증 실패) 처리
                if (response.status === 401) {
                    alert(serverErrorMessage || "인증되지 않은 사용자입니다. 다시 로그인해주세요.");
                    // 필요하다면 여기서 로그인 페이지로 리다이렉트
                    // window.location.href = '/login';
                    return;
                }

                // 400 Bad Request 및 기타 에러 처리
                if (serverErrorMessage) {
                    throw new Error(serverErrorMessage);
                } else {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }
            }

            // 5. 성공 시 데이터 처리 (201 Created)
            const responseData = await response.json();

            const newReview = {
                id: responseData.commentId.toString(),
                userId: responseData.userId,
                comment: responseData.description,
                timestamp: new Date(responseData.createdAt)
            };

            onUpdateBook({
                ...book,
                reviews: [newReview, ...book.reviews]
            });

            setReviewText('');
            alert('한줄평이 성공적으로 등록되었습니다!');

        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            // 서버에서 받은 메시지를 사용자에게 알림으로 표시
            alert(error.message);
        }
    };

    // Handle review editing
    const handleEditReview = (reviewId) => {
        const review = book.reviews.find(r => r.id === reviewId);
        if (review) {
            setEditingReviewId(reviewId);
            setEditingReviewText(review.comment);
        }
    };

    // Handle review update
    const handleUpdateReview = () => {
        if (!editingReviewText.trim()) return;

        const updatedReviews = book.reviews.map(r => {
            if (r.id === editingReviewId) {
                return {
                    ...r,
                    comment: editingReviewText.trim(),
                    timestamp: new Date()
                };
            }
            return r;
        });

        onUpdateBook({
            ...book,
            reviews: updatedReviews
        });

        setEditingReviewId(null);
        setEditingReviewText('');
    };

    // Handle review deletion
// API 통신 및 삭제 권한 체크가 포함된 함수
    const handleDeleteReview = async (reviewId) => {
        // 1. 삭제 전 사용자 확인 (UX)
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            return;
        }

        try {
            // 2. 토큰 가져오기
            const token = localStorage.getItem('accessToken');

            if (!token) {
                alert("로그인이 필요한 기능입니다.");
                return;
            }

            // 3. API 호출 (DELETE 메서드)
            // ※ URL 주의: 보통 삭제는 /comments/{id} 또는 /books/{bookId}/comments/{id} 형식을 따릅니다.
            // 백엔드 명세에 맞는 정확한 주소로 변경해주세요.
            const response = await fetch(`http://your-api-server.com/api/comments/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 4. 에러 핸들링 (401, 403 등)
            if (!response.ok) {
                const errorData = await response.json();
                const serverErrorMessage = errorData["Error Message"]; // 대괄호 표기법 필수

                if (response.status === 401) {
                    alert(serverErrorMessage || "인증이 만료되었습니다. 다시 로그인해주세요.");
                    return;
                }

                if (response.status === 403) {
                    alert(serverErrorMessage || "삭제 권한이 없습니다."); // "댓글을 삭제할 권한이 없습니다."
                    return;
                }

                throw new Error(serverErrorMessage || "삭제 중 오류가 발생했습니다.");
            }

            // 5. 성공 처리 (204 No Content)
            // 중요: 204 응답은 Body가 비어있으므로 response.json()을 호출하면 안 됩니다!
            if (response.status === 204) {
                // UI에서 해당 리뷰 제거 (기존 로직 활용)
                const updatedReviews = book.reviews.filter(r => r.id !== reviewId);

                onUpdateBook({
                    ...book,
                    reviews: updatedReviews
                });

                alert("댓글이 삭제되었습니다.");
            }

        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            alert(error.message);
        }
    };

/* 재고 관리 시스템 --- 대출관련으로 만들어져 있어서 구매형태로 수정 예정*/
    // Calculate available stock
    const calculateAvailableStock = () => {
        const currentLoans = loans.filter(l => l.bookId === book.id && !l.returnDate);
        return book.stock - currentLoans.length;
    };

    // Handle stock increase
    const handleIncreaseStock = () => {
        onUpdateBook({
            ...book,
            stock: book.stock + 1
        });
    };

    // Handle stock decrease
    const handleDecreaseStock = () => {
        if (book.stock <= 0) return;

        // Calculate currently loaned books
        const loanedCount = book.stock - calculateAvailableStock();

        // Cannot decrease stock below the number of currently loaned books
        if (book.stock - 1 < loanedCount) {
            alert('현재 대출 중인 도서가 있어 재고를 줄일 수 없습니다.');
            return;
        }

        onUpdateBook({
            ...book,
            stock: book.stock - 1
        });
    };

    const averageRating = calculateAverageRating();
    const availableStock = calculateAvailableStock();

    // Check if current user has active loan for this book
    const userActiveLoans = loans.filter(l => l.bookId === book.id && l.userId === currentUser.id && !l.returnDate);
    const hasActiveLoan = userActiveLoans.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-gray-900">도서 상세 정보</h2>
                            <p className="text-sm text-gray-500">
                                {averageRating > 0 && (
                                    <span className="inline-flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="text-gray-400">({book.ratings.length}명 평가)</span>
                  </span>
                                )}
                                {averageRating === 0 && <span>아직 평가가 없습니다</span>}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-6 mb-6">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-48 h-72 object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Book Information */}
                        <div className="flex-1 space-y-4">
                            {/* Title and Genre */}
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-2xl text-gray-900">{book.title}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {book.genre}
                  </span>
                                </div>
                                <p className="text-lg text-gray-600">{book.author}</p>
                            </div>

                            {/* Description */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm text-gray-700 mb-2">설명</h4>
                                <p className="text-gray-600 leading-relaxed">{book.description}</p>
                            </div>

                            {/* Details */}
                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <h4 className="text-sm text-gray-700 mb-3">도서 정보</h4>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">출판연도</span>
                                    </div>
                                    <span className="text-gray-900">{book.publishedYear}년</span>
                                </div>

                                {book.isbn && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Hash className="w-4 h-4" />
                                            <span className="text-sm">ISBN</span>
                                        </div>
                                        <span className="text-gray-900">{book.isbn}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-sm">장르</span>
                                    </div>
                                    <span className="text-gray-900">{book.genre}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <UserIcon className="w-4 h-4" />
                                        <span className="text-sm">등록자</span>
                                    </div>
                                    <span className="text-gray-900">{book.createdBy}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">등록일</span>
                                    </div>
                                    <span className="text-gray-900">{formatDate(book.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-gray-900 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                평가하기
                            </h4>
                            {userRating && (
                                <span className="text-sm text-gray-500">
                  내 평가: {currentRating}점
                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= (hoverRating || currentRating)
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                {hoverRating > 0 ? `${hoverRating}점` : currentRating > 0 ? `${currentRating}점 평가됨` : '별을 클릭하여 평가하세요'}
              </span>
                        </div>

                        {book.ratings.length > 0 && (
                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                                <span className="text-2xl text-gray-900">{averageRating.toFixed(1)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">평균 평점</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl text-gray-900">{book.ratings.length}</p>
                                        <p className="text-sm text-gray-500">명 평가</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            한줄평 ({book.reviews.length})
                        </h4>

                        {/* Review Input */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="이 책에 대한 한줄평을 남겨주세요..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmitReview();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={!reviewText.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    등록
                                </button>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {book.reviews.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>아직 한줄평이 없습니다.</p>
                                    <p className="text-sm">첫 번째 한줄평을 남겨보세요!</p>
                                </div>
                            ) : (
                                book.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-900">{review.userId}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(review.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            {review.userId === currentUser.id && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditReview(review.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {editingReviewId === review.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editingReviewText}
                                                    onChange={(e) => setEditingReviewText(e.target.value)}
                                                    placeholder="한줄평을 수정하세요..."
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateReview();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={handleUpdateReview}
                                                    disabled={!editingReviewText.trim()}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => setEditingReviewId(null)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    취소
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 ml-10">{review.comment}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Loan Section */}
                    {onLoanBook && onReturnBook && currentUser.role !== 'admin' && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                대출 관리
                            </h4>

                            {hasOverdueLoans && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                                    ⚠️ 연체된 도서가 있어 대출이 불가능합니다. 먼저 반납해주세요.
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">잔여 재고</p>
                                        <p className="text-2xl text-blue-600">{availableStock}권</p>
                                    </div>
                                    {hasActiveLoan && (
                                        <div>
                                            <p className="text-sm text-gray-600">내 대출</p>
                                            <p className="text-2xl text-green-600">{userActiveLoans.length}권</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => onLoanBook(book.id)}
                                        disabled={hasOverdueLoans || availableStock <= 0}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        대출하기
                                    </button>
                                    {hasActiveLoan && (
                                        <button
                                            onClick={() => onReturnBook(userActiveLoans[0].id)}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Minus className="w-4 h-4" />
                                            대출 취소 (1권)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stock Management Section - Admin Only */}
                    {currentUser.role === 'admin' && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                재고 관리
                            </h4>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">총 재고</p>
                                        <p className="text-2xl text-gray-900">{book.stock}권</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">대출 중</p>
                                        <p className="text-2xl text-gray-900">{book.stock - availableStock}권</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">잔여 재고</p>
                                        <p className="text-2xl text-blue-600">{availableStock}권</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={handleDecreaseStock}
                                        disabled={book.stock <= 0 || availableStock <= 0}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Minus className="w-4 h-4" />
                                        재고 감소
                                    </button>
                                    <button
                                        onClick={handleIncreaseStock}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        재고 증가
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}