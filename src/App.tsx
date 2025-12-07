import { useState, useEffect } from 'react';
import { BookList } from './components/BookList';
import { AddBookDialog } from './components/AddBookDialog';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { MyPage } from './components/MyPage';
import { BookDetailDialog } from './components/BookDetailDialog';
import { BookInventoryDialog } from './components/BookInventoryDialog';
import { Plus, Menu, X, Edit2, Trash2, Search, LogOut, User as UserIcon, Package } from 'lucide-react';
import ktAivleLogo from 'figma:asset/e5ac75b360c5f16e2a9a70e851e77229ca22f463.png';
//import { initialBooks } from './data/initialBooks';

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

// export interface Loan {
//   id: string;
//   bookId: string;
//   userId: string;
//   loanDate: Date;
//   dueDate: Date;
//   returnDate?: Date;
//   extended: boolean; // Whether the loan has been extended
// }

export interface Loan {
    id: string;
    bookId: string;
    userId: string;
    loanDate: string;
    dueDate: string;
    returnDate?: string;
    extended?: boolean;
    extensionCount?: number;
}


export interface Book {
  id: string;
  title: string;
  // author: string;
  category: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  // isbn?: string;
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
  
  // Initialize loans from localStorage or use empty array
  // const [loans, setLoans] = useState<Loan[]>(() => {
  //   const savedLoans = localStorage.getItem('loans');
  //   if (savedLoans) {
  //     try {
  //       const parsed = JSON.parse(savedLoans);
  //       return parsed.map((loan: any) => ({
  //         ...loan,
  //         loanDate: new Date(loan.loanDate),
  //         dueDate: new Date(loan.dueDate),
  //         returnDate: loan.returnDate ? new Date(loan.returnDate) : undefined
  //       }));
  //     } catch (e) {
  //       console.error('Error parsing saved loans:', e);
  //     }
  //   }
  //   return [];
  // });

  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
     const fetchLoans = async () => {
       try {
          const res = await fetch("http://localhost:8080/api/loans");
          const data = await res.json();
          setLoans(data);
       } catch (error) {
         console.error("Failed to fetch loans:", error);
       }
     };

     fetchLoans();
  }, []);





    // Initialize books
  const [books, setBooks] = useState<Book[]>([]);

    const fetchBooks = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/book");
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };

     useEffect(() => {
        fetchBooks();
        }, []);

    // mock data로 첫 화면 테스트
    // useEffect(() => {
    //     // 🔥 1) 실제 fetchBooks 임시 비활성화
    //     // fetchBooks();
    //
    //     // 🔥 2) mock data 삽입
    //     const mockBooks: Book[] = [
    //         {
    //             id: "1",
    //             title: "모던 자바스크립트 Deep Dive",
    //             author: "이웅모",
    //             genre: "프로그래밍",
    //             publishedYear: 2020,
    //             isbn: "123456789",
    //             description: "자바스크립트의 원리를 깊게 설명한 책",
    //             coverImage: "https://picsum.photos/200/300",
    //             stock: 5,
    //             ratings: [{ userId: "user1", rating: 5 }],
    //             reviews: [],
    //             createdAt: new Date(),
    //             createdBy: "admin"
    //         },
    //         {
    //             id: "2",
    //             title: "Clean Code",
    //             author: "Robert C. Martin",
    //             genre: "프로그래밍",
    //             publishedYear: 2008,
    //             isbn: "987654321",
    //             description: "좋은 코드 작성의 원칙을 설명한 고전 명서",
    //             coverImage: "https://picsum.photos/200/301",
    //             stock: 2,
    //             ratings: [],
    //             reviews: [],
    //             createdAt: new Date(),
    //             createdBy: "admin"
    //         }
    //     ];
    //
    //     setBooks(mockBooks);
    // }, []);


    // Default initial data - Load from initialBooks
  //   return initialBooks.map(book => ({
  //     ...book,
  //     ratings: [],
  //     reviews: []
  //   }));
  // });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionType, setSelectionType] = useState<'edit' | 'delete' | null>(null);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // History
  const [editHistory, setEditHistory] = useState<EditRecord[]>([]);
  const [deleteHistory, setDeleteHistory] = useState<DeleteRecord[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  // const [sortBy, setSortBy] = useState<'title' | 'year' | 'author'>('title');
  const [sortBy, setSortBy] = useState<'title' | 'year'>('title');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 2 rows x 5 columns

  const isAdmin = currentUser?.role === 'admin';

  // Save books to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem('books', JSON.stringify(books));
  // }, [books]);

  // Save loans to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem('loans', JSON.stringify(loans));
  // }, [loans]);

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

//삭제?
//   const handleAddBook = (book: Omit<Book, 'id' | 'createdBy' | 'createdAt'>) => {
//     if (!currentUser) return;
//
//     const newBook: Book = {
//       ...book,
//       id: Date.now().toString(),
//       createdBy: currentUser.id,
//       createdAt: new Date(),
//       ratings: [],
//       reviews: [],
//       stock: 0
//     };
//     setBooks([...books, newBook]);
//     setIsDialogOpen(false);
//   };

  const handleAddBook = (savedBook: Book) => {
     setBooks(prev => [...prev, savedBook]);
     setIsDialogOpen(false);
  };


//삭제?
  const handleEditBook = (book: Book) => {
    const oldBook = books.find(b => b.id === book.id);
    if (oldBook) {
      // Track changes
      const changes: { field: string; oldValue: string; newValue: string }[] = [];
      
      if (oldBook.title !== book.title) {
        changes.push({ field: '제목', oldValue: oldBook.title, newValue: book.title });
      }
      // if (oldBook.author !== book.author) {
      //   changes.push({ field: '저자', oldValue: oldBook.author, newValue: book.author });
      // }
      if (oldBook.category !== book.category) {
        changes.push({ field: '분류', oldValue: oldBook.category, newValue: book.category });
      }
      if (oldBook.description !== book.description) {
        changes.push({ field: '내용', oldValue: oldBook.description, newValue: book.description });
      }
      if (oldBook.publishedYear !== book.publishedYear) {
        changes.push({ field: '출판연도', oldValue: oldBook.publishedYear.toString(), newValue: book.publishedYear.toString() });
      }
      // if (oldBook.isbn !== book.isbn) {
      //   changes.push({ field: 'ISBN', oldValue: oldBook.isbn || '', newValue: book.isbn || '' });
      // }

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
//삭제?
    const handleDeleteBook = (id: string) => {
        // DB 삭제는 이미 MyPage에서 실행됨 → 여기선 로컬 state만 수정
        setBooks(prev => prev.filter(b => b.id !== id));
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
      setSelectedBook(book);
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
        // book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === '전체' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'year') {
        return b.publishedYear - a.publishedYear;
      // } else {
      //   return a.author.localeCompare(b.author);
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

  // Check if user has overdue loans
  const hasOverdueLoans = (userId: string) => {
    const now = new Date();
    return loans.some(loan => 
      loan.userId === userId &&
      !loan.returnDate &&
      loan.dueDate < now
    );
  };

  // Handle book loan
  // const handleLoanBook = (bookId: string) => {
  //   if (!currentUser) return;
  //
  //   // Check for overdue loans
  //   if (hasOverdueLoans(currentUser.id)) {
  //     alert('연체된 도서가 있어 대출이 불가능합니다. 먼저 반납해주세요.');
  //     return;
  //   }
  //
  //   const book = books.find(b => b.id === bookId);
  //   if (!book) return;
  //
  //   // Check available stock
  //   const currentLoans = loans.filter(l => l.bookId === bookId && !l.returnDate);
  //   const availableStock = book.stock - currentLoans.length;
  //
  //   if (availableStock <= 0) {
  //     alert('재고가 부족합니다.');
  //     return;
  //   }
  //
  //   // Create loan
  //   const loanDate = new Date();
  //   const dueDate = new Date();
  //   dueDate.setDate(dueDate.getDate() + 7); // 7 days loan period
  //
  //   const newLoan: Loan = {
  //     id: Date.now().toString(),
  //     bookId,
  //     userId: currentUser.id,
  //     loanDate,
  //     dueDate,
  //     extended: false
  //   };
  //
  //   const updatedLoans = [...loans, newLoan];
  //   setLoans(updatedLoans);
  //   localStorage.setItem('loans', JSON.stringify(updatedLoans));
  //
  //   alert('대출이 완료되었습니다.');
  // };
const handleLoanBook = async (bookId: string) => {
    if (!currentUser) return;

    try {
        const res = await fetch("http://localhost:8080/api/loans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bookId,
                userId: currentUser.id
            }),
        });

        if (!res.ok) {
            const msg = await res.text();
            alert(msg || "대출 요청 실패");
            return;
        }

        // 백엔드가 최신 loan 목록을 반환하는 경우
        const updatedLoans = await res.json();
        setLoans(updatedLoans);

        alert("대출이 완료되었습니다.");
    } catch (error) {
        console.error("Loan failed:", error);
        alert("대출 처리 중 오류가 발생했습니다.");
    }
};


// Handle book return (loan cancellation)
  const handleReturnBook = (loanId: string) => {
    if (!currentUser) return;

    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    // Mark loan as returned
    const updatedLoans = loans.map(l => 
      l.id === loanId 
        ? { ...l, returnDate: new Date() }
        : l
    );

    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));

    alert('대출이 취소되었습니다.');
  };

  // Handle loan extension
  const handleExtendLoan = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    if (loan.extended) {
      alert('이미 연장된 대출입니다.');
      return;
    }

    // Extend due date by 7 days
    const newDueDate = new Date(loan.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    setLoans(loans.map(l => 
      l.id === loanId 
        ? { ...l, dueDate: newDueDate, extended: true } 
        : l
    ));
    alert('대출이 연장되었습니다.');
  };

  // Show login screen if not logged in
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Left Section - Logo and Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex items-center gap-2">
                <img src={ktAivleLogo} alt="KT Aivle School Logo" className="h-8" />
                <h1 className="text-gray-900 whitespace-nowrap">AI 도서 관리</h1>
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
        loans={loans}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory()}
        onSortChange={setSortBy}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className={`px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-gray-700 mb-1">
                {selectedCategory === '전체' ? '전체 도서' : `${selectedCategory} 도서`}
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
                // onChange={(e) => setSortBy(e.target.value as 'title' | 'year' | 'author')}
                onChange={(e) => setSortBy(e.target.value as 'title' | 'year')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="title">제목순</option>
                <option value="year">최신순</option>
                {/*<option value="author">저자명순</option>*/}
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
          loans={loans}
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
          loans={loans}
          allBooks={books}
          onClose={() => setIsMyPageOpen(false)}
          onPasswordChange={handlePasswordChange}
          onEditBook={(book) => {
            setEditingBook(book);
            setIsDialogOpen(true);
            setIsMyPageOpen(false);
          }}
          onDeleteBook={handleDeleteBook}
          onReturnBook={handleReturnBook}
          onExtendLoan={handleExtendLoan}
        />
      )}

      {/* Book Detail Dialog */}
      {selectedBook && currentUser && (
        <BookDetailDialog
          book={selectedBook}
          currentUser={currentUser}
          loans={loans}
          onClose={() => setSelectedBook(null)}
          onUpdateBook={(updatedBook) => {
            setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
            setSelectedBook(updatedBook);
          }}
          onLoanBook={handleLoanBook}
          onReturnBook={handleReturnBook}
          hasOverdueLoans={hasOverdueLoans(currentUser.id)}
        />
      )}

      {/* Book Inventory Dialog */}
      {isInventoryOpen && currentUser && isAdmin && (
        <BookInventoryDialog
          books={books}
          loans={loans}
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