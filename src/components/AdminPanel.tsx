/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { DocumentItem, BlogItem, LevelType, SectionType, SubjectType } from '../types.ts';
import { 
  Lock, CheckCircle2, AlertCircle, Trash2, PlusCircle, 
  ExternalLink, LogOut, ChevronLeft, ShieldCheck, Database, FileText, AlignRight
} from 'lucide-react';

interface AdminPanelProps {
  documents: DocumentItem[];
  blogs: BlogItem[];
  onRefreshData: () => void;
}

export default function AdminPanel({ documents, blogs, onRefreshData }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordHint, setPasswordHint] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Forms states - Document
  const [docLevel, setDocLevel] = useState<LevelType>('9th');
  const [docSection, setDocSection] = useState<SectionType>('cours');
  const [docSubject, setDocSubject] = useState<SubjectType>('math');
  const [docTerm, setDocTerm] = useState<string>('');
  const [docExamType, setDocExamType] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [docUrl, setDocUrl] = useState<string>('');
  const [docPreviewUrl, setDocPreviewUrl] = useState<string>('');

  // Forms states - Blog (شرح نص)
  const [blogLevel, setBlogLevel] = useState<LevelType>('9th');
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogContent, setBlogContent] = useState<string>('');

  // Feedback states
  const [docSuccess, setDocSuccess] = useState<string>('');
  const [docError, setDocError] = useState<string>('');
  const [blogSuccess, setBlogSuccess] = useState<string>('');
  const [blogError, setBlogError] = useState<string>('');

  // Fetch admin password hint on mount
  useEffect(() => {
    fetch('/api/admin/hint')
      .then((res) => res.json())
      .then((data) => {
        if (data.hint) setPasswordHint(data.hint);
      })
      .catch((e) => console.log('Hint fetch failed', e));

    // Restore login session from localStorage
    const savedPassword = localStorage.getItem('tunisian_admin_pwd');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyPassword(savedPassword);
    }
  }, []);

  const verifyPassword = async (pwdToVerify: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwdToVerify }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsAuthenticated(true);
        localStorage.setItem('tunisian_admin_pwd', pwdToVerify);
        setAuthError('');
      } else {
        setAuthError(data.error || 'كلمة المرور غير صحيحة');
        localStorage.removeItem('tunisian_admin_pwd');
      }
    } catch (err) {
      setAuthError('تعذر الاتصال بالخادم، يرجى إعادة المحاولة.');
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    verifyPassword(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('tunisian_admin_pwd');
  };

  // Subjects lists per level
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

  // Adjust docSubject if level changes
  useEffect(() => {
    const subjects = getSubjectsForLevel(docLevel);
    if (subjects.length > 0) {
      setDocSubject(subjects[0].value);
    }
  }, [docLevel]);

  const handleAddDocument = async (e: FormEvent) => {
    e.preventDefault();
    setDocError('');
    setDocSuccess('');

    if (!docTitle.trim() || !docUrl.trim()) {
      setDocError('يرجى ملء جميع الحقول الضرورية (العنوان ورابط GitHub PDF).');
      return;
    }

    try {
      const savedPwd = localStorage.getItem('tunisian_admin_pwd') || password;
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': savedPwd
        },
        body: JSON.stringify({
          level: docLevel,
          section_type: docSection,
          subject: docSubject,
          term: docSection === 'devoirs' ? Number(docTerm) || null : null,
          exam_type: docSection === 'devoirs' || docSection === 'concours' ? docExamType : null,
          title: docTitle,
          github_pdf_url: docUrl,
          github_preview_url: docPreviewUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'عجز ملقم الخدمة عن معالجة الإضافة');
      }

      setDocSuccess('تم بنجاح إضافة المستند البيداغوجي الجديد إلى المنظومة!');
      setDocTitle('');
      setDocUrl('');
      setDocPreviewUrl('');
      setDocTerm('');
      setDocExamType('');
      onRefreshData();
    } catch (err: any) {
      setDocError(err.message || 'حدث خطأ غير متوقع أثناء إرسال المستند.');
    }
  };

  const handleAddBlog = async (e: FormEvent) => {
    e.preventDefault();
    setBlogError('');
    setBlogSuccess('');

    if (!blogTitle.trim() || !blogContent.trim()) {
      setBlogError('يرجى كتابة عنوان المقال وموضوع شرح النص بالكامل.');
      return;
    }

    try {
      const savedPwd = localStorage.getItem('tunisian_admin_pwd') || password;
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': savedPwd
        },
        body: JSON.stringify({
          level: blogLevel,
          title: blogTitle,
          content: blogContent,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'عجز النظام الملقم عن حفظ شرح النص المكتوب');
      }

      setBlogSuccess('تم بنجاح نشر المقال الأكاديمي لشرح النص بمستند الطلاب التونسيين!');
      setBlogTitle('');
      setBlogContent('');
      onRefreshData();
    } catch (err: any) {
      setBlogError(err.message || 'أخفق إرسال شرح النص، تأكد من الاتصال وكود المرور.');
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستند نهائيًا من قاعدة البيانات؟')) return;

    try {
      const savedPwd = localStorage.getItem('tunisian_admin_pwd') || password;
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': savedPwd
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('تم الحذف بنجاح!');
        onRefreshData();
      } else {
        alert(data.error || 'فشل عملية الحذف للأسف.');
      }
    } catch (err) {
      alert('خطأ أثناء إرسال طلب الحذف.');
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm('هل تود حذف مقال شرح النص هذا نهائياً؟')) return;

    try {
      const savedPwd = localStorage.getItem('tunisian_admin_pwd') || password;
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': savedPwd
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('تم إزالة المقال بنجاح!');
        onRefreshData();
      } else {
        alert(data.error || 'فشل إزالة موضوع شرح النص.');
      }
    } catch (err) {
      alert('خطأ أثناء إرسال طلب تصفير الشرح.');
    }
  };

  const formatLevel = (lvl: LevelType) => {
    switch (lvl) {
      case '9th': return 'تاسعة أساسي';
      case '1st': return 'أولى ثانوي';
      case '2nd_science': return 'ثانية علوم';
      default: return lvl;
    }
  };

  const formatSection = (sec: SectionType) => {
    switch (sec) {
      case 'cours': return 'دروس';
      case 'series': return 'سلاسل تمارين';
      case 'devoirs': return 'فروض مصلحة';
      case 'concours': return 'مناظرات';
      default: return sec;
    }
  };

  const formatSubject = (sub: SubjectType) => {
    const labels: Record<string, string> = {
      math: 'رياضيات',
      science: 'علوم أرض',
      physique: 'فيزياء',
      arabe: 'عربية',
      français: 'فرنسية',
      anglais: 'إنجليزية'
    };
    return labels[sub] || sub;
  };

  // --- Password Gate ---
  if (!isAuthenticated) {
    return (
      <div id="admin-login-gate" className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg text-right" dir="rtl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#1a3a5f] mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">بوابة الإدارة والأشراف</h2>
          <p className="text-xs text-slate-400 mt-1">يلزم إدخال رمز الحماية للتحكم وتحديث المستندات البيداغوجية</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5 font-mono">كلمة مرور لوحة الإدارة :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل رمز العبور المحمي..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-left font-mono focus:border-[#1a3a5f] focus:ring-1 focus:ring-[#1a3a5f] outline-none transition-all"
            />
          </div>

          {authError && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1a3a5f] hover:bg-slate-950 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 shadow-md cursor-pointer"
          >
            تسجيل الدخول الآن
          </button>
        </form>

        {passwordHint && (
          <div className="mt-6 pt-4 border-t border-slate-200 text-center select-none bg-slate-50 p-3 rounded-xl border border-dashed">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">تلميح للاختبار العابر (الوضع التجريبي) :</span>
            <code className="bg-blue-50 text-[#1a3a5f] border border-blue-100 text-xs px-2.5 py-1 rounded-md font-mono font-extrabold">{passwordHint}</code>
          </div>
        )}
      </div>
    );
  }

  // --- Authenticated Layout ---
  return (
    <div id="admin-dashboard" className="space-y-8 text-right" dir="rtl">
      {/* Dashboard Top Header */}
      <div className="bg-gradient-to-l from-[#1a3a5f] via-[#22547e] to-[#0f243d] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md border border-slate-850">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-black flex items-center gap-2">لوحة إشراف مدير النظام (مستوى كامل الصلاحية)</h1>
            <p className="text-xs text-blue-100/90 mt-0.5 font-sans leading-normal">يمكنك إضافة مستندات جديدة، دروس، فروض تونسية، وإجراء تحديثات آنية في قاعدة البيانات.</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all outline-none border border-white/20 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>إنهاء الجلسة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ========================================================= */}
        {/* COLUMN 1: NEW DOCUMENT INSERTION */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#1a3a5f]" />
            <h2 className="font-extrabold text-slate-900 text-base">إضافة مستند بيداغوجي جديد (PDF)</h2>
          </div>

          <form onSubmit={handleAddDocument} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Level select */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">المستور الدراسي الوزاري :</label>
                <select
                  value={docLevel}
                  onChange={(e) => setDocLevel(e.target.value as LevelType)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
                >
                  <option value="9th">السنة التاسعة أساسي (9ème)</option>
                  <option value="1st">السنة الأولى ثانوي (1ère)</option>
                  <option value="2nd_science">السنة الثانية علوم (2ème)</option>
                </select>
              </div>

              {/* Section select */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">تصنيف القسم البيداغوجي :</label>
                <select
                  value={docSection}
                  onChange={(e) => setDocSection(e.target.value as SectionType)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
                >
                  <option value="cours">الدروس (Cours)</option>
                  <option value="series">المجموعات وسلاسل لولبية (Séries)</option>
                  <option value="devoirs">الفروض والتقييمات الذاتية (Devoirs)</option>
                  {docLevel === '9th' && (
                    <option value="concours">المناظرات الوطنية (Concours)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Subject select */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">المادة الدراسية :</label>
                <select
                  value={docSubject}
                  onChange={(e) => setDocSubject(e.target.value as SubjectType)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
                >
                  {getSubjectsForLevel(docLevel).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Triggered only if section is Devoirs */}
              {docSection === 'devoirs' && (
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 block mb-1">الثلاثية التقويمية :</label>
                  <select
                    value={docTerm}
                    onChange={(e) => setDocTerm(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
                  >
                    <option value="">-- اختر الثلاثي --</option>
                    <option value="1">الثلاثي الأول (Trimestre 1)</option>
                    <option value="2">الثلاثي الثاني (Trimestre 2)</option>
                    <option value="3">الثلاثي الثالث (Trimestre 3)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Exam style option (Devoirs / Concours) */}
            {(docSection === 'devoirs' || docSection === 'concours') && (
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block mb-1">نموذج نوع الامتحان / الفرض :</label>
                <select
                  value={docExamType}
                  onChange={(e) => setDocExamType(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
                >
                  <option value="">-- اضغط لتحديد دقيق --</option>
                  {docSection === 'devoirs' && (
                    <>
                      <option value="controle_1">فرض مراقبة عدد 1</option>
                      <option value="controle_2">فرض مراقبة عدد 2</option>
                      <option value="synthese_1">فرض تأليفي عدد 1</option>
                      <option value="controle_3">فرض مراقبة عدد 3</option>
                      <option value="controle_4">فرض مراقبة عدد 4</option>
                      <option value="synthese_2">فرض تأليفي عدد 2</option>
                      <option value="controle_5">فرض مراقبة عدد 5</option>
                      <option value="controle_6">فرض مراقبة عدد 6</option>
                      <option value="synthese_3">فرض تأليفي عدد 3</option>
                    </>
                  )}
                  {docSection === 'concours' && (
                    <>
                      <option value="concours_experimentaux">مناظرة تجريبية بجهوية معينة</option>
                      <option value="concours_nationaux">امتحان مناظرة وطنية رسمية قديمة</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1">عنوان المستند المستقبلي (بالعربية) :</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="مثال: فرض مراقبة عدد 1 مصلح في الرياضيات لنموذج النوفيام..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#1a3a5f] outline-none font-bold"
              />
            </div>

            {/* PDF url in GitHub */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1">رابط تنزيل ملف PDF مباشر من GitHub (للتحميل) :</label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://github.com/profile/repo/raw/main/file.pdf"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-left font-mono focus:border-[#1a3a5f] outline-none"
              />
            </div>

            {/* Preview url in GitHub */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1">رابط صفحة المعاينة للملف (مثال: رابط GitHub Pages أو Google Viewer أو ملف GitHub) (اختياري) :</label>
              <input
                type="url"
                value={docPreviewUrl}
                onChange={(e) => setDocPreviewUrl(e.target.value)}
                placeholder="https://github.com/profile/repo/blob/main/file.pdf (أو رابط المعاينة)"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-left font-mono focus:border-[#1a3a5f] outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                سيظهر زر "عرض المعاينة" لتلاميذنا في حالة توفر هذا الرابط لتصفح المستند مباشرة قبل التحميل.
              </p>
            </div>

            {docSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-100 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{docSuccess}</span>
              </div>
            )}

            {docError && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-red-100 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{docError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1a3a5f] hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              نشر وحفظ المستند PDF في قاعدة البيانات
            </button>
          </form>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: NEW BLOG (شرح نص) WRITING FORM */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <AlignRight className="w-5 h-5 text-[#1a3a5f]" />
            <h2 className="font-extrabold text-slate-900 text-base">إضافة مقال شرح نص جديد (شرح نص لغة عربية)</h2>
          </div>

          <form onSubmit={handleAddBlog} className="space-y-4">
            {/* Level select */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1">مستوى شرح النص المقرر :</label>
              <select
                value={blogLevel}
                onChange={(e) => setBlogLevel(e.target.value as LevelType)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-[#1a3a5f] outline-none font-bold"
              >
                <option value="9th">السنة التاسعة أساسي</option>
                <option value="1st">السنة الأولى ثانوي</option>
                <option value="2nd_science">السنة الثانية علوم</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1">عنوان شرح النص :</label>
              <input
                type="text"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="مثال: شرح نص طوق الياسمين - للأديب نزار قباني"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#1a3a5f] outline-none font-bold"
              />
            </div>

            {/* Content editor (HTML supported) */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block mb-1 font-mono">المحتوى الأكاديمي والتحليل (HTML) :</label>
              <textarea
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                rows={5}
                placeholder="اكتب التقديم المادي، التقسيم الهيكلي، وشرح الأسئلة هنا... دمج وسم <p> وبقية وسوم القوائم يضفي جاذبية..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs leading-relaxed focus:border-[#1a3a5f] outline-none font-sans"
              />
            </div>

            {blogSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-100 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{blogSuccess}</span>
              </div>
            )}

            {blogError && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-red-100 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{blogError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1a3a5f] hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
            >
              نشر شرح النص الفوري في دليل المدونة
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 3: MANAGEMENT LISTS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Current documents list to delete */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1a3a5f]" />
            <span>قائمة ملفات الـ PDF الحالية لتعديلها ({documents.length} مستند)</span>
          </h3>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
            {documents.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">لا تتوفر مستندات بقاعدة البيانات حالياً</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="py-3 flex justify-between items-start gap-3 hover:bg-slate-50/50 px-2 rounded-lg transition-all">
                  <div className="space-y-1 max-w-[80%]">
                    <p className="font-bold text-slate-950 leading-relaxed">{doc.title}</p>
                    <div className="flex gap-1 flex-wrap text-[10px] text-slate-400">
                      <span className="bg-blue-50 text-[#1a3a5f] px-1.5 py-0.5 rounded-md border border-blue-100 font-bold">{formatLevel(doc.level)}</span>
                      <span className="bg-green-50 text-green-800 px-1.5 py-0.5 rounded-md border border-green-100 font-bold">{formatSection(doc.section_type)}</span>
                      <span className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md border border-slate-200">{formatSubject(doc.subject)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-55/10 p-2 rounded-lg transition-all self-center cursor-pointer"
                    title="حذف المستند"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Current blogs list to delete */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <AlignRight className="w-4 h-4 text-[#1a3a5f]" />
            <span>مدير المقالات لشروح النصوص ({blogs.length} مقال)</span>
          </h3>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
            {blogs.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">لا توجد مقالات شروح نصوص منشورة مسبقاً</p>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="py-3 flex justify-between items-center gap-3 hover:bg-slate-50/50 px-2 rounded-lg transition-all">
                  <div className="space-y-1 max-w-[80%]">
                    <p className="font-bold text-slate-950 leading-relaxed">{blog.title}</p>
                    <span className="bg-blue-50 text-[#1a3a5f] px-1.5 py-0.5 rounded-md border border-blue-100 font-bold text-[10px]">
                      المستوى: {formatLevel(blog.level)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-55/10 p-2 rounded-lg transition-all shrink-0 cursor-pointer"
                    title="حذف المقال"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
