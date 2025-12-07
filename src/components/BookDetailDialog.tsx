// import { useState } from 'react';
// import { Book, Rating, Review, User, Loan } from '../App';
// import { X, BookOpen, User as UserIcon, Calendar, Hash, Tag, Star, MessageSquare, Send, Edit2, Trash2, Check, XCircle, Package, Plus, Minus } from 'lucide-react';
//
// interface BookDetailDialogProps {
//   book: Book;
//   currentUser: User;
//   loans: Loan[];
//   onClose: () => void;
//   onUpdateBook: (book: Book) => void;
//   onLoanBook?: (bookId: string) => void;
//   onReturnBook?: (loanId: string) => void;
//   hasOverdueLoans?: boolean;
// }
//
// export function BookDetailDialog({ book, currentUser, loans, onClose, onUpdateBook, onLoanBook, onReturnBook, hasOverdueLoans }: BookDetailDialogProps) {
//   const [reviewText, setReviewText] = useState('');
//   const [hoverRating, setHoverRating] = useState(0);
//   const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
//   const [editingReviewText, setEditingReviewText] = useState('');
//
//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('ko-KR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };
//
//   // Calculate average rating
//   const calculateAverageRating = () => {
//     if (book.ratings.length === 0) return 0;
//     const sum = book.ratings.reduce((acc, r) => acc + r.rating, 0);
//     return sum / book.ratings.length;
//   };
//
//   // Check if current user has already rated
//   const userRating = book.ratings.find(r => r.userId === currentUser.id);
//   const currentRating = userRating?.rating || 0;
//
//   // Handle rating
//   const handleRating = (rating: number) => {
//     const existingRatingIndex = book.ratings.findIndex(r => r.userId === currentUser.id);
//
//     let newRatings: Rating[];
//     if (existingRatingIndex >= 0) {
//       // Update existing rating
//       newRatings = [...book.ratings];
//       newRatings[existingRatingIndex] = {
//         userId: currentUser.id,
//         rating,
//         timestamp: new Date()
//       };
//     } else {
//       // Add new rating
//       newRatings = [
//         ...book.ratings,
//         {
//           userId: currentUser.id,
//           rating,
//           timestamp: new Date()
//         }
//       ];
//     }
//
//     onUpdateBook({
//       ...book,
//       ratings: newRatings
//     });
//   };
//
//   // Handle review submission
//   const handleSubmitReview = () => {
//     if (!reviewText.trim()) return;
//
//     const newReview: Review = {
//       id: Date.now().toString(),
//       userId: currentUser.id,
//       comment: reviewText.trim(),
//       timestamp: new Date()
//     };
//
//     onUpdateBook({
//       ...book,
//       reviews: [newReview, ...book.reviews]
//     });
//
//     setReviewText('');
//   };
//
//   // Handle review editing
//   const handleEditReview = (reviewId: string) => {
//     const review = book.reviews.find(r => r.id === reviewId);
//     if (review) {
//       setEditingReviewId(reviewId);
//       setEditingReviewText(review.comment);
//     }
//   };
//
//   // Handle review update
//   const handleUpdateReview = () => {
//     if (!editingReviewText.trim()) return;
//
//     const updatedReviews = book.reviews.map(r => {
//       if (r.id === editingReviewId) {
//         return {
//           ...r,
//           comment: editingReviewText.trim(),
//           timestamp: new Date()
//         };
//       }
//       return r;
//     });
//
//     onUpdateBook({
//       ...book,
//       reviews: updatedReviews
//     });
//
//     setEditingReviewId(null);
//     setEditingReviewText('');
//   };
//
//   // Handle review deletion
//   const handleDeleteReview = (reviewId: string) => {
//     const updatedReviews = book.reviews.filter(r => r.id !== reviewId);
//
//     onUpdateBook({
//       ...book,
//       reviews: updatedReviews
//     });
//   };
//
//   // Calculate available stock
//   const calculateAvailableStock = () => {
//     const currentLoans = loans.filter(l => l.bookId === book.id && !l.returnDate);
//     return book.stock - currentLoans.length;
//   };
//
//   // Handle stock increase
//   const handleIncreaseStock = () => {
//     onUpdateBook({
//       ...book,
//       stock: book.stock + 1
//     });
//   };
//
//   // Handle stock decrease
//   const handleDecreaseStock = () => {
//     if (book.stock <= 0) return;
//
//     // Calculate currently loaned books
//     const loanedCount = book.stock - calculateAvailableStock();
//
//     // Cannot decrease stock below the number of currently loaned books
//     if (book.stock - 1 < loanedCount) {
//       alert('현재 대출 중인 도서가 있어 재고를 줄일 수 없습니다.');
//       return;
//     }
//
//     onUpdateBook({
//       ...book,
//       stock: book.stock - 1
//     });
//   };
//
//   const averageRating = calculateAverageRating();
//   const availableStock = calculateAvailableStock();
//
//   // Check if current user has active loan for this book
//   const userActiveLoans = loans.filter(l => l.bookId === book.id && l.userId === currentUser.id && !l.returnDate);
//   const hasActiveLoan = userActiveLoans.length > 0;
//
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <BookOpen className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-gray-900">도서 상세 정보</h2>
//               <p className="text-sm text-gray-500">
//                 {averageRating > 0 && (
//                   <span className="inline-flex items-center gap-1">
//                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                     <span>{averageRating.toFixed(1)}</span>
//                     <span className="text-gray-400">({book.ratings.length}명 평가)</span>
//                   </span>
//                 )}
//                 {averageRating === 0 && <span>아직 평가가 없습니다</span>}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
//
//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="flex gap-6 mb-6">
//             {/* Book Cover */}
//             <div className="flex-shrink-0">
//               <img
//                 src={book.coverImage}
//                 alt={book.title}
//                 className="w-48 h-72 object-cover rounded-lg shadow-lg"
//               />
//             </div>
//
//             {/* Book Information */}
//             <div className="flex-1 space-y-4">
//               {/* Title and Genre */}
//               <div>
//                 <div className="flex items-start justify-between mb-2">
//                   <h3 className="text-2xl text-gray-900">{book.title}</h3>
//                   <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
//                     {book.genre}
//                   </span>
//                 </div>
//                 <p className="text-lg text-gray-600">{book.author}</p>
//               </div>
//
//               {/* Description */}
//               <div className="pt-4 border-t border-gray-200">
//                 <h4 className="text-sm text-gray-700 mb-2">설명</h4>
//                 <p className="text-gray-600 leading-relaxed">{book.description}</p>
//               </div>
//
//               {/* Details */}
//               <div className="pt-4 border-t border-gray-200 space-y-3">
//                 <h4 className="text-sm text-gray-700 mb-3">도서 정보</h4>
//
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Calendar className="w-4 h-4" />
//                     <span className="text-sm">출판연도</span>
//                   </div>
//                   <span className="text-gray-900">{book.publishedYear}년</span>
//                 </div>
//
//                 {book.isbn && (
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <Hash className="w-4 h-4" />
//                       <span className="text-sm">ISBN</span>
//                     </div>
//                     <span className="text-gray-900">{book.isbn}</span>
//                   </div>
//                 )}
//
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Tag className="w-4 h-4" />
//                     <span className="text-sm">장르</span>
//                   </div>
//                   <span className="text-gray-900">{book.genre}</span>
//                 </div>
//
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <UserIcon className="w-4 h-4" />
//                     <span className="text-sm">등록자</span>
//                   </div>
//                   <span className="text-gray-900">{book.createdBy}</span>
//                 </div>
//
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Calendar className="w-4 h-4" />
//                     <span className="text-sm">등록일</span>
//                   </div>
//                   <span className="text-gray-900">{formatDate(book.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//
//           {/* Rating Section */}
//           <div className="border-t border-gray-200 pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-gray-900 flex items-center gap-2">
//                 <Star className="w-5 h-5 text-yellow-500" />
//                 평가하기
//               </h4>
//               {userRating && (
//                 <span className="text-sm text-gray-500">
//                   내 평가: {currentRating}점
//                 </span>
//               )}
//             </div>
//
//             <div className="flex items-center gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onClick={() => handleRating(star)}
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   className="p-1 transition-transform hover:scale-110"
//                 >
//                   <Star
//                     className={`w-8 h-8 ${
//                       star <= (hoverRating || currentRating)
//                         ? 'text-yellow-500 fill-yellow-500'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 </button>
//               ))}
//               <span className="ml-2 text-sm text-gray-600">
//                 {hoverRating > 0 ? `${hoverRating}점` : currentRating > 0 ? `${currentRating}점 평가됨` : '별을 클릭하여 평가하세요'}
//               </span>
//             </div>
//
//             {book.ratings.length > 0 && (
//               <div className="mt-4 bg-gray-50 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div>
//                       <div className="flex items-center gap-1">
//                         <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
//                         <span className="text-2xl text-gray-900">{averageRating.toFixed(1)}</span>
//                       </div>
//                       <p className="text-sm text-gray-500">평균 평점</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-2xl text-gray-900">{book.ratings.length}</p>
//                     <p className="text-sm text-gray-500">명 평가</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//
//           {/* Reviews Section */}
//           <div className="border-t border-gray-200 pt-6 mt-6">
//             <h4 className="text-gray-900 mb-4 flex items-center gap-2">
//               <MessageSquare className="w-5 h-5 text-blue-600" />
//               한줄평 ({book.reviews.length})
//             </h4>
//
//             {/* Review Input */}
//             <div className="mb-6">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={reviewText}
//                   onChange={(e) => setReviewText(e.target.value)}
//                   placeholder="이 책에 대한 한줄평을 남겨주세요..."
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       handleSubmitReview();
//                     }
//                   }}
//                 />
//                 <button
//                   onClick={handleSubmitReview}
//                   disabled={!reviewText.trim()}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   <Send className="w-4 h-4" />
//                   등록
//                 </button>
//               </div>
//             </div>
//
//             {/* Reviews List */}
//             <div className="space-y-3 max-h-60 overflow-y-auto">
//               {book.reviews.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                   <p>아직 한줄평이 없습니다.</p>
//                   <p className="text-sm">첫 번째 한줄평을 남겨보세요!</p>
//                 </div>
//               ) : (
//                 book.reviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="bg-gray-50 rounded-lg p-4 border border-gray-200"
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                           <UserIcon className="w-4 h-4 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-900">{review.userId}</p>
//                           <p className="text-xs text-gray-500">
//                             {formatDate(review.timestamp)}
//                           </p>
//                         </div>
//                       </div>
//                       {review.userId === currentUser.id && (
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleEditReview(review.id)}
//                             className="p-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteReview(review.id)}
//                             className="p-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                     {editingReviewId === review.id ? (
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           value={editingReviewText}
//                           onChange={(e) => setEditingReviewText(e.target.value)}
//                           placeholder="한줄평을 수정하세요..."
//                           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                               handleUpdateReview();
//                             }
//                           }}
//                         />
//                         <button
//                           onClick={handleUpdateReview}
//                           disabled={!editingReviewText.trim()}
//                           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                         >
//                           <Check className="w-4 h-4" />
//                           수정
//                         </button>
//                         <button
//                           onClick={() => setEditingReviewId(null)}
//                           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                         >
//                           <XCircle className="w-4 h-4" />
//                           취소
//                         </button>
//                       </div>
//                     ) : (
//                       <p className="text-gray-700 ml-10">{review.comment}</p>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//
//           {/* Loan Section */}
//           {onLoanBook && onReturnBook && currentUser.role !== 'admin' && (
//             <div className="border-t border-gray-200 pt-6 mt-6">
//               <h4 className="text-gray-900 mb-4 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-blue-600" />
//                 대출 관리
//               </h4>
//
//               {hasOverdueLoans && (
//                 <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
//                   ⚠️ 연체된 도서가 있어 대출이 불가능합니다. 먼저 반납해주세요.
//                 </div>
//               )}
//
//               <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">잔여 재고</p>
//                     <p className="text-2xl text-blue-600">{availableStock}권</p>
//                   </div>
//                   {hasActiveLoan && (
//                     <div>
//                       <p className="text-sm text-gray-600">내 대출</p>
//                       <p className="text-2xl text-green-600">{userActiveLoans.length}권</p>
//                     </div>
//                   )}
//                 </div>
//
//                 <div className="flex gap-2 pt-3 border-t border-gray-200">
//                   <button
//                     onClick={() => onLoanBook(book.id)}
//                     disabled={hasOverdueLoans || availableStock <= 0}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     대출하기
//                   </button>
//                   {hasActiveLoan && (
//                     <button
//                       onClick={() => onReturnBook(userActiveLoans[0].id)}
//                       className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Minus className="w-4 h-4" />
//                       대출 취소 (1권)
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//
//           {/* Stock Management Section - Admin Only */}
//           {currentUser.role === 'admin' && (
//             <div className="border-t border-gray-200 pt-6 mt-6">
//               <h4 className="text-gray-900 mb-4 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-blue-600" />
//                 재고 관리
//               </h4>
//
//               <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">총 재고</p>
//                     <p className="text-2xl text-gray-900">{book.stock}권</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">대출 중</p>
//                     <p className="text-2xl text-gray-900">{book.stock - availableStock}권</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">잔여 재고</p>
//                     <p className="text-2xl text-blue-600">{availableStock}권</p>
//                   </div>
//                 </div>
//
//                 <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
//                   <button
//                     onClick={handleDecreaseStock}
//                     disabled={book.stock <= 0 || availableStock <= 0}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     <Minus className="w-4 h-4" />
//                     재고 감소
//                   </button>
//                   <button
//                     onClick={handleIncreaseStock}
//                     className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     재고 증가
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//
//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             닫기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
    X, BookOpen, User as UserIcon, Calendar, Hash, Tag,
    Star, MessageSquare, Send, Edit2, Trash2,
    Check, XCircle, Package, Plus, Minus
} from "lucide-react";

import { Book, User, Loan, Review, Rating } from "../App";

interface BookDetailDialogProps {
    book: Book;                 // 전달되는 book의 id만 사용, 상세는 fetch로 재조회
    currentUser: User;
    loans: Loan[];
    onClose: () => void;
    onLoanBook?: (bookId: string) => void;
    onReturnBook?: (loanId: string) => void;
    hasOverdueLoans?: boolean;
}

export function BookDetailDialog({
                                     book,
                                     currentUser,
                                     loans,
                                     onClose,
                                     onLoanBook,
                                     onReturnBook,
                                     hasOverdueLoans
                                 }: BookDetailDialogProps) {

    /** 상세 정보 */
    const [bookData, setBookData] = useState<Book | null>(null);

    /** 리뷰 상태 */
    const [reviewText, setReviewText] = useState("");
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editingReviewText, setEditingReviewText] = useState("");

    /** 평점 Hover */
    const [hoverRating, setHoverRating] = useState(0);

    /** 상세 조회(load) */
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/book/${book.id}`);
                if (!res.ok) throw new Error("상세 조회 실패");
                const data = await res.json();
                setBookData(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDetail();
    }, [book.id]);

    if (!bookData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow">로딩 중...</div>
            </div>
        );
    }


    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(d);
    };

    /** ───────────────────────────────────────────────────
     *  평점 저장 (PUT /api/book/{id}/rating)
     * ─────────────────────────────────────────────────── */
    const handleRating = async (rating: number) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/book/${bookData.id}/rating`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        rating
                    })
                }
            );

            if (!res.ok) {
                alert("평점 저장 실패");
                return;
            }

            const updated = await res.json();
            setBookData(updated);

        } catch (err) {
            console.error(err);
        }
    };

    /** ───────────────────────────────────────────────────
     *  리뷰 작성 (POST /api/book/{id}/review)
     * ─────────────────────────────────────────────────── */
    const handleSubmitReview = async () => {
        if (!reviewText.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/book/${bookData.id}/review`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        comment: reviewText
                    })
                }
            );

            if (!res.ok) {
                alert("리뷰 등록 실패");
                return;
            }

            const updated = await res.json();
            setBookData(updated);
            setReviewText("");

        } catch (err) {
            console.error(err);
        }
    };

    /** ───────────────────────────────────────────────────
     *  리뷰 수정 (PUT /api/review/{id})
     * ─────────────────────────────────────────────────── */
    const handleUpdateReview = async () => {
        if (!editingReviewId || !editingReviewText.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/review/${editingReviewId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        comment: editingReviewText
                    })
                }
            );

            if (!res.ok) {
                alert("리뷰 수정 실패");
                return;
            }

            const updated = await res.json();
            setBookData(updated);

            setEditingReviewId(null);
            setEditingReviewText("");

        } catch (err) {
            console.error(err);
        }
    };

    /** ───────────────────────────────────────────────────
     *  리뷰 삭제 (DELETE /api/review/{id})
     * ─────────────────────────────────────────────────── */
    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("리뷰를 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/review/${reviewId}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                alert("리뷰 삭제 실패");
                return;
            }

            const updated = await res.json();
            setBookData(updated);

        } catch (err) {
            console.error(err);
        }
    };

    /** ───────────────────────────────────────────────────
     *  재고 +1, -1 (PUT /api/book/{id}/stock)
     * ─────────────────────────────────────────────────── */
    const updateStock = async (change: number) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/book/${bookData.id}/stock`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ change })
                }
            );

            if (!res.ok) {
                alert("재고 수정 실패");
                return;
            }

            const updated = await res.json();
            setBookData(updated);

        } catch (err) {
            console.error(err);
        }
    };

    /** 계산 로직들 */
    const averageRating =
        bookData.ratings.length === 0
            ? 0
            : bookData.ratings.reduce((a, b) => a + b.rating, 0) /
            bookData.ratings.length;

    const userRating =
        bookData.ratings.find((r) => r.userId === currentUser.id)?.rating || 0;

    const currentLoans = loans.filter(
        (l) => l.bookId === bookData.id && !l.returnDate
    );
    const availableStock = bookData.stock - currentLoans.length;

    const userActiveLoans = loans.filter(
        (l) => l.bookId === bookData.id && l.userId === currentUser.id && !l.returnDate
    );

    const hasActiveLoan = userActiveLoans.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-xl text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        도서 상세 정보
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* 상단 UI (표지, 기본 정보) */}
                    <div className="flex gap-6">
                        <img
                            src={bookData.coverImage}
                            className="w-48 h-72 object-cover rounded-md shadow-md"
                        />

                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-semibold">{bookData.title}</h3>
                            <p className="text-gray-700">{bookData.author}</p>

                            <div className="text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> {bookData.genre}
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4" /> {bookData.publishedYear}년
                                </div>

                                {bookData.isbn && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Hash className="w-4 h-4" /> {bookData.isbn}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 설명 */}
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-gray-700 mb-2">설명</h4>
                        <p className="text-gray-600 whitespace-pre-line">
                            {bookData.description}
                        </p>
                    </div>

                    {/* 평가 섹션 */}
                    <div className="mt-6 border-t pt-6">
                        <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" /> 평가하기
                        </h4>

                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => handleRating(value)}
                                    onMouseEnter={() => setHoverRating(value)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            value <= (hoverRating || userRating)
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            평균 {averageRating.toFixed(1)}점 ({bookData.ratings.length}명 평가)
                        </p>
                    </div>

                    {/* 리뷰 섹션 */}
                    <div className="mt-8 border-t pt-6">
                        <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            한줄평 ({bookData.reviews.length})
                        </h4>

                        {/* 리뷰 작성 */}
                        <div className="flex gap-2 mb-4">
                            <input
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2"
                                placeholder="한줄평 작성"
                            />
                            <button
                                onClick={handleSubmitReview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                        {/* 리뷰 목록 */}
                        <div className="space-y-3">
                            {bookData.reviews.map((review) => (
                                <div key={review.id} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold">{review.userId}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(review.timestamp)}
                                            </p>
                                        </div>

                                        {/* 내 리뷰일 때만 수정/삭제 */}
                                        {review.userId === currentUser.id && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingReviewId(review.id);
                                                        setEditingReviewText(review.comment);
                                                    }}
                                                    className="text-gray-600 hover:text-black"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 수정 중 */}
                                    {editingReviewId === review.id ? (
                                        <div className="mt-2 flex gap-2">
                                            <input
                                                value={editingReviewText}
                                                onChange={(e) => setEditingReviewText(e.target.value)}
                                                className="flex-1 border rounded px-2 py-1"
                                            />
                                            <button
                                                onClick={handleUpdateReview}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingReviewId(null)}
                                                className="px-3 py-1 bg-gray-300 rounded-lg"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-gray-700">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 재고 관리 (관리자만) */}
                    {currentUser.role === "admin" && (
                        <div className="mt-8 border-t pt-6">
                            <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                재고 관리
                            </h4>

                            <p className="text-lg">
                                총 재고: <b>{bookData.stock}</b>권
                                / 대출 중: <b>{currentLoans.length}</b>권
                                / 잔여: <b>{availableStock}</b>권
                            </p>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => updateStock(-1)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                    disabled={availableStock <= 0}
                                >
                                    <Minus className="w-4 h-4" /> 감소
                                </button>

                                <button
                                    onClick={() => updateStock(+1)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                >
                                    <Plus className="w-4 h-4" /> 증가
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
