import {useEffect, useState} from 'react';
import { User, Book, Loan } from '../App';
import { X, Key, BookOpen, Edit2, Trash2, CheckCircle, AlertCircle, Package, Calendar, RefreshCw } from 'lucide-react';

interface MyPageProps {
  user: User;
  books: Book[];
  loans: Loan[];
  allBooks: Book[];
  onClose: () => void;
  onPasswordChange: (newPassword: string) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onReturnBook: (loanId: string) => void;
  onExtendLoan: (loanId: string) => void;
}

export function MyPage({ user, books, loans, allBooks, onClose, onPasswordChange, onEditBook, onDeleteBook, onReturnBook, onExtendLoan }: MyPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
//수정 부분
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loadingMyBooks, setLoadingMyBooks] = useState(true);

    useEffect(() => {
        setLoadingMyBooks(true);

        // API 대신 mock data 사용 (수정필요)
        setTimeout(() => {
            setMyBooks([
                {
                    id: "101",
                    title: "테스트 도서 1",
                    author: "홍길동",
                    category: "소설",
                    description: "홍길동ㅇ",
                    coverImage: "https://picsum.photos/200/301",
                    publishedYear: 2023,
                    createdAt: new Date(),
                }
            ]);
            setLoadingMyBooks(false);
        }, 500);
    }, [user.id]);


// 실제 api 사용
    // useEffect(() => {
  //   const fetchMyBooks = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8080/api/book/user/${user.id}`);
  //       if (!response.ok) throw new Error("내 도서 조회 실패");
  //
  //       const data = await response.json();
  //       setMyBooks(data);
  //     } catch (err) {
  //       console.error("내 도서 불러오기 실패:", err);
  //     } finally {
  //       setLoadingMyBooks(false);
  //     }
  //   };
  //
  //   fetchMyBooks();
  // }, [user.id]);



  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (currentPassword !== user.password) {
      setPasswordError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('새 비밀번호는 4자 이상���야 합니다.');
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

  // const handleDelete = (bookId: string, bookTitle: string) => {
  //   if (confirm(`"${bookTitle}"을(를) 삭제하시겠습니까?`)) {
  //     onDeleteBook(bookId);
  //   }
  // };
    const handleDelete = async (bookId: string, bookTitle: string) => {
        if (!confirm(`"${bookTitle}"을(를) 삭제하시겠습니까?`)) return;

        try {
            const response = await fetch(`http://localhost:8080/api/book/${bookId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                alert("도서 삭제 실패");
                return;
            }

            // 🔥 App.tsx의 books 상태 업데이트 요청
            onDeleteBook(bookId);

            alert("도서가 삭제되었습니다.");
        } catch (err) {
            console.error("삭제 중 오류:", err);
            alert("서버 오류로 삭제 실패");
        }
    };



    const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm text-gray-700 mb-2">
                    현재 비밀번호
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="현재 비밀번호를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm text-gray-700 mb-2">
                    새 비밀번호
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="새 비밀번호를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                    새 비밀번호 확인
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-600">비밀번호가 성공적으로 변경되었습니다.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  비밀번호 변경
                </button>
              </form>
            </div>

            {/* My Books Section - Only for non-admin */}
            {user.role !== 'admin' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-gray-900">내가 등록한 도서</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                    {books.length}권
                  </span>
                </div>

                {books.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">등록한 도서가 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {books.map(book => (
                      <div
                        key={book.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 mb-1 truncate">{book.title}</h4>
                          {/*<p className="text-sm text-gray-600 mb-2">{book.author}</p>*/}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                              {book.category}
                            </span>
                            <span>{book.publishedYear}년</span>
                            <span>등록일: {formatDate(book.createdAt)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditBook(book)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                              편집
                            </button>
                            <button
                              onClick={() => handleDelete(book.id, book.title)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
              {/* My Books Section - Only for non-admin */}
              {user.role !== 'admin' && (
                  <div>
                      <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-gray-900">내가 등록한 도서</h3>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
        {myBooks.length}권
      </span>
                      </div>

                      {/* 로딩 상태 */}
                      {loadingMyBooks && (
                          <div className="text-center py-10 text-gray-500">
                              불러오는 중...
                          </div>
                      )}

                      {/* 도서 없음 */}
                      {!loadingMyBooks && myBooks.length === 0 && (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-500">등록한 도서가 없습니다</p>
                          </div>
                      )}

                      {/* 도서 목록 */}
                      {!loadingMyBooks && myBooks.length > 0 && (
                          <div className="space-y-3">
                              {myBooks.map(book => (
                                  <div
                                      key={book.id}
                                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                                  >
                                      <img
                                          src={book.coverImage}
                                          alt={book.title}
                                          className="w-16 h-24 object-cover rounded shadow-sm"
                                      />
                                      <div className="flex-1 min-w-0">
                                          <h4 className="text-gray-900 mb-1 truncate">{book.title}</h4>
                                          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

                                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                  {book.category}
                </span>
                                              <span>{book.publishedYear}년</span>
                                              <span>등록일: {formatDate(book.createdAt)}</span>
                                          </div>

                                          <div className="flex gap-2">
                                              <button
                                                  onClick={() => onEditBook(book)}
                                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                              >
                                                  <Edit2 className="w-3 h-3" />
                                                  편집
                                              </button>

                                              <button
                                                  onClick={async () => {
                                                      if (!confirm(`"${book.title}"을(를) 삭제하시겠습니까?`)) return;

                                                      const res = await fetch(`http://localhost:8080/api/book/${book.id}`, {
                                                          method: "DELETE"
                                                      });

                                                      if (!res.ok) return alert("삭제 실패");

                                                      // 🔥 삭제 성공 → 목록 새로고침
                                                      setMyBooks(prev => prev.filter(b => b.id !== book.id));

                                                      alert("삭제되었습니다.");
                                                  }}
                                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                              >
                                                  <Trash2 className="w-3 h-3" />
                                                  삭제
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}





              {/* Loaned Books Section */}
            {user.role !== 'admin' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-gray-900">대출 현황</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                    {loans.filter(l => l.userId === user.id && !l.returnDate).length}권
                  </span>
                </div>

                {loans.filter(l => l.userId === user.id && !l.returnDate).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">대출한 도서가 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loans
                      .filter(l => l.userId === user.id && !l.returnDate)
                      .map(loan => {
                        const book = allBooks.find(b => b.id === loan.bookId);
                        if (!book) return null;
                        
                        const now = new Date();
                        const isOverdue = loan.dueDate < now;
                        const daysRemaining = Math.ceil((loan.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div
                            key={loan.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                              isOverdue 
                                ? 'bg-red-50 border-red-300' 
                                : daysRemaining <= 2
                                ? 'bg-yellow-50 border-yellow-300'
                                : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-16 h-24 object-cover rounded shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-900 mb-1 truncate">{book.title}</h4>
                              {/*<p className="text-sm text-gray-600 mb-2">{book.author}</p>*/}
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                                  {book.category}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  대출일: {formatDate(loan.loanDate)}
                                </span>
                                <span className={`flex items-center gap-1 px-2 py-1 rounded ${
                                  isOverdue 
                                    ? 'bg-red-100 text-red-700' 
                                    : daysRemaining <= 2
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  반납예정일: {formatDate(loan.dueDate)}
                                  {isOverdue && ' (연체)'}
                                  {!isOverdue && daysRemaining <= 2 && ` (${daysRemaining}일 남음)`}
                                </span>
                                {loan.extended && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded">
                                    연장됨
                                  </span>
                                )}
                              </div>
                              
                              {isOverdue && (
                                <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                                  ⚠️ 이 도서는 연체되었습니다. 반납 시까지 대출이 제한됩니다.
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => onReturnBook(loan.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  반납
                                </button>
                                {!loan.extended && !isOverdue && (
                                  <button
                                    onClick={() => onExtendLoan(loan.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    연장 (7일)
                                  </button>
                                )}
                                {loan.extended && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-400 text-white text-sm rounded cursor-not-allowed">
                                    <RefreshCw className="w-3 h-3" />
                                    연장 완료
                                  </span>
                                )}
                                {isOverdue && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-400 text-white text-sm rounded cursor-not-allowed">
                                    <RefreshCw className="w-3 h-3" />
                                    연장 불가 (연체)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}