/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BlogItem, LevelType } from '../types.ts';
import { BookOpen, Calendar, ArrowLeft, ArrowRight, CornerDownLeft, AlignRight, FileText } from 'lucide-react';

interface BlogReaderProps {
  blogs: BlogItem[];
  selectedLevel: LevelType;
}

export default function BlogReader({ blogs, selectedLevel }: BlogReaderProps) {
  const [activeBlogId, setActiveBlogId] = useState<number | null>(null);

  // Filter blogs according to selected level
  const filteredBlogs = blogs.filter((blog) => blog.level === selectedLevel);

  const activeBlog = blogs.find((blog) => blog.id === activeBlogId);

  const formatLevel = (level: LevelType) => {
    switch (level) {
      case '9th':
        return 'السنة التاسعة أساسي';
      case '1st':
        return 'السنة الأولى ثانوي';
      case '2nd_science':
        return 'السنة الثانية علوم';
      default:
        return '';
    }
  };

  if (activeBlog) {
    return (
      <div id="blog-reader-active" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto my-6" dir="rtl">
        {/* Back navigation */}
        <button
          onClick={() => setActiveBlogId(null)}
          className="mb-6 flex items-center gap-2 text-[#1a3a5f] hover:text-slate-950 font-bold text-xs bg-blue-50 hover:bg-blue-100/50 px-4 py-2 rounded-lg border border-blue-100 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى قائمة شروح النصوص</span>
        </button>

        <div className="border-b border-slate-200 pb-4 mb-6">
          <span className="bg-amber-50 text-amber-805 text-xs px-2.5 py-1 rounded-md font-bold border border-amber-200 mb-2.5 inline-block">
            شرح نص - {formatLevel(activeBlog.level)}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3a5f] mb-3 leading-snug">
            {activeBlog.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {activeBlog.created_at ? new Date(activeBlog.created_at).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'يونيو 2026'}
            </span>
            <span className="flex items-center gap-1 text-[#1a3a5f] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              <BookOpen className="w-3.5 h-3.5" />
              اللغة العربية
            </span>
          </div>
        </div>

        {/* Content Render */}
        <div 
          className="prose prose-blue max-w-none text-slate-800 leading-relaxed text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: activeBlog.content }}
        />

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4 font-medium">
          <p>جميع حقوق الطبع والنشر محفوظة لمنصة الناجح التربوية © 2026</p>
          <button
            onClick={() => setActiveBlogId(null)}
            className="text-[#1a3a5f] hover:underline flex items-center gap-1 font-bold"
          >
            تصفح المزيد من الشروحات
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="blog-reader-list" className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3 border-r-4 border-[#1a3a5f] pr-3.5 my-4">
        <AlignRight className="w-6 h-6 text-[#1a3a5f]" />
        <div>
          <h2 className="text-xl font-black text-slate-900">قسم شروح النصوص (شرح نص)</h2>
          <p className="text-xs text-slate-500">تحليلات أدبية معتمدة وقراءات هيكلية ودلالية للبرنامج التعليمي التونسي الرسمي</p>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-900 mb-1">لا تتوفر شروحات نصوص حالياً لهذا المستوى</p>
          <p className="text-xs text-slate-400">يمكنك إضافة شروحات جديدة من خلال لوحة الإدارة المحمية.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#1a3a5f] hover:shadow-md transition-all flex flex-col justify-between text-right shadow-sm"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#1a3a5f] font-bold bg-blue-50 px-2.5 py-1 rounded-md mb-3 inline-block border border-blue-100">
                  منهج فقه اللغة العربية
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mb-2 hover:text-blue-900 transition-all leading-snug">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-sans">
                  دراسة شاملة وبطاقة تحليلية لنص مأخوذ من الكتاب المدرسي التونسي للغة العربية، متضمنا الأفكار والإجابة...
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  تحديث: يونيو 2026
                </span>
                <button
                  onClick={() => setActiveBlogId(blog.id)}
                  className="bg-[#1a3a5f] hover:bg-blue-950 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm transition-all"
                >
                  اقرأ الشرح الكامل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
