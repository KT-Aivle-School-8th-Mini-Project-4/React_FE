import { Book, Loan } from '../App';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  loans: Loan[];
  selectedBookIds: string[];
  onSelectBook: (id: string) => void;
  onBookClick: (book: Book) => void;
  isSelectionMode: boolean;
}

export function BookList({ books, loans, selectedBookIds, onSelectBook, onBookClick, isSelectionMode }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-gray-900 mb-2">도서가 없습니다</h3>
        <p className="text-gray-500">새로운 도서를 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          loans={loans}
          isSelected={selectedBookIds.includes(book.id)}
          onSelect={onSelectBook}
          onBookClick={onBookClick}
          isSelectionMode={isSelectionMode}
        />
      ))}
    </div>
  );
}