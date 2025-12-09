import { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Palette, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { bookService } from '../services/bookService';

interface AIImageGeneratorProps {
  bookId?: string; // 기존 도서 ID (표지 재생성용)
  bookTitle: string;
  bookGenre: string;
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

export function AIImageGenerator({ bookId, bookTitle, bookGenre, onClose, onGenerate }: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [activeStyle, setActiveStyle] = useState<'auto' | 'minimalist' | 'artistic' | 'vintage' | 'modern'>('auto');

  const styleOptions = [
    { id: 'auto' as const, label: '자동', icon: <Sparkles className="w-4 h-4" />, description: '장르 기반 자동 선택' },
    { id: 'minimalist' as const, label: '미니멀', icon: <Palette className="w-4 h-4" />, description: '심플하고 깔끔한 디자인' },
    { id: 'artistic' as const, label: '예술적', icon: <Wand2 className="w-4 h-4" />, description: '창의적이고 독특한 스타일' },
    { id: 'vintage' as const, label: '빈티지', icon: <ImageIcon className="w-4 h-4" />, description: '고전적이고 레트로한 느낌' },
    { id: 'modern' as const, label: '모던', icon: <Palette className="w-4 h-4" />, description: '세련되고 현대적인 감각' }
  ];

  const handleGenerate = async () => {
    if (!bookId) {
      setError('표지 재생성은 기존 도서에서만 가능합니다.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);
    
    try {
      // API 명세서: PATCH /book/{bookId}
      const response = await bookService.regenerateCover(bookId);
      
      if (response.coverImage) {
        setGeneratedImage(response.coverImage);
      } else {
        throw new Error('백엔드에서 표지 이미지를 생성하지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Error regenerating cover:', err);
      setError(err.message || '표지 생성 중 오류가 발생했습니다. 백엔드 서버를 확인하세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onGenerate(generatedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2>AI 표지 재생성</h2>
              <p className="text-sm text-purple-100">백엔드 AI가 자동으로 새로운 표지를 생성합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Book Info */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">
                  {bookTitle || '제목 미입력'}
                </h3>
                <p className="text-sm text-gray-600">장르: {bookGenre}</p>
                {bookId && (
                  <p className="text-xs text-gray-500 mt-1">도서 ID: {bookId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-900 mb-1">오류 발생</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-3">
              표지 스타일 선택 (참고용)
            </label>
            <div className="grid grid-cols-5 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  disabled={isGenerating}
                  className={`p-3 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeStyle === style.id
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex items-center justify-center mb-2 ${
                    activeStyle === style.id ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {style.icon}
                  </div>
                  <div className={`text-xs text-center mb-1 ${
                    activeStyle === style.id ? 'text-purple-900' : 'text-gray-700'
                  }`}>
                    {style.label}
                  </div>
                  <div className={`text-[10px] text-center ${
                    activeStyle === style.id ? 'text-purple-700' : 'text-gray-500'
                  }`}>
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !bookId}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  AI가 표지를 생성하는 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  AI 표지 생성하기
                </>
              )}
            </button>
            {!bookId && (
              <p className="text-xs text-red-600 mt-2 text-center">
                ⚠️ 기존 도서에서만 표지를 재생성할 수 있습니다
              </p>
            )}
          </div>

          {/* Generated Image */}
          {generatedImage && (
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                생성된 표지 이미지
              </h3>
              <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-lg overflow-hidden border-2 border-purple-600 shadow-lg">
                <img
                  src={generatedImage}
                  alt="생성된 표지"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!generatedImage && !isGenerating && !error && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-2">AI로 표지를 생성해보세요</h3>
              <p className="text-gray-500 mb-4">
                스타일을 선택하고 '생성' 버튼을 클릭하면<br />
                백엔드 AI가 자동으로 전문가급 표지를 만들어줍니다
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && !generatedImage && (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">AI가 표지를 생성하는 중...</h3>
              <p className="text-gray-500">
                잠시만 기다려주세요. 백엔드 서버에서 DALL-E를 사용하여<br />
                최적의 표지 이미지를 생성하고 있습니다.
              </p>
            </div>
          )}

          {/* API Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">
                  <strong>📋 API 명세서 기반</strong>
                </p>
                <ul className="space-y-1 text-blue-800">
                  <li>• <code className="bg-blue-100 px-1 rounded">PATCH /book/{'{bookId}'}</code> - AI 표지 재생성</li>
                  <li>• 백엔드가 자동으로 DALL-E API를 호출하여 표지 생성</li>
                  <li>• 프론트엔드는 API만 호출하고 결과를 받아옵니다</li>
                  <li>• 응답: Book 객체 (새로운 coverImage URL 포함)</li>
                  {!bookId && <li className="text-red-600">• ⚠️ 신규 도서는 POST /book 시 자동 생성됩니다</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUseImage}
            disabled={!generatedImage}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이 표지 사용하기
          </button>
        </div>
      </div>
    </div>
  );
}