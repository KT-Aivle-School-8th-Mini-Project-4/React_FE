import { Book, Loan } from '../App';
import { Calendar, Check, Star, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookCardProps {
  book: Book;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onBookClick: (book: Book) => void;
  isSelectionMode: boolean;
  loans: Loan[];
}

export function BookCard({ book, isSelected, onSelect, onBookClick, isSelectionMode, loans }: BookCardProps) {
  const handleClick = () => {
    if (isSelectionMode) {
      onSelect(book.id);
    } else {
      onBookClick(book);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!book.ratings || book.ratings.length === 0) return 0;
    const sum = book.ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / book.ratings.length;
  };

  // Calculate available stock (total stock - currently loaned books), 연동 시
  const calculateAvailableStock = () => {
    const currentlyLoaned = loans.filter(
      (loan: Loan) => loan.bookId === book.id && !loan.returnDate
    ).length;
    return book.stock - currentlyLoaned;
  };

  const averageRating = calculateAverageRating();
  const availableStock = calculateAvailableStock();

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative cursor-pointer transform hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-600' : ''
      }`}
    >
      {/* Selection Checkbox - Only visible in selection mode */}
      {isSelectionMode && (
        <div className="absolute top-2 left-2 z-10">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-gray-300 hover:border-blue-400'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
      )}

      {/* Book Cover - Reduced height */}
      <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 right-1 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px]">
          {book.category}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-3">
        <h3 className="text-sm text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
        {/*<p className="text-xs text-gray-600 mb-2">{book.author}</p>*/}
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {book.description}
        </p>

        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {book.publishedYear}
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              재고 {availableStock}권
            </div>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-3 h-3 fill-yellow-500" />
              {averageRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}