/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LevelType = '9th' | '1st' | '2nd_science';

export type SectionType = 'cours' | 'series' | 'devoirs' | 'concours';

export type SubjectType = 'math' | 'science' | 'physique' | 'arabe' | 'français' | 'anglais';

export interface DocumentItem {
  id: number;
  level: LevelType;
  section_type: SectionType;
  subject: SubjectType;
  term: number | null; // 1, 2, 3 or null
  exam_type: string | null; // 'controle_1', 'controle_2', 'synthese_1', etc.
  title: string;
  github_pdf_url: string;
  github_preview_url?: string;
}

export interface BlogItem {
  id: number;
  level: LevelType;
  title: string;
  content: string; // HTML or Text content
  subject: 'arabe';
  created_at?: string;
}

export interface FilterParams {
  level: LevelType;
  section_type: SectionType;
  subject?: SubjectType;
  term?: number;
}
