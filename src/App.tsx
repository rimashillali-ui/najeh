/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DocumentItem, BlogItem, LevelType, SectionType } from './types.ts';
import DocumentList from './components/DocumentList.tsx';
import BlogReader from './components/BlogReader.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AdSpace from './components/AdSpace.tsx';
import DocumentPreview from './components/DocumentPreview.tsx';
import DownloadWaiting from './components/DownloadWaiting.tsx';
import { 
  GraduationCap, BookOpen, Layers, Award, Shield, 
  ExternalLink, Sparkles, Book, AppWindow, Globe, HelpCircle 
} from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Layout navigation states
  const [viewState, setViewState] = useState<'home' | 'level_dashboard' | 'admin' | 'preview_doc' | 'waiting_download'>('home');
  const [selectedLevel, setSelectedLevel] = useState<LevelType>('9th');
  const [activeSection, setActiveSection] = useState<SectionType>('cours');
  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'blogs'>('docs');

  // Preview / Download waiting states
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentItem | null>(null);
  const [selectedWaitingDoc, setSelectedWaitingDoc] = useState<DocumentItem | null>(null);

  const handleOpenPreview = (doc: DocumentItem) => {
    setSelectedPreviewDoc(doc);
    setViewState('preview_doc');
  };

  const handleOpenDownloadWaiting = (doc: DocumentItem) => {
    setSelectedWaitingDoc(doc);
    setViewState('waiting_download');
  };

  // Fetch all documents and blogs from API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [docsRes, blogsRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/blogs')
      ]);

      if (docsRes.ok && blogsRes.ok) {
        const docsData = await docsRes.json();
        const blogsData = await blogsRes.json();
        setDocuments(docsData);
        setBlogs(blogsData);
      }
    } catch (err) {
      console.error('Failed to sync pedagogical data from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const selectLevelAndOpen = (lvl: LevelType) => {
    setSelectedLevel(lvl);
    setActiveSection('cours');
    setActiveSubTab('docs');
    setViewState('level_dashboard');
  };

  const getLevelLabel = (lvl: LevelType) => {
    switch (lvl) {
      case '9th':
        return 'السنة التاسعة أساسي';
      case '1st':
        return 'السنة الأولى ثانوي';
      case '2nd_science':
        return 'السنة الثانية علوم';
      default:
        return lvl;
    }
  };

  const currentLevelBlogsCount = blogs.filter(b => b.level === selectedLevel).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-900 selection:text-white pb-12" dir="rtl">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#1a3a5f] border-b border-slate-800 text-white shadow-md transition-all duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo Alignment */}
          <div 
            onClick={() => setViewState('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1a3a5f] font-extrabold text-base transition-all duration-300 group-hover:scale-105 shadow-md">
              <div className="w-6 h-6 border-4 border-[#1a3a5f] rounded-sm flex items-center justify-center font-black text-xs">🎓</div>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight block">منصتي التعليمية <span className="text-blue-300 font-light">تونس</span></span>
              <span className="text-[10px] text-blue-200/85 font-mono block -mt-1 uppercase">البوابة التربوية التونسية للناجح</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setViewState('home')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewState === 'home' 
                  ? 'bg-white/15 text-white font-black' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              الرئيسية
            </button>

            {viewState === 'level_dashboard' && (
              <div id="level-breadcrumb" className="hidden sm:flex items-center text-blue-300/80 gap-1.5 text-xs font-bold">
                <span>/</span>
                <span className="text-white bg-white/10 px-2.5 py-1 rounded-lg">
                  {getLevelLabel(selectedLevel)}
                </span>
              </div>
            )}

            <button
              onClick={() => setViewState('admin')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none ${
                viewState === 'admin'
                  ? 'bg-white text-[#1a3a5f] shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>لوحة الإدارة</span>
            </button>
          </nav>

        </div>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {isLoading && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-semibold text-sm">جاري مزامنة الدليل التربوي من خادم السحاب التونسي...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* VIEW A: HOME SCREEN (LEVEL CARD SELECTION) */}
            {viewState === 'home' && (
              <div id="home-view" className="space-y-8 animate-fade-in" dir="rtl">
                {/* Hero block */}
                <div className="bg-gradient-to-l from-[#1a3a5f] via-[#22547e] to-[#0f243d] text-white rounded-2xl p-6 sm:p-10 shadow-md relative overflow-hidden text-right border border-slate-800">
                  <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="bg-[#1a3a5f] border border-blue-400/30 text-blue-200 text-xs px-3 py-1 rounded-full font-bold inline-block font-mono">
                      البرنامج الوزاري التونسي 2026 / 2027
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                      رأس مالك عِلمُك.. تحضير كفء، مصلح ورصين في متناول يديك!
                    </h1>
                    <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-sans">
                      منصة <strong>Devoiratna (دوفاراتنا)</strong> توفر شروح نصوص لغة عربية متميزة، دروس، سلاسل تمارين لولبية، وفروض مصلحة بالتفصيل لثلاث مستويات حاسمة بالمناهج التونسية. جميع محتوياتنا بصيغة PDF قابلة للتحميل والقراءة المباشرة مجاناً مع حماية تامة.
                    </p>
                  </div>
                </div>

                {/* Level selection headline */}
                <div className="text-right space-y-1.5 border-r-4 border-[#1a3a5f] pr-3.5 my-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">اختر مستواك التعليمي :</h2>
                  <p className="text-xs text-slate-500">اختر الفئة لبدء تصفح مئات الفروض والدروس وتحليل شروح النصوص المعتمدة</p>
                </div>

                {/* VISUAL CARDS FOR TUNISIAN GRADES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1: 9th Grade */}
                  <div 
                    onClick={() => selectLevelAndOpen('9th')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-900 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="w-12 h-12 bg-blue-50 text-[#1a3a5f] rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-[#1a3a5f] group-hover:text-white transition-all">
                        09
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">السنة التاسعة أساسي</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                        بوابة التميز في مناظرة ختم التعليم الأساسي (شهادة النوفيام). دروس، سلاسل، فروض الثلاثيات والامتحانات الوطنية والنموذجية.
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                      <span className="text-[11px] text-[#1a3a5f] font-bold group-hover:underline">تصفح الدليل الآن ←</span>
                      <span className="text-[10px] bg-blue-50 text-[#1a3a5f] px-2 py-0.5 rounded-md font-bold font-mono">
                        {documents.filter(d => d.level === '9th').length} ملف متاح
                      </span>
                    </div>
                  </div>

                  {/* Card 2: 1st Grade Secondary */}
                  <div 
                    onClick={() => selectLevelAndOpen('1st')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-900 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="w-12 h-12 bg-blue-50 text-[#1a3a5f] rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-[#1a3a5f] group-hover:text-white transition-all">
                        10
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">السنة الأولى ثانوي</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                        انطلاقة المرحلة الثانوية الحافلة بالتحديات. تغطية تشمل الرياضيات، العلوم الطبيعية، الفيزياء، اللغة العربية وشروحات النصوص البهية.
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                      <span className="text-[11px] text-[#1a3a5f] font-bold group-hover:underline">تصفح الدليل الآن ←</span>
                      <span className="text-[10px] bg-blue-50 text-[#1a3a5f] px-2 py-0.5 rounded-md font-bold font-mono">
                        {documents.filter(d => d.level === '1st').length} ملف متاح
                      </span>
                    </div>
                  </div>

                  {/* Card 3: 2nd Grade Sciences */}
                  <div 
                    onClick={() => selectLevelAndOpen('2nd_science')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-900 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="w-12 h-12 bg-blue-50 text-[#1a3a5f] rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-[#1a3a5f] group-hover:text-white transition-all">
                        11
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">السنة الثانية علوم</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                        الركيزة الأساسية لشعب الرياضيات والعلوم لتسهيل نيل البكالوريا مستقبلاً. شروح وحلول دقيقة لكبار الفروض التونسية ومحاور الكيمياء.
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                      <span className="text-[11px] text-[#1a3a5f] font-bold group-hover:underline">تصفح الدليل الآن ←</span>
                      <span className="text-[10px] bg-blue-50 text-[#1a3a5f] px-2 py-0.5 rounded-md font-bold font-mono">
                        {documents.filter(d => d.level === '2nd_science').length} ملف متاح
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom stats banner / Quality features */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center select-none divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 shadow-sm">
                  <div className="pt-4 sm:pt-0">
                    <p className="text-3xl font-black text-[#1a3a5f]">{documents.length}</p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">مستند بيداغوجي متاح بالمنصة مجاناً</p>
                  </div>
                  <div className="pt-4 sm:pt-0">
                    <p className="text-3xl font-black text-indigo-950">{blogs.length}</p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">تفسير وشروح نصوص لغة عربية مدروسة</p>
                  </div>
                  <div className="pt-4 sm:pt-0">
                    <p className="text-3xl font-black text-emerald-800">100%</p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">إصلاح وحلول معتمدة بأساتذة متميزين</p>
                  </div>
                </div>

                {/* Leaderboard ad slot for monetization */}
                <AdSpace type="leaderboard" />
              </div>
            )}

            {/* VIEW B: LEVEL WORKSPACE DASHBOARD */}
            {viewState === 'level_dashboard' && (
              <div id="level-workspace" className="space-y-6 animate-fade-in" dir="rtl">
                
                {/* Level Title Navigation Summary */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1">تصفح الدليل التربوي :</span>
                    <h2 className="text-2xl font-extrabold text-slate-950">{getLevelLabel(selectedLevel)}</h2>
                    <p className="text-xs text-slate-500">اختر نوع الدعامة بين بنك المستندات وشروح النصوص المعنية.</p>
                  </div>

                  {/* Toggle subtabs: Documents (PDF) vs Blogs (شرح نص) */}
                  <div className="flex bg-white border border-slate-200 p-1 rounded-lg w-full md:w-auto shadow-sm">
                    <button
                      onClick={() => setActiveSubTab('docs')}
                      className={`flex-1 md:flex-none py-2 px-5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'docs'
                          ? 'bg-[#1a3a5f] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <span>بنك المستندات (PDF)</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSubTab('blogs')}
                      className={`flex-1 md:flex-none py-2 px-5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'blogs'
                          ? 'bg-[#1a3a5f] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <span>شرح نص عربية ({currentLevelBlogsCount})</span>
                    </button>
                  </div>
                </div>

                {/* SubTab workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Left Column (Main functional area depending on SubTab) */}
                  <div className="lg:col-span-3 space-y-6">
                    {activeSubTab === 'docs' ? (
                      <DocumentList
                        documents={documents}
                        level={selectedLevel}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        onOpenPreview={handleOpenPreview}
                        onOpenDownloadWaiting={handleOpenDownloadWaiting}
                      />
                    ) : (
                      <BlogReader
                        blogs={blogs}
                        selectedLevel={selectedLevel}
                      />
                    )}
                  </div>

                  {/* Right Column: Sidebar of levels for fast switching & secondary box promo ad */}
                  <div className="space-y-6">
                    {/* Quick grade switch card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-right">
                      <h4 className="font-extrabold text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">المستويات الدراسية</h4>
                      <div className="space-y-1">
                        {(['9th', '1st', '2nd_science'] as LevelType[]).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => selectLevelAndOpen(lvl)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all font-bold text-sm ${
                              selectedLevel === lvl
                                ? 'bg-[#f0f4f8] text-[#1a3a5f] font-extrabold border-r-4 border-[#1a3a5f] pr-2'
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${selectedLevel === lvl ? 'bg-[#1a3a5f]' : 'bg-slate-200'}`}></span>
                            <span>{getLevelLabel(lvl)}</span>
                            <span className="text-[10px] text-slate-400 font-mono mr-auto">
                              ({documents.filter(d => d.level === lvl).length} ملف)
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sidebar static Box Advertisement */}
                    <AdSpace type="box" />
                  </div>

                </div>

              </div>
            )}

            {/* VIEW C: ADMIN PROTECTED AREA */}
            {viewState === 'admin' && (
              <div id="admin-panel-view" className="animate-fade-in">
                <AdminPanel
                  documents={documents}
                  blogs={blogs}
                  onRefreshData={refreshData}
                />
              </div>
            )}

            {/* VIEW D: DOCUMENT PREVIEW PAGE */}
            {viewState === 'preview_doc' && selectedPreviewDoc && (
              <DocumentPreview
                doc={selectedPreviewDoc}
                onBack={() => setViewState('level_dashboard')}
                onProceedToDownload={() => {
                  setSelectedWaitingDoc(selectedPreviewDoc);
                  setViewState('waiting_download');
                }}
              />
            )}

            {/* VIEW E: COUNTDOWN WAITING DOWNLOAD GATEWAY PAGE */}
            {viewState === 'waiting_download' && selectedWaitingDoc && (
              <DownloadWaiting
                doc={selectedWaitingDoc}
                onBack={() => {
                  if (selectedPreviewDoc && selectedPreviewDoc.id === selectedWaitingDoc.id) {
                    setViewState('preview_doc');
                  } else {
                    setViewState('level_dashboard');
                  }
                }}
              />
            )}
          </>
        )}

      </main>

      {/* 3. PLATFORM GLOBAL FOOTER */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8 select-none" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="text-sm font-black text-slate-950">Devoiratna (دوفاراتنا) - منصة بيداغوجية تونسية متكاملة لعام 2026</p>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            تم الإعداد الأكاديمي والتحقق المصلّح لمجمل سلاسل التمارين وفروض المراقبة بالتطابق مع البرنامج المنظم لوزارة التربية بالجمهورية التونسية لمساندة أولادنا وبناتنا مجاناً وبأعلى جودة.
          </p>
          <div className="flex justify-center gap-4 text-xs text-slate-400 font-mono">
            <span>النسخة v2.4.0</span>
            <span>·</span>
            <span>تاريخ التعديل: يونيو 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
