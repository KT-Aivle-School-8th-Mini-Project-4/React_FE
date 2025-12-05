import { useState } from 'react';
import { Book, Loan } from '../App';
import { X, Search, Package, BookOpen, Users, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { LoanDetailsDialog } from './LoanDetailsDialog';

interface BookInventoryDialogProps {
  books: Book[];
  loans: Loan[];
  onClose: () => void;
  onEditBook: (book: Book) => void;
}

type SortField = 'title' | 'author' | 'genre' | 'isbn' | 'stock' | 'totalLoaned' | 'available' | 'loanRate';
type SortDirection = 'asc' | 'desc';

export function BookInventoryDialog({ books, loans, onClose, onEditBook }: BookInventoryDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedBookForLoanDetails, setSelectedBookForLoanDetails] = useState<Book | null>(null);

  // Calculate loan stats for each book
  const getBooksWithStats = () => {
    return books.map(book => {
      const activeLoans = loans.filter(l => l.bookId === book.id && !l.returnDate);
      const totalLoaned = activeLoans.length;
      const available = book.stock - totalLoaned;
      
      return {
        ...book,
        totalLoaned,
        available
      };
    });
  };

  // Filter books based on search
  const filteredBooks = getBooksWithStats().filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query)
    );
  });

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Sort books based on selected field and direction
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (sortBy === 'loanRate') {
      aValue = a.stock > 0 ? (a.totalLoaned / a.stock) * 100 : 0;
      bValue = b.stock > 0 ? (b.totalLoaned / b.stock) * 100 : 0;
    } else {
      aValue = a[sortBy] || '';
      bValue = b[sortBy] || '';
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  // Calculate overall statistics
  const totalBooks = books.length;
  const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
  const totalLoaned = loans.filter(l => !l.returnDate).length;
  const totalAvailable = totalStock - totalLoaned;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900">도서 현황 관리</h2>
              <p className="text-sm text-gray-500">전체 도서의 재고 및 대출 현황</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600">총 도서</p>
              </div>
              <p className="text-2xl text-gray-900">{totalBooks}권</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-green-600" />
                <p className="text-sm text-gray-600">총 재고</p>
              </div>
              <p className="text-2xl text-gray-900">{totalStock}권</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-gray-600">대출 중</p>
              </div>
              <p className="text-2xl text-gray-900">{totalLoaned}권</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600">대출 가능</p>
              </div>
              <p className="text-2xl text-gray-900">{totalAvailable}권</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서 검색 (제목, 저자, 장르, ISBN)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Book List */}
        <div className="flex-1 overflow-hidden px-6 py-4 flex flex-col">
          {sortedBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? '검색 결과가 없습니다' : '등록된 도서가 없습니다'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 whitespace-nowrap">표지</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('title')}
                      >
                        제목
                        {sortBy === 'title' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('author')}
                      >
                        저자
                        {sortBy === 'author' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('genre')}
                      >
                        장르
                        {sortBy === 'genre' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('isbn')}
                      >
                        ISBN
                        {sortBy === 'isbn' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 mx-auto hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('stock')}
                      >
                        총 재고
                        {sortBy === 'stock' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 mx-auto hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('totalLoaned')}
                      >
                        대출 중
                        {sortBy === 'totalLoaned' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 mx-auto hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('available')}
                      >
                        잔여
                        {sortBy === 'available' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <button
                        className="flex items-center gap-1 mx-auto hover:text-gray-900 transition-colors"
                        onClick={() => handleSort('loanRate')}
                      >
                        대출률
                        {sortBy === 'loanRate' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedBooks.map(book => {
                    const loanRate = book.stock > 0 ? (book.totalLoaned / book.stock) * 100 : 0;
                    
                    return (
                      <tr 
                        key={book.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onEditBook(book)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-gray-900 max-w-xs truncate">{book.title}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-gray-700">{book.author}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                            {book.genre}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-gray-600 text-sm">{book.isbn || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <p className="text-gray-900">{book.stock}</p>
                        </td>
                        <td 
                          className="px-4 py-3 text-center whitespace-nowrap"
                          onClick={(e) => {
                            if (book.totalLoaned > 0) {
                              e.stopPropagation();
                              setSelectedBookForLoanDetails(book);
                            }
                          }}
                        >
                          <p className={`${
                            book.totalLoaned > 0 
                              ? 'text-orange-600 hover:text-orange-700 underline decoration-dotted cursor-pointer' 
                              : 'text-gray-400'
                          }`}>
                            {book.totalLoaned}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <p className={`${
                            book.available === 0 
                              ? 'text-red-600' 
                              : book.available <= 2 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                          }`}>
                            {book.available}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  loanRate >= 80 
                                    ? 'bg-red-500' 
                                    : loanRate >= 50 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${loanRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {loanRate.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <p className="text-sm text-gray-600">
            총 {sortedBooks.length}권의 도서
            {searchQuery && ` (검색 결과)`}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Loan Details Dialog */}
      {selectedBookForLoanDetails && (
        <LoanDetailsDialog
          book={selectedBookForLoanDetails}
          loans={loans}
          onClose={() => setSelectedBookForLoanDetails(null)}
        />
      )}
    </div>
  );
}