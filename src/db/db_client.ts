/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { DocumentItem, BlogItem, LevelType, SectionType, SubjectType } from '../types.ts';

const { Pool } = pg;

// Check if PostgreSQL is configured
const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
let pool: any = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    pool.on('error', (err: any) => {
      console.error('Unexpected database client pool error:', err.message || err);
    });
    console.log('PostgreSQL (Neon) client initialized.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL connection pool:', err);
    pool = null;
  }
} else {
  console.log('No DATABASE_URL found. Falling back to local JSON database.');
}

// Local JSON file path fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed Data definition
const SEED_DOCUMENTS: Omit<DocumentItem, 'id'>[] = [
  // 9th Grade (رياضيات، علوم، عربية، فرنسية، إنجليزية)
  {
    level: '9th',
    section_type: 'cours',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'درس الجذاءات المعتبرة والنشر والتحليل - ملخص شامل مع أمثلة تطبيقية',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/cours_identites_remarquables.pdf'
  },
  {
    level: '9th',
    section_type: 'cours',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'درس الأعداد الحقيقية ومبرهنة طاليس في المثلث',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/cours_thales_reels.pdf'
  },
  {
    level: '9th',
    section_type: 'series',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'سلسلة تمارين عدد 2: العمليات في مجموعة الأعداد الحقيقية والقوى',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/serie_reels_operations.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'controle_1',
    title: 'فرض مراقبة عدد 1 في مادة الرياضيات - نموذج أ - مع الإصلاح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_controle1_math.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'controle_2',
    title: 'فرض مراقبة عدد 2 في مادة الرياضيات - نموذج ب بالتفصيل',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_controle2_math.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في مادة الرياضيات - هندسة مستوية وجبر',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_synthese1_math.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 2,
    exam_type: 'controle_3',
    title: 'فرض مراقبة عدد 3 في الرياضيات - الثلاثي الثاني مع الإصلاح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_controle3_math.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 2,
    exam_type: 'synthese_2',
    title: 'فرض تأليفي عدد 2 في الرياضيات - الهندسة والتحليل - نموذجي للتحضير',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_synthese2_math.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'math',
    term: 3,
    exam_type: 'synthese_3',
    title: 'فرض تأليفي عدد 3 في الرياضيات - نهاية السنة الدراسية مع الإصلاح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/devoir_synthese3_math.pdf'
  },
  {
    level: '9th',
    section_type: 'concours',
    subject: 'math',
    term: null,
    exam_type: 'concours_experimentaux',
    title: 'المناظرة التجريبية الإقليمية لشهادة ختم التعليم الأساسي - رياضيات مع الإصلاح المفصل',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/concours_blanc_2025.pdf'
  },
  {
    level: '9th',
    section_type: 'concours',
    subject: 'math',
    term: null,
    exam_type: 'concours_nationaux',
    title: 'امتحان مناظرة النوفيام الوطنية الرسمية - مادة الرياضيات دورة يونيو 2024 بالتصحيح الإداري',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/math/concours_national_2024_math.pdf'
  },
  {
    level: '9th',
    section_type: 'cours',
    subject: 'science',
    term: null,
    exam_type: null,
    title: 'درس وظيفة التنفس والهضم والامتصاص المعوي عند الإنسان بالتفصيل',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/science/cours_digestion_respiration.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'science',
    term: 1,
    exam_type: 'controle_1',
    title: 'فرض مراقبة عدد 1 في علوم الحياة والأرض - الثلاثي الأول',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/science/devoir_controle1_sciences.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'science',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في العلوم الطبيعية - الدوران والامتصاص والتنفس المصلح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/science/devoir_synthese1_sciences.pdf'
  },
  {
    level: '9th',
    section_type: 'cours',
    subject: 'arabe',
    term: null,
    exam_type: null,
    title: 'ملخص قواعد اللغة العربية للتاسعة أساسي: المنصوبات والتوابع',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/arabe/resume_grammaire_arabe.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'arabe',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في اللغة العربية (إنشاء وتحليل نص) - المحور الأول',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/arabe/devoir_synthese1_arabe.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'français',
    term: 1,
    exam_type: 'synthese_1',
    title: 'Devoir de synthèse N°1 de Français - 9ème année de base corrigé',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/fr/devoir_synthese1_francais.pdf'
  },
  {
    level: '9th',
    section_type: 'devoirs',
    subject: 'anglais',
    term: 1,
    exam_type: 'synthese_1',
    title: '9th Grade English Synthesis Test N°1 (Term 1) with key',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/9th/en/devoir_synthese1_english.pdf'
  },

  // 1ère Année Secondaire (رياضيات، علوم، فيزياء، عربية، فرنسية)
  {
    level: '1st',
    section_type: 'cours',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'درس الحساب الشعاعي والنظم السداسية في المستوي',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/math/cours_calcul_vectoriel.pdf'
  },
  {
    level: '1st',
    section_type: 'series',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'سلسلة تمارين في الجبر: القيمة المطلقة والمعادلات من الدرجة الأولى والثانية',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/math/serie_equations_abs.pdf'
  },
  {
    level: '1st',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'controle_1',
    title: 'فرض مراقبة عدد 1 في الرياضيات للسنوات الأولى ثانوي مع المصلح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/math/devoir_controle1_math.pdf'
  },
  {
    level: '1st',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في مادة الرياضيات - برنامج الثلاثي الأول في تونس',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/math/devoir_synthese1_math.pdf'
  },
  {
    level: '1st',
    section_type: 'cours',
    subject: 'physique',
    term: null,
    exam_type: null,
    title: 'درس الكهرباء: التيار الكهربائي المستمر وقوانين العقد للسنوات الأولى ثانوي',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/physics/cours_courant_continu.pdf'
  },
  {
    level: '1st',
    section_type: 'devoirs',
    subject: 'physique',
    term: 1,
    exam_type: 'controle_1',
    title: 'فرض مراقبة عدد 1 في الفيزياء والكيمياء - الأولى ثانوي مع الإصلاح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/physics/devoir_controle1_physics.pdf'
  },
  {
    level: '1st',
    section_type: 'devoirs',
    subject: 'science',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في علوم الحياة والأرض - الخلية ووظائف الاقتيات المصلح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/1st/science/devoir_synthese1_sciences.pdf'
  },

  // 2ème Année Sciences (رياضيات، فيزياء، علوم، فرنسية)
  {
    level: '2nd_science',
    section_type: 'cours',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'درس المرجح في المستوي وتطبيقاته الهندسية بالتفصيل',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/math/cours_barycentre.pdf'
  },
  {
    level: '2nd_science',
    section_type: 'series',
    subject: 'math',
    term: null,
    exam_type: null,
    title: 'سلسلة تمارين: القواسم وعلم الحساب والحدوديات - شعبة العلوم والرياضيات',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/math/serie_polynomes_arithmetique.pdf'
  },
  {
    level: '2nd_science',
    section_type: 'devoirs',
    subject: 'math',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في الرياضيات مع الجبر المصلح - الثانية علوم نموذج أ',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/math/devoir_synthese1_math.pdf'
  },
  {
    level: '2nd_science',
    section_type: 'devoirs',
    subject: 'physique',
    term: 1,
    exam_type: 'controle_1',
    title: 'فرض مراقبة عدد 1 في العلوم الفيزيائية - الطاقة الحركية والمجال المغناطيسي',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/physics/devoir_controle1_physics.pdf'
  },
  {
    level: '2nd_science',
    section_type: 'devoirs',
    subject: 'physique',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في الفيزياء والكيمياء شامل - الثلاثي الأول المصلح',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/physics/devoir_synthese1_physics.pdf'
  },
  {
    level: '2nd_science',
    section_type: 'devoirs',
    subject: 'science',
    term: 1,
    exam_type: 'synthese_1',
    title: 'فرض تأليفي عدد 1 في علوم الحياة والأرض - الانقسام المنصف والانتقال الوراثي',
    github_pdf_url: 'https://github.com/anis-hilali/tunisian-edu-pdfs/raw/main/2nd/science/devoir_synthese1_science.pdf'
  }
];

const SEED_BLOGS: Omit<BlogItem, 'id' | 'created_at'>[] = [
  {
    level: '9th',
    title: 'شرح نص: طوق الياسمين - تاسعة أساسي بالتفصيل',
    subject: 'arabe',
    content: `
      <div class="space-y-4 text-right" dir="rtl">
        <p class="font-bold text-blue-800 border-r-4 border-blue-650 pr-2 text-lg">تحليل نص طوق الياسمين لنزار قباني - محور الطبيعة</p>
        
        <div class="bg-blue-50 p-4 rounded-lg my-2 border border-blue-100">
          <p class="font-semibold text-blue-900 mb-1">1. التقديم المادي والهيكلي للقصيدة:</p>
          <p class="text-gray-700 leading-relaxed text-sm">النص عبارة عن قصيدة شعرية غنائية من نظم الشاعر السوري الكبير نزار قباني، مأخوذة من ديوانه "قصائد" وتندرج ضمن المحور الثاني: الطبيعة لتلاميذ التاسعة أساسي.</p>
        </div>

        <p class="font-semibold text-blue-900">2. الأفكار الرئيسية للقصيدة والتقسيم الهيكلي:</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-700 pr-4">
          <li><strong>المقطع الأول (من البيت 1 إلى 5):</strong> وصف طوق الياسمين وعلاقته بالمرأة وحضور الطبيعة في التفاصيل الصغيرة.</li>
          <li><strong>المقطع الثاني (من البيت 6 إلى 12):</strong> التحول في علاقة الشاعر بالطبيعة، وامتزاج المشاعر الإنسانية بجماليات الأزهار والربيع الشامي.</li>
        </ul>

        <div class="bg-gray-50 p-4 rounded-lg my-2 border border-gray-200">
          <p class="font-semibold text-gray-800 mb-1">3. الإجابة عن الأسئلة التحليلية النموذجية:</p>
          <p class="text-gray-700 leading-relaxed text-sm">
            <strong>السؤال: كيف تجلى الحوار بين الإنسان والطبيعة في الأبيات الأولى؟</strong><br>
            الجواب: تجلى الحوار عبر أنسنة الياسمين، حيث يمنح الشاعر زهرة الياسمين صفات الكائن الحي العاقل الذي يواسي، يزين، ويثري الحياة اليومية والجمالية للإنسان، مما يعبر عن وحدة وجودية حميمة بين الشاعر وعناصر الطبيعة الشامية الأصيلة.
          </p>
        </div>

        <p class="text-sm text-gray-600 bg-amber-50 p-3 rounded border-r-4 border-amber-400">تنبيه للتلاميذ: يُنصح بحفظ الأبيات الثلاثة الأولى من القصيدة لتوظيفها كشواهد في مواضيع الإنشاء حول موضوع الطبيعة وأثرها في النفس البشرية.</p>
      </div>
    `
  },
  {
    level: '9th',
    title: 'شرح نص: أغنية ريفية لـ أبو القاسم الشابي - دراسة وبنية حجاجية',
    subject: 'arabe',
    content: `
      <div class="space-y-4 text-right" dir="rtl">
        <p class="font-bold text-blue-800 border-r-4 border-blue-650 pr-2 text-lg">تحليل نص أغنية ريفية للشاعر التونسي الفذ أبو القاسم الشابي</p>
        <p class="text-gray-700 leading-relaxed text-sm">
          أغنية ريفية هي قصيدة رومانسية يترنم فيها الشابي بجمال الريف التونسي العذري بعيدًا عن ضوضاء الحاضرة وتزييف المدينة. يجسد النص فلسفة الشابي الداعية إلى الاندماج والارتباط اللامتناهي بمظاهر الربيع والخضرة والجمال الوجيز.
        </p>
        <p class="font-semibold text-blue-900">محاور الفهم الأساسية:</p>
        <p class="text-gray-700 text-sm">
          - <strong>المحور الاجتماعي والنفسي:</strong> مقارنة حادة بين نقاء الريف وتعب المدينة المتعبة نفسيًا لشاعر تونس الشاب.<br>
          - <strong>المعجم اللغوي المعتمد:</strong> المعجم الرعوي والموسيقي (الناي، الغناء، السواقي، الخراف) الذي يعطي النص طابعًا رثائيًا جماليًا عذبًا جدًا.
        </p>
        <p class="text-xs text-gray-500 italic">مُعدّ ومُنقّح من طرف أساتذة متميزين بالمعاهد التونسية للتعليم الإعدادي.</p>
      </div>
    `
  },
  {
    level: '1st',
    title: 'شرح نص: تأبين سليمان (جميل بثينة) - السنة الأولى ثانوي',
    subject: 'arabe',
    content: `
      <div class="space-y-4 text-right" dir="rtl">
        <p class="font-bold text-blue-800 border-r-4 border-blue-650 pr-2 text-lg">تحليل نص تأبين سليمان لجميل بن معمر - محور الغزل العذري</p>
        <p class="text-gray-700 leading-relaxed text-sm">
          يندرج النص في مستهل دراسة تلاميذ الأولى ثانوي لمحور الغزل العذري السامي في العهد الأموي. يتميز هذا التحليل بالوقوف عند ظاهرة الوفاء والألم الإنساني وترافق مشاعر الفراق والموت في شعر جميل بثينة.
        </p>
        <div class="bg-blue-50 p-3 rounded border border-blue-150">
          <p class="font-semibold text-blue-900 text-sm mb-1">التقسيم الإنشائي والخبري لمقاطع النص:</p>
          <p class="text-gray-700 text-xs leading-relaxed">
            - الأبيات من 1 إلى 4: الصدمة والفجيعة وتأكيد خبر الفراق والرحيل القاسي.<br>
            - الأبيات من 5 إلى 9: التغني بخصال الفارس وعلاقته المتماسكة بالحب والحرب والشرف القبلي الصارم.<br>
            - البقية: الاحتساب النفسي والاستسلام للقدر مع تمجيد الذات الوفية والخلود المعنوي.
          </p>
        </div>
      </div>
    `
  },
  {
    level: '2nd_science',
    title: 'شرح نص: الحب العذري والشرف الروحي - الثانية علوم',
    subject: 'arabe',
    content: `
      <div class="space-y-3 text-right" dir="rtl">
        <p class="font-bold text-blue-800 border-r-4 border-blue-650 pr-2 text-lg">تحليل ظاهرة الغزل العذري في أدب صدر الإسلام والعصر الأموي</p>
        <p class="text-gray-700 leading-relaxed text-sm">
          يستهدف هذا الدرس تلاميذ السنوات الثانية شعب علمية ورياضية لتبسيط الفوارق بين الغزل الإباحي المادي (بقيادة عمر بن أبي ربيعة) والغزل العذري العفيف المترفع عن الأهواء المادية الزائلة.
        </p>
        <p class="text-gray-700 leading-relaxed text-sm">
          تجدون في هذا الشرح تفصيلًا لمعاني العفة والصبر والبكاء في القصائد المدرسية المقررة، مع سرد وافي لأهم الأساليب البلاغية ونماذج الإجابة للامتحانات والمقالات التقييمية للفصل الأول من السنة الدراسية.
        </p>
      </div>
    `
  }
];

// Helper to check and initialize PostgreSQL tables
export async function initializeDatabase() {
  if (pool) {
    let client;
    try {
      client = await pool.connect();
      console.log('PostgreSQL checking tables...');
      
      // Create documents table
      await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          level VARCHAR(50) NOT NULL,
          section_type VARCHAR(50) NOT NULL,
          subject VARCHAR(50) NOT NULL,
          term INTEGER,
          exam_type VARCHAR(100),
          title VARCHAR(255) NOT NULL,
          github_pdf_url TEXT NOT NULL,
          github_preview_url TEXT
        );
      `);

      // Dynamically add column if not exists
      try {
        await client.query(`ALTER TABLE documents ADD COLUMN IF NOT EXISTS github_preview_url TEXT`);
      } catch (colErr) {
        console.log('Dynamic schema update details:', colErr);
      }

      // Create blogs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          level VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          subject VARCHAR(50) DEFAULT 'arabe' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Check if seeded
      const docCountResult = await client.query('SELECT COUNT(*) FROM documents');
      const docCount = parseInt(docCountResult.rows[0].count, 10);
      
      if (docCount === 0) {
        console.log('Seeding PostgreSQL database with authentic documents...');
        for (const doc of SEED_DOCUMENTS) {
          await client.query(
            'INSERT INTO documents (level, section_type, subject, term, exam_type, title, github_pdf_url, github_preview_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [doc.level, doc.section_type, doc.subject, doc.term, doc.exam_type, doc.title, doc.github_pdf_url, doc.github_preview_url || '']
          );
        }
      }

      const blogCountResult = await client.query('SELECT COUNT(*) FROM blogs');
      const blogCount = parseInt(blogCountResult.rows[0].count, 10);

      if (blogCount === 0) {
        console.log('Seeding PostgreSQL database with authentic explanation blogs (شرح نص)...');
        for (const blog of SEED_BLOGS) {
          await client.query(
            'INSERT INTO blogs (level, title, content, subject) VALUES ($1, $2, $3, $4)',
            [blog.level, blog.title, blog.content, blog.subject]
          );
        }
      }

      console.log('PostgreSQL tables initialized and seeded successfully.');
    } catch (err) {
      console.error('Failed to automatically create PostgreSQL tables/seeding, will use fallback locally:', err);
      // Disable pool to avoid slower API response timings on subsequent queries
      pool = null;
    } finally {
      if (client) client.release();
    }
  }

  // Always make sure local JSON is initialized as fallback or active db
  if (!fs.existsSync(DB_FILE)) {
    console.log('Initializing local JSON database fallback with seed data...');
    const dbData = {
      documents: SEED_DOCUMENTS.map((doc, idx) => ({ id: idx + 1, ...doc })),
      blogs: SEED_BLOGS.map((blog, idx) => ({ id: idx + 1, ...blog, created_at: new Date().toISOString() }))
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log('Local JSON database initialized successfully at', DB_FILE);
  } else {
    // Optionally backport new seeded values if needed
    try {
      const current = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!current.documents || current.documents.length === 0) {
        current.documents = SEED_DOCUMENTS.map((doc, idx) => ({ id: idx + 1, ...doc }));
        fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2), 'utf-8');
      }
      if (!current.blogs) {
        current.blogs = SEED_BLOGS.map((blog, idx) => ({ id: idx + current.documents.length + 1, ...blog, created_at: new Date().toISOString() }));
        fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error verifying local db file structure:', e);
    }
  }
}

// Read database functions
export async function getDocuments(): Promise<DocumentItem[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM documents ORDER BY id DESC');
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL getDocuments failed, using JSON local fallback:', err);
    }
  }

  // Fallback to JSON file
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return data.documents || [];
  } catch (err) {
    console.error('JSON DB read failed:', err);
    return [];
  }
}

export async function addDocument(doc: Omit<DocumentItem, 'id'>): Promise<DocumentItem> {
  if (pool) {
    try {
      const query = `
        INSERT INTO documents (level, section_type, subject, term, exam_type, title, github_pdf_url, github_preview_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const res = await pool.query(query, [
        doc.level,
        doc.section_type,
        doc.subject,
        doc.term,
        doc.exam_type,
        doc.title,
        doc.github_pdf_url,
        doc.github_preview_url || ''
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('PostgreSQL addDocument failed, trying local JSON write instead:', err);
    }
  }

  // Local JSON fallback write
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const id = data.documents.length > 0 ? Math.max(...data.documents.map((d: any) => d.id)) + 1 : 1;
    const newDoc: DocumentItem = { id, ...doc, github_preview_url: doc.github_preview_url || '' };
    data.documents.unshift(newDoc); // Prepend new document
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return newDoc;
  } catch (err) {
    console.error('JSON DB write failed:', err);
    throw new Error('Database insertion failed');
  }
}

export async function deleteDocument(id: number): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query('DELETE FROM documents WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error('PostgreSQL deleteDocument failed, using local JSON:', err);
    }
  }

  // Fallback
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const initialLen = data.documents.length;
    data.documents = data.documents.filter((d: any) => d.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return data.documents.length < initialLen;
  } catch (err) {
    console.error('JSON DB delete document failed:', err);
    return false;
  }
}

// Blog functions (شرح نص)
export async function getBlogs(): Promise<BlogItem[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM blogs ORDER BY id DESC');
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL getBlogs failed, using JSON local fallback:', err);
    }
  }

  // Fallback to JSON
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return data.blogs || [];
  } catch (err) {
    console.error('JSON getBlogs read failed:', err);
    return [];
  }
}

export async function addBlog(blog: Omit<BlogItem, 'id' | 'created_at'>): Promise<BlogItem> {
  if (pool) {
    try {
      const query = `
        INSERT INTO blogs (level, title, content, subject)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const res = await pool.query(query, [
        blog.level,
        blog.title,
        blog.content,
        blog.subject || 'arabe'
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('PostgreSQL addBlog failed, trying local JSON write instead:', err);
    }
  }

  // Local JSON write
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const id = data.blogs.length > 0 ? Math.max(...data.blogs.map((b: any) => b.id)) + 1 : 1;
    const newBlog: BlogItem = {
      id,
      ...blog,
      subject: 'arabe',
      created_at: new Date().toISOString()
    };
    data.blogs.unshift(newBlog);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return newBlog;
  } catch (err) {
    console.error('JSON DB addBlog failed:', err);
    throw new Error('Database blog insertion failed');
  }
}

export async function deleteBlog(id: number): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error('PostgreSQL deleteBlog failed, using local JSON:', err);
    }
  }

  // Fallback
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const initialLen = data.blogs.length;
    data.blogs = data.blogs.filter((b: any) => b.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return data.blogs.length < initialLen;
  } catch (err) {
    console.error('JSON DB deleteBlog failed:', err);
    return false;
  }
}
