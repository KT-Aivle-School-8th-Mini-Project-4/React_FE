import { useState } from 'react';
import { Book, Purchase } from '../App';
import { X, Search, Package, BookOpen, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';

interface BookInventoryDialogProps {
  books: Book[];
  purchases: Purchase[];
  onClose: () => void;
  onEditBook: (book: Book) => void;
}

type SortField = 'title' | 'author' | 'genre' | 'isbn' | 'stock';
type SortDirection = 'asc' | 'desc';

export function BookInventoryDialog({ books, purchases, onClose, onEditBook }: BookInventoryDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Calculate purchase stats for each book
  const getBooksWithStats = () => {
    return books.map(book => {
      const bookPurchases = purchases.filter(p => p.bookId === book.id);
      const totalPurchased = bookPurchases.length;
      
      return {
        ...book,
        totalPurchased
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
    let aValue: any = a[sortBy] || '';
    let bValue: any = b[sortBy] || '';

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
  const totalPurchased = purchases.length;
  const booksInStock = books.filter(book => book.stock > 0).length;
  const booksOutOfStock = books.filter(book => book.stock === 0).length;
  const lowStockBooks = books.filter(book => book.stock > 0 && book.stock <= 3).length;

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  // Get stock status color
  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-gray-900">도서 현황</h2>
                <p className="text-sm text-gray-500">전체 도서의 재고 현황을 확인할 수 있습니다</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Statistics Summary */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-gray-600">전체 도서</p>
                </div>
                <p className="text-xl text-gray-900">{totalBooks}권</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-gray-600">총 재고</p>
                </div>
                <p className="text-xl text-gray-900">{totalStock}권</p>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-gray-600">총 판매</p>
                </div>
                <p className="text-xl text-gray-900">{totalPurchased}권</p>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-gray-600">재고 있음</p>
                </div>
                <p className="text-xl text-green-600">{booksInStock}권</p>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-xs text-gray-600">재고 부족</p>
                </div>
                <p className="text-xl text-yellow-600">{lowStockBooks}권</p>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-xs text-gray-600">재고 없음</p>
                </div>
                <p className="text-xl text-red-600">{booksOutOfStock}권</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서명, 저자명, 장르, ISBN으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    도서명 {renderSortIcon('title')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('author')}
                  >
                    저자 {renderSortIcon('author')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('genre')}
                  >
                    장르 {renderSortIcon('genre')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('isbn')}
                  >
                    ISBN {renderSortIcon('isbn')}
                  </th>
                  <th 
                    className="px-4 py-3 text-center text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('stock')}
                  >
                    재고 {renderSortIcon('stock')}
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-gray-600">
                    상태
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-gray-600">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      {searchQuery ? '검색 결과가 없습니다.' : '등록된 도서가 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  sortedBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm text-gray-900">{book.title}</p>
                            <p className="text-xs text-gray-500">ID: {book.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {book.author}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {book.genre}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {book.isbn || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm ${getStockStatusColor(book.stock)}`}>
                          {book.stock}권
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {book.stock === 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            재고없음
                          </span>
                        ) : book.stock <= 3 ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            재고부족
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            정상
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onEditBook(book)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          편집
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            총 {sortedBooks.length}권의 도서
          </div>
        </div>
      </div>
    </>
  );
}
