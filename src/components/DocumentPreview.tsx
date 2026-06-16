/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentItem } from '../types.ts';
import { ChevronRight, Eye, HardDriveDownload, Sparkles, ExternalLink, FileText } from 'lucide-react';
import AdSpace from './AdSpace.tsx';

interface DocumentPreviewProps {
  doc: DocumentItem;
  onBack: () => void;
  onProceedToDownload: () => void;
}

export default function DocumentPreview({ doc, onBack, onProceedToDownload }: DocumentPreviewProps) {
  const getSubjectLabel = (subj: string) => {
    const labels: Record<string, string> = {
      math: 'الرياضيات',
      science: 'علوم الحياة والأرض',
      physique: 'العلوم الفيزيائية',
      arabe: 'اللغة العربية',
      français: 'الفرنسية',
      anglais: 'الإنجليزية'
    };
    return labels[subj] || subj;
  };

  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case '9th': return 'السنة التاسعة أساسي';
      case '1st': return 'السنة الأولى ثانوي';
      case '2nd_science': return 'السنة الثانية علوم';
      default: return lvl;
    }
  };

  return (
    <div id="document-preview-view" className="space-y-6 text-right animate-fade-in" dir="rtl">
      
      {/* Return Navigation Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
            title="الرجوع لقائمة المستندات"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-blue-50 text-[#1a3a5f] px-2 py-0.5 rounded font-bold border border-blue-100">
                {getLevelLabel(doc.level)}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                {getSubjectLabel(doc.subject)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">{doc.title}</h2>
          </div>
        </div>

        <button
          onClick={onProceedToDownload}
          className="w-full sm:w-auto bg-[#1a3a5f] hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <HardDriveDownload className="w-4 h-4" />
          <span>تنزيل ملف الـ PDF الآمن</span>
        </button>
      </div>

      {/* Main Preview Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Interactive Iframe Visualizer Container */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <Eye className="w-4 h-4 text-[#1a3a5f]" />
                <span>المعاينة المباشرة للمستند البيداغوجي المكتوب</span>
              </span>

              {doc.github_preview_url && (
                <a
                  href={doc.github_preview_url}
                  target="_blank"
                  rel="no-referrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a3a5f] hover:underline"
                >
                  <span>فتح في نافذة كاملة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {doc.github_preview_url ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <iframe
                  src={(() => {
                    const url = doc.github_preview_url || '';
                    if (!url) return '';
                    if (url.includes('docs.google.com/gview')) return url;
                    
                    let rawUrl = url;
                    if (url.includes('github.com') && url.includes('/blob/')) {
                      rawUrl = url
                        .replace('github.com', 'raw.githubusercontent.com')
                        .replace('/blob/', '/');
                    }
                    
                    // Direct pdf or raw github file preview
                    if (rawUrl.toLowerCase().endsWith('.pdf') || rawUrl.includes('raw.githubusercontent.com')) {
                      return `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`;
                    }
                    return url;
                  })()}
                  className="w-full h-[600px] border-none bg-white relative z-10"
                  referrerPolicy="no-referrer"
                  title={doc.title}
                  allowFullScreen
                />
                
                {/* Fallback info when embedding fails / lazy load notice */}
                <div className="absolute inset-x-0 bottom-4 text-center z-0 px-4">
                  <p className="text-xs text-slate-400 font-medium">إذا تعذّر تحميل المعاينة في المتصفح، يرجى نقر تحميل PDF بالأعلى.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-16 text-center border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <p className="font-bold text-slate-800 text-sm mb-1.5">لا توجد معاينة مخصصة لهذه الوثيقة</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  بإمكانك تنزيل المستند مباشرة والانتفاع بتمارينه الفورية مجاناً عبر بوابة التحميل المخصصة.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Info and Ads Panel */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-900 to-[#1a3a5f] text-white p-5 rounded-2xl shadow-sm text-right space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-blue-300 flex items-center gap-1.5 border-b border-white/15 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>مزايا الوثيقة التعليمية</span>
            </h3>
            
            <ul className="space-y-3 text-xs leading-relaxed text-blue-105">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>ملف جاهز فوري للطباعة بنقاوة عالية الوضوح.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>اصلاح كامل نموذجي مدقق بواسطة نخبة من المربين.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>مطابق ومحين تبعاً للتعديلات الأخيرة لوزارة التربية.</span>
              </li>
            </ul>

            <button
              onClick={onProceedToDownload}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>تحميل المستند الآن</span>
              <HardDriveDownload className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-bold mb-1 uppercase font-mono">حيز إعلاني مدعوم مخصص لمجانية الدليل</p>
          <AdSpace type="box" />
        </div>

      </div>
    </div>
  );
}
