// import { useState, useEffect } from 'react';
// import { Book } from '../App';
// import { X, Sparkles } from 'lucide-react';
// import { AIImageGenerator } from './AIImageGenerator';
//
// interface AddBookDialogProps {
//   book: Book | null;
//   onClose: () => void;
//   onSave: (book: any) => void;
// }
//
// export function AddBookDialog({ book, onClose, onSave }: AddBookDialogProps) {
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     genre: '소설',
//     description: '',
//     coverImage: '',
//     publishedYear: new Date().getFullYear(),
//     isbn: ''
//   });
//
//   const [showAIGenerator, setShowAIGenerator] = useState(false);
//
//   useEffect(() => {
//     if (book) {
//       setFormData({
//         title: book.title,
//         author: book.author,
//         genre: book.genre,
//         description: book.description,
//         coverImage: book.coverImage,
//         publishedYear: book.publishedYear,
//         isbn: book.isbn || ''
//       });
//     }
//   }, [book]);
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (book) {
//       onSave({ ...book, ...formData });
//     } else {
//       onSave(formData);
//     }
//   };
//
//   const handleAIGenerate = (imageUrl: string) => {
//     setFormData({ ...formData, coverImage: imageUrl });
//     setShowAIGenerator(false);
//   };
//
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Dialog Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <h2 className="text-gray-900">
//             {book ? '도서 편집' : '새 도서 추가'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
//
//         {/* Dialog Content */}
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-5">
//             {/* Title */}
//             <div>
//               <label className="block text-sm text-gray-700 mb-2">
//                 도서 제목 *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="도서 제목을 입력하세요"
//               />
//             </div>
//
//             {/* Author */}
//             <div>
//               <label className="block text-sm text-gray-700 mb-2">
//                 저자 *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.author}
//                 onChange={(e) => setFormData({ ...formData, author: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="저자명을 입력하세요"
//               />
//             </div>
//
//             {/* Genre and Year */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-2">
//                   장르
//                 </label>
//                 <select
//                   value={formData.genre}
//                   onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="소설">소설</option>
//                   <option value="SF">SF</option>
//                   <option value="판타지">판타지</option>
//                   <option value="미스터리">미스터리</option>
//                   <option value="로맨스">로맨스</option>
//                   <option value="자기계발">자기계발</option>
//                   <option value="에세이">에세이</option>
//                   <option value="역사">역사</option>
//                   <option value="과학">과학</option>
//                   <option value="기타">기타</option>
//                 </select>
//               </div>
//
//               <div>
//                 <label className="block text-sm text-gray-700 mb-2">
//                   출판년도
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.publishedYear}
//                   onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   min="1000"
//                   max="2100"
//                 />
//               </div>
//             </div>
//
//             {/* ISBN */}
//             <div>
//               <label className="block text-sm text-gray-700 mb-2">
//                 ISBN
//               </label>
//               <input
//                 type="text"
//                 value={formData.isbn}
//                 onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="978-1234567890"
//               />
//             </div>
//
//             {/* Description */}
//             <div>
//               <label className="block text-sm text-gray-700 mb-2">
//                 설명
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 rows={4}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 placeholder="도서 설명을 입력하세요"
//               />
//             </div>
//
//             {/* Cover Image */}
//             <div>
//               <label className="block text-sm text-gray-700 mb-2">
//                 표지 이미지 URL
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="url"
//                   value={formData.coverImage}
//                   onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="이미지 URL을 입력하거나 AI로 생성하세요"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowAIGenerator(true)}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
//                 >
//                   <Sparkles className="w-4 h-4" />
//                   AI 생성
//                 </button>
//               </div>
//
//               {formData.coverImage && (
//                 <div className="mt-3 border border-gray-200 rounded-lg p-2">
//                   <img
//                     src={formData.coverImage}
//                     alt="미리보기"
//                     className="w-32 h-44 object-cover rounded mx-auto"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image';
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {/* Dialog Actions */}
//           <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               취소
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               {book ? '수정' : '추가'}
//             </button>
//           </div>
//         </form>
//       </div>
//
//       {/* AI Image Generator Dialog */}
//       {showAIGenerator && (
//         <AIImageGenerator
//           bookTitle={formData.title}
//           bookGenre={formData.genre}
//           onClose={() => setShowAIGenerator(false)}
//           onGenerate={handleAIGenerate}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Book } from '../App';
import { X, Sparkles } from 'lucide-react';
import { AIImageGenerator } from './AIImageGenerator';
import * as React from 'react';

interface AddBookDialogProps {
    book: Book | null;          // null → 신규 등록, Book → 수정
    onClose: () => void;        // 팝업 닫기
    onSave: (savedBook:Book) => void;         // 저장 후 목록 새로고침
}

export function AddBookDialog({ book, onClose, onSave }: AddBookDialogProps) {
    // ⭐ formData 상태 (등록/수정 공통)
    const [formData, setFormData] = useState({
        title: '',
        // author: '',
        category: '소설',
        description: '',
        coverImage: '',
        publishedYear: new Date().getFullYear() //연도만?
        // isbn: ''
    });

    const [showAIGenerator, setShowAIGenerator] = useState(false);

    // ⭐ 수정 모드일 경우 기존 정보 불러오기
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                // author: book.author,
                category: book.category,
                description: book.description,
                coverImage: book.coverImage,
                publishedYear: book.publishedYear
                // isbn: book.isbn || ''
            });
        }
    }, [book]);

    // ⭐ 모든 input을 한 함수로 처리
    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // ⭐ 등록/수정 API 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = book ? "PUT" : "POST";
        const url = book
            ? `http://localhost:8080/api/book/${book.id}`
            : `http://localhost:8080/api/book`;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                alert("저장 실패");
                return;
            }

            const result = await response.json();   // ★ 서버가 돌려준 book 데이터 받기

            onSave(result);   // ★ App.tsx로 데이터 넘기기
            onClose();
        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }
    };


    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //
    //     // 입력 검증
    //     if (!formData.title || !formData.category || !formData.description) {
    //         alert("필수 정보를 입력해주세요.");
    //         return;
    //     }
    //
    //     // ★ 기존 book 이 있으면 "수정"
    //     if (book) {
    //         const updatedBook: Book = {
    //             ...book,
    //             ...formData,
    //             publishedYear: Number(formData.publishedYear) || book.publishedYear
    //         };
    //
    //         onSave(updatedBook);
    //         onClose();
    //         return;
    //     }
    //
    //     // ★ 신규 도서 추가 (Mock book 생성)
    //     const newMockBook: Book = {
    //         id: Date.now().toString(), // 가짜 ID
    //         title: formData.title,
    //         category: formData.category,
    //         description: formData.description,
    //         coverImage: formData.coverImage || "",
    //         publishedYear: Number(formData.publishedYear) || 2025,
    //         createdBy: currentUser?.id || "KT",
    //         createdAt: new Date(),
    //         ratings: [],
    //         reviews: [],
    //         stock: 0,
    //     };
    //
    //     onSave(newMockBook);  // App.tsx로 전달 → UI에 즉시 반영
    //     onClose();
    // };

    // ⭐ AI 이미지 생성 결과 반영
    const handleAIGenerate = (url: string) => {
        handleChange("coverImage", url);
        setShowAIGenerator(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-gray-900 font-semibold">
                        {book ? "도서 수정" : "새 도서 추가"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* 제목 */}
                    <InputField
                        label="도서 제목 *"
                        value={formData.title}
                        onChange={(v) => handleChange("title", v)}
                    />

                    {/*/!* 저자 *!/*/}
                    {/*<InputField*/}
                    {/*    label="저자 *"*/}
                    {/*    value={formData.author}*/}
                    {/*    onChange={(v) => handleChange("author", v)}*/}
                    {/*/>*/}

                    {/* 장르 + 출판년도 */}
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="분류"
                            value={formData.category}
                            options={["소설", "SF", "판타지", "미스터리", "로맨스", "자기계발", "에세이", "역사", "과학", "기타"]}
                            onChange={(v) => handleChange("category", v)}
                        />

                        <InputField
                            label="등록일"
                            type="number"
                            value={formData.publishedYear}
                            onChange={(v) => handleChange("publishedYear", Number(v))}
                        />
                    </div>

                    {/*/!* ISBN *!/*/}
                    {/*<InputField*/}
                    {/*    label="ISBN"*/}
                    {/*    value={formData.isbn}*/}
                    {/*    onChange={(v) => handleChange("isbn", v)}*/}
                    {/*/>*/}

                    {/* 내용 */}
                    <TextareaField
                        label="내용"
                        value={formData.description}
                        onChange={(v) => handleChange("description", v)}
                    />

                    {/* 표지 이미지 URL */}
                    <CoverImageField
                        coverImage={formData.coverImage}
                        onChange={(v) => handleChange("coverImage", v)}
                        onOpenAI={() => setShowAIGenerator(true)}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 rounded-lg">
                            취소
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                            {book ? "수정" : "추가"}
                        </button>
                    </div>
                </form>
            </div>

            {/* AI 생성 팝업 */}
            {showAIGenerator && (
                <AIImageGenerator
                    bookId={book.id}
                    bookTitle={formData.title}
                    bookCategory={formData.category}
                    onClose={() => setShowAIGenerator(false)}
                    onGenerate={handleAIGenerate}
                />
            )}
        </div>
    );
}


// Form 요소들을 공통 컴포넌트로 분리

function InputField({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-sm mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
            />
        </div>
    );
}

function TextareaField({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm mb-2">{label}</label>
            <textarea
                value={value}
                rows={4}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
            />
        </div>
    );
}

function SelectField({ label, value, options, onChange }) {
    return (
        <div>
            <label className="block text-sm mb-2">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
            >
                {options.map((v) => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>
        </div>
    );
}

function CoverImageField({ coverImage, onChange, onOpenAI }) {
    return (
        <div>
            <label className="block text-sm mb-2">표지 이미지 URL</label>

            <div className="flex gap-2">
                <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="이미지 URL을 입력하거나 AI로 생성하세요"
                />

                <button
                    type="button"
                    onClick={onOpenAI}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-1"
                >
                    <Sparkles className="w-4 h-4" /> AI 생성
                </button>
            </div>

            {coverImage && (
                <img
                    src={coverImage}
                    alt = "book-cover-image"
                    className="w-32 h-44 mt-3 border rounded mx-auto object-cover"
                    onError={(e) =>
                        (e.currentTarget.src =
                            "https://via.placeholder.com/200x300?text=No+Image")
                    }
                />
            )}
        </div>
    );
}

