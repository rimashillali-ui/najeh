/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DocumentItem } from '../types.ts';
import { ChevronRight, Clock, HardDriveDownload, Sparkles, CheckCircle2 } from 'lucide-react';
import AdSpace from './AdSpace.tsx';

interface DownloadWaitingProps {
  doc: DocumentItem;
  onBack: () => void;
}

export default function DownloadWaiting({ doc, onBack }: DownloadWaitingProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

  return (
    <div id="download-waiting-view" className="max-w-xl mx-auto my-6 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg text-right animate-fade-in animate-duration-300" dir="rtl">
      
      {/* Back button */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>تراجع والرجوع للملفات</span>
        </button>
        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-md font-bold font-mono">
          تحميل مباشر آمن
        </span>
      </div>

      <div className="text-center space-y-6">
        
        {/* State 1: Counting Down */}
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Spinner ring backdrop */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              {/* Spinner loader ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#1a3a5f] border-t-transparent animate-spin"></div>
              {/* Numerical timer in the middle */}
              <div className="text-3xl font-black text-[#1a3a5f] font-mono select-none">
                {timeLeft}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>جاري إعداد وتشفير رابط التحميل...</span>
              </h3>
              <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">
                الرجاء الانتظار <strong className="text-amber-600 font-mono font-black">{timeLeft} ثانية</strong> لتحضير المستند التربوي مجانًا وبأعلى دقة.
              </p>
            </div>
          </div>
        ) : (
          /* State 2: Preparation Confirmed & Download Button is Active */
          <div className="space-y-6 animate-scale-up">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">جاهز للتحميل الآن!</h3>
              <p className="text-xs text-slate-500">
                نشكركم على صبركم ومساهمتكم في جعل المحتوى مجانيًا. الرابط جاهز للفتح.
              </p>
            </div>

            {/* Glowing Big Call-To-Action Download Button */}
            <a
              href={doc.github_pdf_url}
              target="_blank"
              rel="no-referrer"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.03] active:scale-[0.98] text-white font-black rounded-xl text-sm transition-all shadow-md cursor-pointer animate-pulse"
            >
              <span>اضغط هنا لتنزيل الملف PDF الآن</span>
              <HardDriveDownload className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Selected Document Metadata Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-250 text-right space-y-2 select-none">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase font-mono leading-none">تفاصيل الملف :</p>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">{doc.title}</h4>
          <span className="inline-block text-[10px] bg-blue-50 text-[#1a3a5f] border border-blue-100 px-2 py-0.5 rounded font-bold">
            مادة {getSubjectLabel(doc.subject)}
          </span>
        </div>

        {/* ADVERTISEMENT BLOCK - POSITIONED STRICKLY ACCORDING TO USER REQ */}
        <div className="pt-4 border-t border-slate-100 select-none">
          <p className="text-[10px] text-center text-slate-400 font-bold mb-2 uppercase font-mono">إعلان ممول - يدعم استمرار الخدمة مجانًا لتلاميذ تونس</p>
          <AdSpace type="box" />
        </div>

      </div>
    </div>
  );
}
