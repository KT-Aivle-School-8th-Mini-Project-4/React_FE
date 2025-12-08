import { useState } from 'react';
import { User, Book, Purchase } from '../App';
import { X, Key, BookOpen, Edit2, Trash2, CheckCircle, AlertCircle, Package, Calendar, ShoppingCart, Plus, Minus, Search, ArrowUpDown, ChevronDown, Star, Clock, BookMarked, FileText, Hash, Building2 } from 'lucide-react';

interface MyPageProps {
  user: User;
  books: Book[];
  purchases: Purchase[];
  allBooks: Book[];
  onClose: () => void;
  onPasswordChange: (newPassword: string) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onUpdateBook?: (book: Book) => void;
}

export function MyPage({ user, books, purchases, allBooks, onClose, onPasswordChange, onEditBook, onDeleteBook, onUpdateBook }: MyPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'year' | 'stock'>('stock');
  const [expandedBookIds, setExpandedBookIds] = useState<Set<string>>(new Set());
  const [selectedBuyer, setSelectedBuyer] = useState<{ userId: string; bookId: string } | null>(null);

  const toggleBookExpand = (bookId: string) => {
    setExpandedBookIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (currentPassword !== user.password) {
      setPasswordError('현재 비밀번호가 일치하지 않니다.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    onPasswordChange(newPassword);
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordSuccess(false);
    }, 3000);
  };

  const handleDelete = (bookId: string, bookTitle: string) => {
    if (confirm(`"${bookTitle}"을(를) 삭제하시겠습니까?`)) {
      onDeleteBook(bookId);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get user's purchases
  const userPurchases = purchases.filter(p => p.userId === user.id);

  // Group purchases by bookId and get quantity
  const groupedPurchases = userPurchases.reduce((acc, purchase) => {
    if (!acc[purchase.bookId]) {
      acc[purchase.bookId] = {
        bookId: purchase.bookId,
        quantity: 0,
        latestPurchaseDate: purchase.purchaseDate
      };
    }
    acc[purchase.bookId].quantity += 1;
    if (new Date(purchase.purchaseDate) > new Date(acc[purchase.bookId].latestPurchaseDate)) {
      acc[purchase.bookId].latestPurchaseDate = purchase.purchaseDate;
    }
    return acc;
  }, {} as Record<string, { bookId: string; quantity: number; latestPurchaseDate: Date }>);

  // Get purchased books with details and quantity
  const purchasedBooksDetails = Object.values(groupedPurchases).map(({ bookId, quantity, latestPurchaseDate }) => {
    const book = allBooks.find(b => b.id === bookId);
    return {
      book,
      quantity,
      latestPurchaseDate
    };
  }).filter(item => item.book !== undefined)
    .sort((a, b) => new Date(b.latestPurchaseDate).getTime() - new Date(a.latestPurchaseDate).getTime());

  // Calculate unique book types sold (for admin)
  const uniqueBooksSold = user.role === 'admin' 
    ? new Set(purchases.map(p => p.bookId)).size 
    : 0;

  // Group admin sales by bookId for recent sales section
  const groupedSales = user.role === 'admin' ? purchases.reduce((acc, purchase) => {
    if (!acc[purchase.bookId]) {
      acc[purchase.bookId] = {
        bookId: purchase.bookId,
        count: 0,
        latestPurchaseDate: purchase.purchaseDate,
        buyerCounts: new Map<string, number>()
      };
    }
    acc[purchase.bookId].count += 1;
    
    // Count purchases per buyer
    const currentCount = acc[purchase.bookId].buyerCounts.get(purchase.userId) || 0;
    acc[purchase.bookId].buyerCounts.set(purchase.userId, currentCount + 1);
    
    if (new Date(purchase.purchaseDate) > new Date(acc[purchase.bookId].latestPurchaseDate)) {
      acc[purchase.bookId].latestPurchaseDate = purchase.purchaseDate;
    }
    return acc;
  }, {} as Record<string, { bookId: string; count: number; latestPurchaseDate: Date; buyerCounts: Map<string, number> }>) : {};

  // Filter and sort books for management section
  const filteredAndSortedBooks = books
    .filter(book => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.publishedYear - a.publishedYear;
        case 'stock':
          return a.stock - b.stock; // 재고 적은 순 (오름차순)
        default:
          return 0;
      }
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-gray-900">마이페이지</h2>
              <p className="text-sm text-gray-500">
                {user.role === 'admin' ? '관리자' : '일반 회원'} • {user.id}
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
          <div className="space-y-8">
            {/* Password Change Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-900">비밀번호 변경</h3>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    비밀번호가 성공적으로 변경되었습니다.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  비밀번호 변경
                </button>
              </form>
            </div>

            {/* Purchased Books Section - For non-admin users */}
            {user.role !== 'admin' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <h3 className="text-gray-900">구매한 도서</h3>
                  <span className="text-sm text-gray-500">({userPurchases.length}권)</span>
                </div>

                {purchasedBooksDetails.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">구매한 도서가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchasedBooksDetails.map(({ book, quantity, latestPurchaseDate }) => {
                      if (!book) return null;
                      
                      return (
                        <div
                          key={book.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-4">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="text-gray-900 mb-1">{book.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  구매일: {formatDate(latestPurchaseDate)}
                                </div>
                                <span>수량: {quantity}권</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                구매 완료
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sales Statistics - For admin users */}
            {user.role === 'admin' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <h3 className="text-gray-900">판매 현황</h3>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">총 판매</p>
                    <p className="text-2xl text-blue-900">{purchases.length}건</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 mb-1">판매된 책 종류</p>
                    <p className="text-2xl text-green-900">{uniqueBooksSold}종</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 mb-1">총 재고</p>
                    <p className="text-2xl text-purple-900">
                      {allBooks.reduce((sum, book) => sum + book.stock, 0)}권
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 mb-1">총 재고 종류</p>
                    <p className="text-2xl text-orange-900">{allBooks.length}종</p>
                  </div>
                </div>

                {/* Recent Sales */}
                <div className="mb-4">
                  <h4 className="text-sm text-gray-700 mb-3">최근 판매 내역</h4>
                  {purchases.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">판매 내역이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.values(groupedSales)
                        .sort((a, b) => new Date(b.latestPurchaseDate).getTime() - new Date(a.latestPurchaseDate).getTime())
                        .slice(0, 10)
                        .map((sale) => {
                          const book = allBooks.find(b => b.id === sale.bookId);
                          if (!book) return null;
                          
                          // Get unique buyers
                          const uniqueBuyers = Array.from(sale.buyerCounts.keys());

                          return (
                            <div
                              key={sale.bookId}
                              className="bg-white border border-gray-200 rounded-lg p-3 text-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="text-gray-900 mb-1">{book.title}</p>
                                  <p className="text-xs text-gray-500">
                                    총 판매 수량: {sale.count}건
                                  </p>
                                </div>
                                <div className="text-right ml-3">
                                  <p className="text-xs text-gray-500">
                                    {formatDate(sale.latestPurchaseDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {uniqueBuyers.slice(0, 10).map((buyer) => {
                                  const count = sale.buyerCounts.get(buyer) || 0;
                                  const isSelected = selectedBuyer?.userId === buyer && selectedBuyer?.bookId === sale.bookId;
                                  
                                  return (
                                    <button
                                      key={buyer}
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedBuyer(null);
                                        } else {
                                          setSelectedBuyer({ userId: buyer, bookId: sale.bookId });
                                        }
                                      }}
                                      className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                                        isSelected 
                                          ? 'bg-blue-600 text-white' 
                                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                      }`}
                                      title={`${buyer}: ${count}권 구매`}
                                    >
                                      {buyer}
                                      {isSelected && ` (${count}권)`}
                                    </button>
                                  );
                                })}
                                {uniqueBuyers.length > 10 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{uniqueBuyers.length - 10}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Managed Books Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">
                  {user.role === 'admin' ? '전체 도서 관리' : '내가 등록한 도서'}
                </h3>
                <span className="text-sm text-gray-500">({books.length}권)</span>
              </div>

              {/* Search and Sort Controls */}
              {books.length > 0 && (
                <div className="flex gap-3 mb-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="제목, 저자, 장르로 검색..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'year' | 'stock')}
                      className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                    >
                      <option value="title">제목순</option>
                      <option value="author">저자순</option>
                      <option value="year">출판연도순</option>
                      <option value="stock">재고순</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {books.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {user.role === 'admin' ? '등록된 도서가 없습니다.' : '등록한 도서가 없습니다.'}
                  </p>
                </div>
              ) : filteredAndSortedBooks.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">검색 결과가 없습니다.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    검색 초기화
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAndSortedBooks.map((book) => {
                    const isExpanded = expandedBookIds.has(book.id);
                    const avgRating = book.ratings.length > 0
                      ? book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length
                      : 0;

                    return (
                      <div
                        key={book.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Main Book Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Book Cover */}
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0"
                            />
                            
                            {/* Title */}
                            <div className="w-40 flex-shrink-0">
                              <h4 className="text-sm text-gray-900 line-clamp-2">{book.title}</h4>
                            </div>
                            
                            {/* Author */}
                            <div className="w-28 flex-shrink-0">
                              <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
                            </div>
                            
                            {/* Genre */}
                            <div className="w-20 flex-shrink-0">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs inline-block">
                                {book.genre}
                              </span>
                            </div>
                            
                            {/* Year */}
                            <div className="w-16 flex-shrink-0">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs inline-block">
                                {book.publishedYear}
                              </span>
                            </div>
                            
                            {/* Stock Controls */}
                            <div className="w-32 flex-shrink-0">
                              {user.role === 'admin' && onUpdateBook ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      if (book.stock > 0) {
                                        onUpdateBook({ ...book, stock: book.stock - 1 });
                                      }
                                    }}
                                    disabled={book.stock <= 0}
                                    className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="재고 감소"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <div className="px-2 py-0.5 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700 font-medium min-w-[2.5rem] text-center">
                                    {book.stock}
                                  </div>
                                  <button
                                    onClick={() => onUpdateBook({ ...book, stock: book.stock + 1 })}
                                    className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                    title="재고 증가"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Package className="w-3 h-3" />
                                  <span>{book.stock}권</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                              <button
                                onClick={() => toggleBookExpand(book.id)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title={isExpanded ? "접기" : "상세정보"}
                              >
                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              <button
                                onClick={() => onEditBook(book)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="편집"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {user.role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(book.id, book.title)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              {/* Basic Info */}
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <Building2 className="w-4 h-4 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">출판사</p>
                                    <p className="text-sm text-gray-900">{book.publisher}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Hash className="w-4 h-4 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">ISBN</p>
                                    <p className="text-sm text-gray-900 font-mono">{book.isbn}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">평점</p>
                                    <p className="text-sm text-gray-900">
                                      {avgRating > 0 ? `${avgRating.toFixed(1)}점` : '평가 없음'} 
                                      {book.ratings.length > 0 && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({book.ratings.length}개)
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">설명</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {book.description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Reviews Section */}
                            {book.ratings.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <BookMarked className="w-4 h-4 text-purple-600" />
                                  <h5 className="text-sm text-gray-900">리뷰 ({book.ratings.length})</h5>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {book.ratings.map((rating, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`w-3 h-3 ${
                                                i < rating.rating
                                                  ? 'fill-yellow-400 text-yellow-400'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                          {rating.userId}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">{rating.review}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* History Section */}
                            {book.history && book.history.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Clock className="w-4 h-4 text-indigo-600" />
                                  <h5 className="text-sm text-gray-900">변경 이력 ({book.history.length})</h5>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {book.history.slice(0, 5).map((entry, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-indigo-600">{entry.action}</span>
                                        <span className="text-xs text-gray-500">
                                          {formatDate(entry.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600">{entry.userId}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}