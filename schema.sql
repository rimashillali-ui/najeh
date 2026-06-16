-- --------------------------------------------------------
-- Schema de base de données pour la plateforme éducative Tunisienne
-- Compatible avec Neon Postgres / PostgreSQL
-- --------------------------------------------------------

-- Séquence pour la table 'documents'
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL, -- '9th', '1st', '2nd_science'
    section_type VARCHAR(50) NOT NULL, -- 'cours', 'series', 'devoirs', 'concours'
    subject VARCHAR(50) NOT NULL, -- 'math', 'science', 'physique', 'arabe', 'français', 'anglais'
    term INTEGER, -- 1, 2, 3
    exam_type VARCHAR(100), -- 'controle_1', 'controle_2', 'synthese_1', etc.
    title VARCHAR(255) NOT NULL,
    github_pdf_url TEXT NOT NULL
);

-- Table pour les explications de textes / articles de blog (شرح نص)
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL, -- '9th', '1st', '2nd_science'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Contenu textuel / HTML
    subject VARCHAR(50) DEFAULT 'arabe' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les filtrages fréquents
CREATE INDEX IF NOT EXISTS idx_documents_filtering ON documents(level, section_type, subject);
CREATE INDEX IF NOT EXISTS idx_blogs_level ON blogs(level);

-- --------------------------------------------------------
-- Exemple de données initiales pour démarrer (Optionnel)
-- --------------------------------------------------------

-- Exemple d'un cours de mathématiques (9ème Année)
-- INSERT INTO documents (level, section_type, subject, term, exam_type, title, github_pdf_url)
-- VALUES ('9th', 'cours', 'math', NULL, NULL, 'درس الجذاءات المعتبرة والنشر والتحليل', 'https://github.com/example/files/raw/main/9th/math/cours1.pdf');

-- Exemple d'un Devoir de contrôle n°1 (9ème Année)
-- INSERT INTO documents (level, section_type, subject, term, exam_type, title, github_pdf_url)
-- VALUES ('9th', 'devoirs', 'math', 1, 'controle_1', 'فرض مراقبة عدد 1 في الرياضيات', 'https://github.com/example/files/raw/main/9th/math/controle1_1.pdf');

-- Exemple d'un article de شرح نص (السنة الأولى ثانوي)
-- INSERT INTO blogs (level, title, content, subject)
-- VALUES ('1st', 'شرح نص: تأبين سليمان', '<p>التحليل الهيكلي والمعنوي لنص تأبين سليمان لجميل بثينة للسن الأولى ثانوي ومحاور الإجابة عن الأسئلة.</p>', 'arabe');
