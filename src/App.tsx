import { useState, useEffect } from 'react';
import { BookList } from './components/BookList';
import { AddBookDialog } from './components/AddBookDialog';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { MyPage } from './components/MyPage';
import { BookDetailDialog } from './components/BookDetailDialog';
import { BookInventoryDialog } from './components/BookInventoryDialog';
import { Cart, CartItem } from './components/Cart';
import { Plus, Menu, X, Edit2, Trash2, Search, LogOut, User as UserIcon, Package, ShoppingCart } from 'lucide-react';
import ktAivleLogo from 'figma:asset/e5ac75b360c5f16e2a9a70e851e77229ca22f463.png';
import { initialBooks } from './data/initialBooks';

export interface Rating {
  userId: string;
  rating: number;
  timestamp: Date;
}

export interface Review {
  id: string;
  userId: string;
  comment: string;
  timestamp: Date;
}

export interface Purchase {
  id: string;
  bookId: string;
  userId: string;
  purchaseDate: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  isbn?: string;
  createdBy: string; // User ID who created this book
  createdAt: Date;
  ratings: Rating[]; // Array of ratings
  reviews: Review[]; // Array of reviews
  stock: number; // Total stock count
}

export interface EditRecord {
  id: string;
  bookId: string;
  timestamp: Date;
  before: Book;
  after: Book;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface DeleteRecord {
  id: string;
  book: Book;
  timestamp: Date;
}

export interface User {
  id: string;
  password: string;
  role: 'admin' | 'user';
}

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        console.error('Error parsing saved users:', e);
      }
    }
    return [
      { id: 'ADMIN', password: '1234', role: 'admin' },
      { id: 'KT', password: '1234', role: 'user' }
    ];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Initialize purchases from localStorage or use empty array
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const savedPurchases = localStorage.getItem('purchases');
    if (savedPurchases) {
      try {
        const parsed = JSON.parse(savedPurchases);
        return parsed.map((purchase: any) => ({
          ...purchase,
          purchaseDate: new Date(purchase.purchaseDate)
        }));
      } catch (e) {
        console.error('Error parsing saved purchases:', e);
      }
    }
    return [];
  });
  
  // Initialize books from localStorage or use default data
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks);
        // Convert date strings back to Date objects
        return parsed.map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt),
          ratings: book.ratings?.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })) || [],
          reviews: book.reviews?.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })) || [],
          stock: book.stock || 0
        }));
      } catch (e) {
        console.error('Error parsing saved books:', e);
      }
    }
    
    // Default initial data - Load from initialBooks
    return initialBooks.map(book => ({
      ...book,
      ratings: [],
      reviews: []
    }));
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionType, setSelectionType] = useState<'edit' | 'delete' | null>(null);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Get the current selected book from books array (always fresh data)
  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) || null : null;
  
  // History
  const [editHistory, setEditHistory] = useState<EditRecord[]>([]);
  const [deleteHistory, setDeleteHistory] = useState<DeleteRecord[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'author'>('title');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 2 rows x 5 columns

  const isAdmin = currentUser?.role === 'admin';

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  // Save purchases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }, [purchases]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSelectionMode(false);
    setSelectedBookIds([]);
  };

  const handlePasswordChange = (newPassword: string) => {
    if (currentUser) {
      setUsers(users.map(u => 
        u.id === currentUser.id ? { ...u, password: newPassword } : u
      ));
      setCurrentUser({ ...currentUser, password: newPassword });
    }
  };

  const handleAddBook = (book: Omit<Book, 'id' | 'createdBy' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      createdAt: new Date(),
      ratings: [],
      reviews: [],
      stock: 0
    };
    setBooks([...books, newBook]);
    setIsDialogOpen(false);
  };

  const handleEditBook = (book: Book) => {
    const oldBook = books.find(b => b.id === book.id);
    if (oldBook) {
      // Track changes
      const changes: { field: string; oldValue: string; newValue: string }[] = [];
      
      if (oldBook.title !== book.title) {
        changes.push({ field: '제목', oldValue: oldBook.title, newValue: book.title });
      }
      if (oldBook.author !== book.author) {
        changes.push({ field: '저자', oldValue: oldBook.author, newValue: book.author });
      }
      if (oldBook.genre !== book.genre) {
        changes.push({ field: '장르', oldValue: oldBook.genre, newValue: book.genre });
      }
      if (oldBook.description !== book.description) {
        changes.push({ field: '설명', oldValue: oldBook.description, newValue: book.description });
      }
      if (oldBook.publishedYear !== book.publishedYear) {
        changes.push({ field: '출판연도', oldValue: oldBook.publishedYear.toString(), newValue: book.publishedYear.toString() });
      }
      if (oldBook.isbn !== book.isbn) {
        changes.push({ field: 'ISBN', oldValue: oldBook.isbn || '', newValue: book.isbn || '' });
      }

      if (changes.length > 0) {
        const editRecord: EditRecord = {
          id: Date.now().toString(),
          bookId: book.id,
          timestamp: new Date(),
          before: oldBook,
          after: book,
          changes
        };
        setEditHistory([editRecord, ...editHistory]);
      }
    }

    setBooks(books.map(b => b.id === book.id ? book : b));
    setEditingBook(null);
    setIsDialogOpen(false);
    setSelectedBookIds([]);
    setIsSelectionMode(false);
    setSelectionType(null);
  };

  const handleDeleteBook = (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      const deleteRecord: DeleteRecord = {
        id: Date.now().toString() + id,
        book,
        timestamp: new Date()
      };
      setDeleteHistory([deleteRecord, ...deleteHistory]);
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBookIds.length === 0) return;
    if (confirm(`선택한 ${selectedBookIds.length}권의 도서를 삭제하시겠습니까?`)) {
      const deletedBooks = books.filter(b => selectedBookIds.includes(b.id));
      const deleteRecords: DeleteRecord[] = deletedBooks.map(book => ({
        id: Date.now().toString() + book.id,
        book,
        timestamp: new Date()
      }));
      
      setDeleteHistory([...deleteRecords, ...deleteHistory]);
      setBooks(books.filter(b => !selectedBookIds.includes(b.id)));
      setSelectedBookIds([]);
      setIsSelectionMode(false);
      setSelectionType(null);
    }
  };

  const handleBulkEdit = () => {
    if (selectedBookIds.length === 0) return;
    if (selectedBookIds.length === 1) {
      const book = books.find(b => b.id === selectedBookIds[0]);
      if (book) {
        setEditingBook(book);
        setIsDialogOpen(true);
      }
    } else {
      alert('편집은 한 번에 하나의 도서만 선택해주세요.');
    }
  };

  const handleSelectBook = (id: string) => {
    setSelectedBookIds(prev => 
      prev.includes(id) ? prev.filter(bookId => bookId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentBooks = getCurrentPageBooks();
    const currentBookIds = currentBooks.map(b => b.id);
    
    if (currentBookIds.every(id => selectedBookIds.includes(id))) {
      setSelectedBookIds(selectedBookIds.filter(id => !currentBookIds.includes(id)));
    } else {
      const newSelections = [...selectedBookIds];
      currentBookIds.forEach(id => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      setSelectedBookIds(newSelections);
    }
  };

  const handleRestoreBook = (deleteRecord: DeleteRecord) => {
    setBooks([...books, deleteRecord.book]);
    setDeleteHistory(deleteHistory.filter(d => d.id !== deleteRecord.id));
  };

  const handleBookClick = (book: Book) => {
    if (!isSelectionMode) {
      setSelectedBookId(book.id);
    }
  };

  const openAddDialog = () => {
    setEditingBook(null);
    setIsDialogOpen(true);
  };

  const enterSelectionMode = (mode: 'edit' | 'delete') => {
    setIsSelectionMode(true);
    setSelectionType(mode);
    setSelectedBookIds([]);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectionType(null);
    setSelectedBookIds([]);
  };

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === '전체' || book.genre === selectedGenre;
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'year') {
        return b.publishedYear - a.publishedYear;
      } else {
        return a.author.localeCompare(b.author);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const getCurrentPageBooks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle book purchase
  const handlePurchaseBook = (bookId: string, quantity: number = 1) => {
    if (!currentUser) return;

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Check available stock
    if (book.stock < quantity) {
      alert(`재고가 부족합니다. (현재 재고: ${book.stock}권)`);
      return;
    }

    // Create purchases
    const newPurchases: Purchase[] = [];
    for (let i = 0; i < quantity; i++) {
      newPurchases.push({
        id: `${Date.now()}_${i}`,
        bookId,
        userId: currentUser.id,
        purchaseDate: new Date()
      });
    }

    const updatedPurchases = [...purchases, ...newPurchases];
    setPurchases(updatedPurchases);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));

    // Decrease stock
    const updatedBooks = books.map(b =>
      b.id === bookId ? { ...b, stock: b.stock - quantity } : b
    );
    setBooks(updatedBooks);

    alert(`${quantity}권 구매가 완료되었습니다.`);
  };

  // Handle purchase cancellation
  const handleCancelPurchase = (purchaseIds: string[]) => {
    if (!currentUser) return;
    if (purchaseIds.length === 0) return;

    // Get the first purchase to know which book
    const firstPurchase = purchases.find(p => p.id === purchaseIds[0]);
    if (!firstPurchase) return;

    // Remove purchases
    const updatedPurchases = purchases.filter(p => !purchaseIds.includes(p.id));
    setPurchases(updatedPurchases);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));

    // Increase stock back
    const updatedBooks = books.map(b =>
      b.id === firstPurchase.bookId ? { ...b, stock: b.stock + purchaseIds.length } : b
    );
    setBooks(updatedBooks);

    alert(`${purchaseIds.length}권 구매가 취소되었습니다. 재고가 복구되었습니다.`);
  };

  // Handle refresh to home
  const handleRefreshToHome = () => {
    window.location.reload();
  };

  // Show login screen if not logged in
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200 h-[65px]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Left Section - Logo and Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex items-center gap-2">
                <button onClick={handleRefreshToHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img src={ktAivleLogo} alt="KT Aivle School Logo" className="h-8 cursor-pointer" />
                </button>
                <div>
                  <h1 className="text-gray-900 whitespace-nowrap">AI 도서 관리</h1>
                  <p className="text-xs text-gray-600">
                    ID : {currentUser.id} ({currentUser.role === 'admin' ? '관리자 계정' : '일반 계정'})
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="도서 검색 (제목, 저자, 내용)"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <>
                  <button
                    onClick={exitSelectionMode}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">취소</span>
                  </button>
                  {selectedBookIds.length > 0 && (
                    <>
                      {selectionType === 'edit' && (
                        <button
                          onClick={handleBulkEdit}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>편집 ({selectedBookIds.length})</span>
                        </button>
                      )}
                      {selectionType === 'delete' && (
                        <button
                          onClick={handleBulkDelete}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>삭제 ({selectedBookIds.length})</span>
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setIsInventoryOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                        title="도서 현황"
                      >
                        <Package className="w-4 h-4" />
                        <span className="hidden lg:inline">도서 현황</span>
                      </button>
                      <button
                        onClick={() => enterSelectionMode('edit')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        title="편집"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden lg:inline">편집</span>
                      </button>
                      <button
                        onClick={() => enterSelectionMode('delete')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden lg:inline">삭제</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={openAddDialog}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden lg:inline">도서 추가</span>
                  </button>
                  <button
                    onClick={() => setIsMyPageOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    title="마이페이지"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">마이페이지</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">로그아웃</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Overlay when opened */}
      <Sidebar
        books={books}
        purchases={purchases}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        selectedGenre={selectedGenre}
        sortBy={sortBy}
        onGenreChange={setSelectedGenre}
        onSortChange={setSortBy}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className={`px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-gray-700 mb-1">
                {selectedGenre === '전체' ? '전체 도서' : `${selectedGenre} 도서`}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredBooks.length}권의 도서
                {isSelectionMode && selectedBookIds.length > 0 && ` (${selectedBookIds.length}권 선택됨)`}
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-600">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'year' | 'author')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="title">제목순</option>
                <option value="year">최신순</option>
                <option value="author">저자명순</option>
              </select>
            </div>
          </div>
          {isSelectionMode && getCurrentPageBooks().length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {getCurrentPageBooks().every(b => selectedBookIds.includes(b.id)) ? '전체 해제' : '전체 선택'}
            </button>
          )}
        </div>
        
        <BookList 
          books={getCurrentPageBooks()} 
          purchases={purchases}
          selectedBookIds={selectedBookIds}
          onSelectBook={handleSelectBook}
          onBookClick={handleBookClick}
          isSelectionMode={isSelectionMode}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <AddBookDialog
          book={editingBook}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingBook(null);
          }}
          onSave={editingBook ? handleEditBook : handleAddBook}
        />
      )}

      {/* My Page */}
      {isMyPageOpen && currentUser && (
        <MyPage
          user={currentUser}
          books={isAdmin ? books : books.filter(b => b.createdBy === currentUser.id)}
          purchases={purchases}
          allBooks={books}
          onClose={() => setIsMyPageOpen(false)}
          onPasswordChange={handlePasswordChange}
          onEditBook={(book) => {
            setEditingBook(book);
            setIsDialogOpen(true);
            setIsMyPageOpen(false);
          }}
          onDeleteBook={handleDeleteBook}
          onUpdateBook={(updatedBook) => {
            setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
          }}
        />
      )}

      {/* Book Detail Dialog */}
      {selectedBook && currentUser && (
        <BookDetailDialog
          book={selectedBook}
          currentUser={currentUser}
          purchases={purchases}
          onClose={() => setSelectedBookId(null)}
          onUpdateBook={(updatedBook) => {
            setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
            setSelectedBookId(updatedBook.id);
          }}
          onPurchaseBook={handlePurchaseBook}
          onCancelPurchase={handleCancelPurchase}
        />
      )}

      {/* Book Inventory Dialog */}
      {isInventoryOpen && currentUser && isAdmin && (
        <BookInventoryDialog
          books={books}
          purchases={purchases}
          onClose={() => setIsInventoryOpen(false)}
          onEditBook={(book) => {
            setEditingBook(book);
            setIsDialogOpen(true);
            setIsInventoryOpen(false);
          }}
        />
      )}
    </div>
  );
}