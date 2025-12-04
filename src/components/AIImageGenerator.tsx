import { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Palette, Image as ImageIcon } from 'lucide-react';
import { unsplash_tool } from '../tools/unsplash';

interface AIImageGeneratorProps {
  bookTitle: string;
  bookGenre: string;
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

export function AIImageGenerator({ bookTitle, bookGenre, onClose, onGenerate }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<'auto' | 'minimalist' | 'artistic' | 'vintage' | 'modern'>('auto');

  const styleOptions = [
    { id: 'auto' as const, label: '자동', icon: <Sparkles className="w-4 h-4" />, description: '장르 기반 자동 선택' },
    { id: 'minimalist' as const, label: '미니멀', icon: <Palette className="w-4 h-4" />, description: '심플하고 깔끔한 디자인' },
    { id: 'artistic' as const, label: '예술적', icon: <Wand2 className="w-4 h-4" />, description: '창의적이고 독특한 스타일' },
    { id: 'vintage' as const, label: '빈티지', icon: <ImageIcon className="w-4 h-4" />, description: '고전적이고 레트로한 느낌' },
    { id: 'modern' as const, label: '모던', icon: <Palette className="w-4 h-4" />, description: '세련되고 현대적인 감각' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      let baseQuery = prompt || `${bookGenre} book cover ${bookTitle}`;
      
      // Style-based query modifications
      let queries: string[] = [];
      
      if (activeStyle === 'auto') {
        // Generate 6 different variations
        queries = [
          `${baseQuery} professional`,
          `${bookGenre} ${activeStyle} cover design`,
          `${bookGenre} book aesthetic`,
          `${bookGenre} literature theme`,
          `${bookGenre} artistic book`,
          `${bookGenre} modern cover`
        ];
      } else {
        // Generate 6 variations with the selected style
        queries = [
          `${baseQuery} ${activeStyle}`,
          `${bookGenre} ${activeStyle} book`,
          `${activeStyle} ${bookGenre} design`,
          `${activeStyle} literature cover`,
          `${bookGenre} ${activeStyle} aesthetic`,
          `${activeStyle} book cover theme`
        ];
      }

      const images: string[] = [];
      for (const query of queries) {
        try {
          const imageUrl = await unsplash_tool(query);
          if (imageUrl) {
            images.push(imageUrl);
          }
        } catch (error) {
          console.error(`Error generating image for query "${query}":`, error);
        }
      }

      if (images.length === 0) {
        alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
      } else {
        setGeneratedImages(images);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (selectedImage) {
      onGenerate(selectedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2>AI 표지 이미지 생성</h2>
              <p className="text-sm text-purple-100">AI 기술로 책 표지를 자동 생성합니다</p>
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
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-3">
              표지 스타일 선택
            </label>
            <div className="grid grid-cols-5 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
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

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              추가 키워드 (선택사항)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={`예: 달빛, 판타지, 신비로운, 어두운 등`}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    생성
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 선택한 스타일과 장르를 바탕으로 6가지 이미지를 생성합니다
            </p>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                생성된 이미지 (클릭하여 선택)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {generatedImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImage === imageUrl
                        ? 'border-purple-600 shadow-lg scale-105 ring-4 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-400 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`생성된 이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === imageUrl && (
                      <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white text-center">이미지 {index + 1}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {generatedImages.length === 0 && !isGenerating && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-2">AI로 표지를 생성해보세요</h3>
              <p className="text-gray-500 mb-4">
                스타일을 선택하고 '생성' 버튼을 클릭하면<br />
                6가지 다양한 표지 이미지가 생성됩니다
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Palette className="w-4 h-4" />
                <span>5가지 스타일 • 6개 이미지</span>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">
                  <strong>AI 이미지 생성 가이드</strong>
                </p>
                <ul className="space-y-1 text-blue-800">
                  <li>• 원하는 스타일을 선택하면 해당 스타일로 이미지가 생성됩니다</li>
                  <li>• 추가 키워드를 입력하면 더 구체적인 이미지를 얻을 수 있습니다</li>
                  <li>• 데모에서는 Unsplash를 사용하며, 실제로는 DALL-E, Midjourney 등을 연동할 수 있습니다</li>
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
            disabled={!selectedImage}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            선택한 이미지 사용
          </button>
        </div>
      </div>
    </div>
  );
}
