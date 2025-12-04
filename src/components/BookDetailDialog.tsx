import { Book } from '../App';
import { X, BookOpen, User, Calendar, Hash, Tag } from 'lucide-react';

interface BookDetailDialogProps {
  book: Book;
  onClose: () => void;
}

export function BookDetailDialog({ book, onClose }: BookDetailDialogProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900">도서 상세 정보</h2>
              <p className="text-sm text-gray-500">상세 내용을 확인하세요</p>
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
          <div className="flex gap-6">
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
                    <User className="w-4 h-4" />
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
