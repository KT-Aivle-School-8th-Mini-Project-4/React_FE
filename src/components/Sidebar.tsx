import { Book } from '../App';
import { BarChart3, Filter, SortAsc, X, BookMarked, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

interface SidebarProps {
  books: Book[];
  isOpen: boolean;
  selectedGenre: string;
  sortBy: 'title' | 'year' | 'author';
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: 'title' | 'year' | 'author') => void;
  onClose: () => void;
}

export function Sidebar({
  books,
  isOpen,
  selectedGenre,
  sortBy,
  onGenreChange,
  onSortChange,
  onClose
}: SidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    let totalBooks = books.length;
    let oldestYear = Infinity;
    let newestYear = -Infinity;

    books.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      if (book.publishedYear < oldestYear) oldestYear = book.publishedYear;
      if (book.publishedYear > newestYear) newestYear = book.publishedYear;
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalBooks,
      genreCounts: sortedGenres,
      yearRange: totalBooks > 0 ? `${oldestYear} - ${newestYear}` : '-'
    };
  }, [books]);

  const genres = ['전체', '소설', 'SF', '판타지', '미스터리', '로맨스', '자기계발', '에세이', '역사', '과학', '기타'];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-40 lg:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-80 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between lg:mt-16">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">필터</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Statistics */}
          <div>
            <button
              onClick={() => setIsStatsOpen(!isStatsOpen)}
              className="w-full flex items-center justify-between mb-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm text-gray-700">통계</h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isStatsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ${
                isStatsOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blue-700">전체 도서</span>
                  <BookMarked className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-blue-900">{stats.totalBooks}권</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-purple-700">인기 장르</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-purple-900">
                  {stats.genreCounts[0]?.[0] || '-'} ({stats.genreCounts[0]?.[1] || 0}권)
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-green-700">출판 범위</span>
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-green-900">{stats.yearRange}</p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between mb-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm text-gray-700">카테고리</h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`space-y-1 overflow-y-auto transition-all duration-300 ${
                isCategoryOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {genres.map(genre => {
                const count = genre === '전체' 
                  ? books.length 
                  : books.filter(b => b.genre === genre).length;
                
                return (
                  <button
                    key={genre}
                    onClick={() => onGenreChange(genre)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                      selectedGenre === genre
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{genre}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedGenre === genre
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center justify-between mb-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm text-gray-700">정렬</h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`space-y-1 overflow-hidden transition-all duration-300 ${
                isSortOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <button
                onClick={() => onSortChange('title')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  sortBy === 'title'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                제목순
              </button>
              <button
                onClick={() => onSortChange('year')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  sortBy === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => onSortChange('author')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  sortBy === 'author'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                저자명순
              </button>
            </div>
          </div>

          {/* Genre Distribution */}
          {stats.genreCounts.length > 0 && (
            <div>
              <button
                onClick={() => setIsDistributionOpen(!isDistributionOpen)}
                className="w-full flex items-center justify-between mb-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm text-gray-700">장르별 분포</h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isDistributionOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`space-y-2 overflow-hidden transition-all duration-300 ${
                  isDistributionOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {stats.genreCounts.slice(0, 5).map(([genre, count]) => {
                  const percentage = (count / stats.totalBooks) * 100;
                  return (
                    <div key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{genre}</span>
                        <span className="text-xs text-gray-500">{count}권</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
