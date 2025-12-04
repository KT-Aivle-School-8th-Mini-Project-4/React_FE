import { useState } from 'react';
import { BookList } from './components/BookList';
import { AddBookDialog } from './components/AddBookDialog';
import { Sidebar } from './components/Sidebar';
import { HistoryDialog } from './components/HistoryDialog';
import { LoginScreen } from './components/LoginScreen';
import { MyPage } from './components/MyPage';
import { BookDetailDialog } from './components/BookDetailDialog';
import { Plus, Menu, X, Edit2, Trash2, Search, History, LogOut, User as UserIcon } from 'lucide-react';
import ktAivleLogo from 'figma:asset/e5ac75b360c5f16e2a9a70e851e77229ca22f463.png';

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
  const [users, setUsers] = useState<User[]>([
    { id: 'ADMIN', password: '1234', role: 'admin' },
    { id: 'KT', password: '1234', role: 'user' }
  ]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: '달과 6펜스',
      author: '서머싯 모옴',
      genre: '소설',
      description: '평범한 증권 중개인이 예술가의 꿈을 좇아 모든 것을 버리는 이야기',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      publishedYear: 1919,
      isbn: '978-1234567890',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: '1984',
      author: '조지 오웰',
      genre: 'SF',
      description: '전체주의 사회를 그린 디스토피아 소설',
      coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
      publishedYear: 1949,
      isbn: '978-0987654321',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      title: '해리포터와 마법사의 돌',
      author: 'J.K. 롤링',
      genre: '판타지',
      description: '마법 세계로 초대받은 소년의 모험',
      coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
      publishedYear: 1997,
      isbn: '978-1111111111',
      createdBy: 'KT',
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      title: '코스모스',
      author: '칼 세이건',
      genre: '과학',
      description: '우주와 인류의 역사를 탐험하는 과학 에세이',
      coverImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400',
      publishedYear: 1980,
      isbn: '978-2222222222',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-04')
    },
    {
      id: '5',
      title: '반지의 제왕',
      author: 'J.R.R. 톨킨',
      genre: '판타지',
      description: '중간계를 구하기 위한 장대한 여정',
      coverImage: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400',
      publishedYear: 1954,
      isbn: '978-3333333333',
      createdBy: 'KT',
      createdAt: new Date('2024-01-05')
    },
    {
      id: '6',
      title: '오만과 편견',
      author: '제인 오스틴',
      genre: '로맨스',
      description: '계급과 편견을 넘어선 사랑 이야기',
      coverImage: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400',
      publishedYear: 1813,
      isbn: '978-4444444444',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-06')
    },
    {
      id: '7',
      title: '호밀밭의 파수꾼',
      author: 'J.D. 샐린저',
      genre: '소설',
      description: '청소년의 방황과 성장을 그린 현대 고전',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      publishedYear: 1951,
      isbn: '978-5555555555',
      createdBy: 'KT',
      createdAt: new Date('2024-01-07')
    },
    {
      id: '8',
      title: '셜록 홈즈의 모험',
      author: '아서 코난 도일',
      genre: '미스터리',
      description: '세계 최고의 탐정 셜록 홈즈의 사건들',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      publishedYear: 1892,
      isbn: '978-6666666666',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-08')
    },
    {
      id: '9',
      title: '총, 균, 쇠',
      author: '재레드 다이아몬드',
      genre: '역사',
      description: '인류 문명의 발전 과정을 분석한 역작',
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
      publishedYear: 1997,
      isbn: '978-7777777777',
      createdBy: 'KT',
      createdAt: new Date('2024-01-09')
    },
    {
      id: '10',
      title: '아침의 피크닉',
      author: '온다 리쿠',
      genre: '소설',
      description: '고교생들의 24시간 보행 대회를 그린 청춘 소설',
      coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
      publishedYear: 2004,
      isbn: '978-8888888888',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '11',
      title: '데미안',
      author: '헤르만 헤세',
      genre: '소설',
      description: '한 청년의 정신적 각성과 성장',
      coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
      publishedYear: 1919,
      isbn: '978-9999999999',
      createdBy: 'KT',
      createdAt: new Date('2024-01-11')
    },
    {
      id: '12',
      title: '파운데이션',
      author: '아이작 아시모프',
      genre: 'SF',
      description: '은하 제국의 흥망성쇠를 다룬 SF 대작',
      coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
      publishedYear: 1951,
      isbn: '978-1010101010',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '13',
      title: '나미야 잡화점의 기적',
      author: '히가시노 게이고',
      genre: '미스터리',
      description: '시간을 넘나드는 고민 상담 편지',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      publishedYear: 2012,
      isbn: '978-1111222222',
      createdBy: 'KT',
      createdAt: new Date('2024-01-13')
    },
    {
      id: '14',
      title: '어린 왕자',
      author: '생텍쥐페리',
      genre: '소설',
      description: '어른들을 위한 동화',
      coverImage: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400',
      publishedYear: 1943,
      isbn: '978-1212121212',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-14')
    },
    {
      id: '15',
      title: '사피엔스',
      author: '유발 하라리',
      genre: '역사',
      description: '인류의 역사와 미래에 대한 통찰',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
      publishedYear: 2011,
      isbn: '978-1313131313',
      createdBy: 'KT',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '16',
      title: '이방인',
      author: '알베르 카뮈',
      genre: '소설',
      description: '부조리한 세계 속 인간의 실존',
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      publishedYear: 1942,
      isbn: '978-1414141414',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '17',
      title: '아몬드',
      author: '손원평',
      genre: '소설',
      description: '감정을 느끼지 못하는 소년의 성장 이야기',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      publishedYear: 2017,
      isbn: '978-1515151515',
      createdBy: 'KT',
      createdAt: new Date('2024-01-17')
    },
    {
      id: '18',
      title: '연금술사',
      author: '파울로 코엘료',
      genre: '자기계발',
      description: '자신의 운명을 찾아가는 소년의 여행',
      coverImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400',
      publishedYear: 1988,
      isbn: '978-1616161616',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-18')
    },
    {
      id: '19',
      title: '82년생 김지영',
      author: '조남주',
      genre: '소설',
      description: '평범한 한국 여성의 삶을 그린 소설',
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      publishedYear: 2016,
      isbn: '978-1717171717',
      createdBy: 'KT',
      createdAt: new Date('2024-01-19')
    },
    {
      id: '20',
      title: '멋진 신세계',
      author: '올더스 헉슬리',
      genre: 'SF',
      description: '완벽하게 통제된 미래 사회의 디스토피아',
      coverImage: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?w=400',
      publishedYear: 1932,
      isbn: '978-1818181818',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '21',
      title: '백년의 고독',
      author: '가브리엘 가르시아 마르케스',
      genre: '소설',
      description: '부엔디아 가문의 백년 역사',
      coverImage: 'https://images.unsplash.com/photo-1485988412941-77a35537dae4?w=400',
      publishedYear: 1967,
      isbn: '978-1919191919',
      createdBy: 'KT',
      createdAt: new Date('2024-01-21')
    },
    {
      id: '22',
      title: '해변의 카프카',
      author: '무라카미 하루키',
      genre: '소설',
      description: '현실과 환상이 교차하는 청소년의 여정',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      publishedYear: 2002,
      isbn: '978-2020202020',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-22')
    },
    {
      id: '23',
      title: '도둑맞은 집중력',
      author: '요한 하리',
      genre: '자기계발',
      description: '현대인의 집중력 위기와 해결책',
      coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
      publishedYear: 2022,
      isbn: '978-2121212121',
      createdBy: 'KT',
      createdAt: new Date('2024-01-23')
    },
    {
      id: '24',
      title: '숨결이 바람 될 때',
      author: '폴 칼라니티',
      genre: '에세이',
      description: '죽음을 앞둔 의사의 성찰',
      coverImage: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=400',
      publishedYear: 2016,
      isbn: '978-2222232323',
      createdBy: 'ADMIN',
      createdAt: new Date('2024-01-24')
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionType, setSelectionType] = useState<'edit' | 'delete' | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
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
      createdAt: new Date()
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

  // Show login screen if not logged in
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                <img src={ktAivleLogo} alt="KT AIVLE SCHOOL" className="w-full h-full object-contain p-1" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-gray-900">도서 관리 시스템</h1>
                <p className="text-sm text-gray-500">
                  AI 표지 자동 생성 • {isAdmin ? '관리자' : '일반 회원'} ({currentUser.id})
                </p>
              </div>
            </div>

            {/* Central Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="도서 검색 (제목, 저자, 내용)"
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

            {/* Action Buttons */}
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
                        onClick={() => setIsHistoryOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                        title="변경 이력"
                      >
                        <History className="w-4 h-4" />
                        <span className="hidden sm:inline">이력</span>
                      </button>
                      <button
                        onClick={() => enterSelectionMode('edit')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        title="편집"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">편집</span>
                      </button>
                      <button
                        onClick={() => enterSelectionMode('delete')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">삭제</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={openAddDialog}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">도서 추가</span>
                  </button>
                  <button
                    onClick={() => setIsMyPageOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    title="마이페이지"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">마이페이지</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          books={books}
          isOpen={isSidebarOpen}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          onGenreChange={setSelectedGenre}
          onSortChange={setSortBy}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-gray-700 mb-1">
                {selectedGenre === '전체' ? '전체 도서' : `${selectedGenre} 도서`}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredBooks.length}권의 도서
                {isSelectionMode && selectedBookIds.length > 0 && ` (${selectedBookIds.length}권 선택됨)`}
              </p>
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
      </div>

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

      {/* History Dialog */}
      {isHistoryOpen && (
        <HistoryDialog
          editHistory={editHistory}
          deleteHistory={deleteHistory}
          onClose={() => setIsHistoryOpen(false)}
          onRestore={handleRestoreBook}
        />
      )}

      {/* My Page */}
      {isMyPageOpen && currentUser && (
        <MyPage
          user={currentUser}
          books={isAdmin ? books : books.filter(b => {
            console.log('Book:', b.title, 'createdBy:', b.createdBy, 'currentUser:', currentUser.id, 'match:', b.createdBy === currentUser.id);
            return b.createdBy === currentUser.id;
          })}
          onClose={() => setIsMyPageOpen(false)}
          onPasswordChange={handlePasswordChange}
          onEditBook={(book) => {
            setEditingBook(book);
            setIsDialogOpen(true);
            setIsMyPageOpen(false);
          }}
          onDeleteBook={handleDeleteBook}
        />
      )}

      {/* Book Detail Dialog */}
      {selectedBook && (
        <BookDetailDialog
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}