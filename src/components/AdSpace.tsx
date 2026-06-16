/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Info } from 'lucide-react';

interface AdSpaceProps {
  type: 'leaderboard' | 'box';
}

export default function AdSpace({ type }: AdSpaceProps) {
  if (type === 'leaderboard') {
    return (
      <div 
        id="ad-space-leaderboard"
        className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3 my-4 flex flex-col justify-center items-center relative overflow-hidden"
        style={{ minHeight: '90px' }}
      >
        <span className="absolute top-1 right-2 text-[9px] font-semibold text-slate-400 font-mono tracking-wider flex items-center gap-1">
          مساحة إعلانية ممولة <Info className="w-3 h-3" />
        </span>
        <div className="text-center">
          <p className="text-xs font-semibold text-blue-900/70 mb-0.5">منصة عروض اتصالات تونس 2026</p>
          <p className="text-[11px] text-slate-500">اشترك الآن في باقة الطالب وانعم بإنترنت غير محدود للتحصيل الدراسي</p>
        </div>
        <div className="mt-1.5 flex gap-2">
          <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">عرض خاص بالتلاميذ</span>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">ممول</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="ad-space-box"
      className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 flex flex-col justify-center items-center relative"
      style={{ minHeight: '250px' }}
    >
      <span className="absolute top-1 right-2 text-[9px] font-semibold text-slate-400 font-mono tracking-wider flex items-center gap-1">
        إشهار <Info className="w-3 h-3" />
      </span>
      <div className="text-center px-2 flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-2 font-black text-xs text-center leading-tight">دوفاراتنا</div>
        <p className="text-xs font-bold text-slate-800 mb-1">حمّل تطبيق Devoiratna على هاتفك المحمول</p>
        <p className="text-[11px] text-slate-500 mb-3">شروح فورية للأستاذ الآلي بالذكاء الاصطناعي وبنك أسئلة متكامل</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-1.5 px-4 rounded transition-all shadow-sm">
          تنزيل التطبيق مجاناً
        </button>
      </div>
    </div>
  );
}
