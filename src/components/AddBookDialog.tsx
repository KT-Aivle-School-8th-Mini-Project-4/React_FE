import { useState, useEffect } from 'react';
import { Book } from '../App';
import { X, Sparkles } from 'lucide-react';
import { AIImageGenerator } from './AIImageGenerator';

interface AddBookDialogProps {
  book: Book | null;
  onClose: () => void;
  onSave: (book: any) => void;
  isDarkMode?: boolean;
}

export function AddBookDialog({ book, onClose, onSave, isDarkMode }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '소설',
    description: '',
    coverImage: '',
    publishedYear: new Date().getFullYear(),
    isbn: ''
  });

  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverImage: book.coverImage,
        publishedYear: book.publishedYear,
        isbn: book.isbn || ''
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      onSave({ ...book, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleAIGenerate = (imageUrl: string) => {
    setFormData({ ...formData, coverImage: imageUrl });
    setShowAIGenerator(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Dialog Header */}
        <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {book ? '도서 편집' : '새 도서 추가'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                도서 제목 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300'
                }`}
                placeholder="도서 제목을 입력하세요"
              />
            </div>

            {/* Author */}
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                저자 *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300'
                }`}
                placeholder="저자명을 입력하세요"
              />
            </div>

            {/* Genre and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  장르
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="소설">소설</option>
                  <option value="SF">SF</option>
                  <option value="판타지">판타지</option>
                  <option value="미스터리">미스터리</option>
                  <option value="로맨스">로맨스</option>
                  <option value="추리">추리</option>
                  <option value="스릴러">스릴러</option>
                  <option value="공포">공포</option>
                  <option value="무협">무협</option>
                  <option value="라이트노벨">라이트노벨</option>
                  <option value="자기계발">자기계발</option>
                  <option value="에세이">에세이</option>
                  <option value="시/詩">시/詩</option>
                  <option value="역사">역사</option>
                  <option value="철학">철학</option>
                  <option value="종교">종교</option>
                  <option value="과학">과학</option>
                  <option value="기술/공학">기술/공학</option>
                  <option value="컴퓨터/IT">컴퓨터/IT</option>
                  <option value="의학">의학</option>
                  <option value="경제">경제</option>
                  <option value="경영">경영</option>
                  <option value="정치">정치</option>
                  <option value="사회">사회</option>
                  <option value="예술">예술</option>
                  <option value="여행">여행</option>
                  <option value="요리">요리</option>
                  <option value="건강">건강</option>
                  <option value="육아">육아</option>
                  <option value="만화">만화</option>
                  <option value="잡지">잡지</option>
                  <option value="사전">사전</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  출판년도
                </label>
                <input
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    if (!isNaN(year) || e.target.value === '') {
                      setFormData({ ...formData, publishedYear: isNaN(year) ? new Date().getFullYear() : year });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300'
                  }`}
                  min="1000"
                  max="2100"
                  placeholder="예: 2024"
                />
              </div>
            </div>

            {/* ISBN */}
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300'
                }`}
                placeholder="978-1234567890"
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300'
                }`}
                placeholder="도서 설명을 입력하세요"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                표지 이미지 URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300'
                  }`}
                  placeholder="이미지 URL을 입력하거나 AI로 생성하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  AI 생성
                </button>
              </div>
              
              {formData.coverImage && (
                <div className="mt-3 border border-gray-200 rounded-lg p-2">
                  <img
                    src={formData.coverImage}
                    alt="미리보기"
                    className="w-32 h-44 object-cover rounded mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {book ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>

      {/* AI Image Generator Dialog */}
      {showAIGenerator && (
        <AIImageGenerator
          bookTitle={formData.title}
          bookGenre={formData.genre}
          onClose={() => setShowAIGenerator(false)}
          onGenerate={handleAIGenerate}
        />
      )}
    </div>
  );
}