/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DocumentItem, LevelType, SectionType, SubjectType } from '../types.ts';
import { 
  FileText, BookOpen, Layers, Award, HardDriveDownload, 
  ExternalLink, Sparkles, Filter, ChevronLeft, Calendar, Eye
} from 'lucide-react';
import AdSpace from './AdSpace.tsx';

interface DocumentListProps {
  documents: DocumentItem[];
  level: LevelType;
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  onOpenPreview: (doc: DocumentItem) => void;
  onOpenDownloadWaiting: (doc: DocumentItem) => void;
}

export default function DocumentList({ 
  documents, 
  level, 
  activeSection, 
  setActiveSection,
  onOpenPreview,
  onOpenDownloadWaiting
}: DocumentListProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('math');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  // Subjects based on level
  const getSubjectsForLevel = (lvl: LevelType): { value: SubjectType; label: string }[] => {
    switch (lvl) {
      case '9th':
        return [
          { value: 'math', label: 'الرياضيات' },
          { value: 'science', label: 'علوم الحياة والأرض' },
          { value: 'arabe', label: 'اللغة العربية' },
          { value: 'français', label: 'الفرنسية' },
          { value: 'anglais', label: 'الإنجليزية' }
        ];
      case '1st':
        return [
          { value: 'math', label: 'الرياضيات' },
          { value: 'science', label: 'علوم الحياة والأرض' },
          { value: 'physique', label: 'العلوم الفيزيائية' },
          { value: 'arabe', label: 'اللغة العربية' },
          { value: 'français', label: 'الفرنسية' }
        ];
      case '2nd_science':
        return [
          { value: 'math', label: 'الرياضيات' },
          { value: 'physique', label: 'العلوم الفيزيائية' },
          { value: 'science', label: 'علوم الحياة والأرض' },
          { value: 'français', label: 'الفرنسية' }
        ];
      default:
        return [];
    }
  };

  const levelSubjects = getSubjectsForLevel(level);

  // If the previous selection doesn't exist in the current level, fallback to first available subject
  const currentSubjectObj = levelSubjects.find(s => s.value === selectedSubject);
  const activeSubject = currentSubjectObj ? selectedSubject : (levelSubjects[0]?.value || 'math');

  // Filter documents in memory
  const filteredDocs = documents.filter((doc) => {
    // 1. Level Filter
    if (doc.level !== level) return false;

    // 2. Section Filter
    if (doc.section_type !== activeSection) return false;

    // 3. Subject Filter
    if (doc.subject !== activeSubject) return false;

    // 4. Trimester filter (For 'devoirs' section only)
    if (activeSection === 'devoirs') {
      if (doc.term !== selectedTerm) return false;
    }

    return true;
  });

  const getSubjectColor = (subj: SubjectType) => {
    switch (subj) {
      case 'math': return 'bg-blue-50 text-blue-750 border-blue-100';
      case 'physique': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'science': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'arabe': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'français': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'anglais': return 'bg-pink-50 text-pink-700 border-pink-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getSubjectLabel = (subj: SubjectType) => {
    const found = levelSubjects.find(s => s.value === subj);
    return found ? found.label : subj;
  };

  const mapExamTypeLabel = (examType: string | null) => {
    if (!examType) return 'مستند تعليمي';
    const examMap: Record<string, string> = {
      'controle_1': 'فرض مراقبة عدد 1',
      'controle_2': 'فرض مراقبة عدد 2',
      'synthese_1': 'فرض تأليفي عدد 1',
      'controle_3': 'فرض مراقبة عدد 3',
      'controle_4': 'فرض مراقبة عدد 4',
      'synthese_2': 'فرض تأليفي عدد 2',
      'controle_5': 'فرض مراقبة عدد 5',
      'controle_6': 'فرض مراقبة عدد 6',
      'synthese_3': 'فرض تأليفي عدد 3',
      'concours_experimentaux': 'مناظرة تجريبية',
      'concours_nationaux': 'مناظرة وطنية رسمية'
    };
    return examMap[examType] || examType;
  };

  return (
    <div id="document-list-container" className="space-y-6 text-right" dir="rtl">
      {/* Sections Tab Bar */}
      <div className="flex flex-wrap items-center bg-white p-1 rounded-xl border border-slate-200 gap-1 mb-6 shadow-sm">
        <button
          onClick={() => { setActiveSection('cours'); }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 ${
            activeSection === 'cours' 
              ? 'bg-[#1a3a5f] text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الدروس (Cours)</span>
        </button>

        <button
          onClick={() => { setActiveSection('series'); }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 ${
            activeSection === 'series' 
              ? 'bg-[#1a3a5f] text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>سلاسل تمارين (Séries)</span>
        </button>

        <button
          onClick={() => { setActiveSection('devoirs'); }}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 ${
            activeSection === 'devoirs' 
              ? 'bg-[#1a3a5f] text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>الفروض المصلحة (Devoirs)</span>
        </button>

        {/* 9th Grade Only Sections */}
        {level === '9th' && (
          <>
            <button
              onClick={() => { setActiveSection('concours'); }}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 ${
                activeSection === 'concours' 
                  ? 'bg-[#1a3a5f] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>المناظرات (Concours)</span>
            </button>
          </>
        )}
      </div>

      {/* Subject Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">المادة الدراسية :</label>
        <div className="flex flex-wrap gap-2">
          {levelSubjects.map((sub) => (
            <button
              key={sub.value}
              onClick={() => setSelectedSubject(sub.value)}
              className={`py-2 px-4 rounded-lg text-xs font-bold transition-all border ${
                activeSubject === sub.value
                  ? 'bg-[#1a3a5f] text-white border-[#1a3a5f] shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trimester Filters (For 'devoirs' only) */}
      {activeSection === 'devoirs' && (
        <div className="bg-white py-4 px-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-[#1a3a5f] rounded p-1.5 border border-blue-100">
              <Filter className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">نظام الثلاثيات المدرسي بتونس :</h4>
              <p className="text-[11px] text-slate-500">تم تصفية فروض المراقبة والتأليفية بحسب أسابيع التقويم الوزاري.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`py-2 px-5 rounded-lg text-xs font-bold transition-all border ${
                  selectedTerm === t
                    ? 'bg-[#1a3a5f] text-white border-[#1a3a5f] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-850 border border-slate-200'
                }`}
              >
                الثلاثي {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Document Grid/List Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-100/50 px-4 py-2 rounded-lg text-slate-500 text-xs font-semibold">
          <span>شعبة المستندات المكتشفة ({filteredDocs.length})</span>
          <span>ترتيب تنازلي بحسب الأحدث</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <FileText className="w-8 h-8 text-[#1a3a5f]" />
            </div>
            <p className="text-base font-bold text-slate-900 mb-1">لا تتوفر مستندات حالياً في هذا القسم</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              سيعمل الطاقم البيداغوجي على توفير هذه المواد قريباً جداً، يمكنك تصفح المستندات الأخرى المتاحة حالياً.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-200">
                    <th className="py-2.5 px-6 text-right font-extrabold mr-1">اسم الوثيقة</th>
                    <th className="py-2.5 px-6 text-right font-extrabold hidden md:table-cell">المادة</th>
                    <th className="py-2.5 px-6 text-right font-extrabold">النوع / الدعامة</th>
                    <th className="py-2.5 px-6 text-left font-extrabold pb-3 pr-2 select-none">المعاينة والتحميل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-medium">
                        <div 
                          className="font-bold text-[#1a3a5f] hover:underline cursor-pointer text-sm sm:text-base leading-snug" 
                          onClick={() => {
                            if (doc.github_preview_url) {
                              onOpenPreview(doc);
                            } else {
                              onOpenDownloadWaiting(doc);
                            }
                          }}
                        >
                          {doc.title}
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell font-bold">
                        <span className="text-xs text-[#1a3a5f] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {getSubjectLabel(doc.subject)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {doc.exam_type ? (
                            <span className="px-2.5 py-0.5 bg-green-55 border border-green-200 text-green-800 text-[10px] rounded font-bold font-sans">
                              {mapExamTypeLabel(doc.exam_type)}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded font-bold border border-slate-200">
                              نص المادة
                            </span>
                          )}
                          {doc.term && (
                            <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a3a5f] text-[10px] rounded font-bold border border-blue-100">
                              الثلاثي {doc.term}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {doc.github_preview_url && (
                            <button
                              onClick={() => {
                                onOpenPreview(doc);
                              }}
                              className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-blue-50 hover:bg-blue-105/90 text-[#1a3a5f] text-[11px] font-bold rounded-lg transition-colors border border-blue-150 cursor-pointer"
                            >
                              <span>معاينة للوثيقة</span>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onOpenDownloadWaiting(doc);
                            }}
                            className="inline-flex items-center gap-1 py-1.5 px-3 bg-[#1a3a5f] hover:bg-slate-950 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <span>تحميل PDF</span>
                            <HardDriveDownload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
