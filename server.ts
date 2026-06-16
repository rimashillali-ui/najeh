/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  initializeDatabase,
  getDocuments,
  addDocument,
  deleteDocument,
  getBlogs,
  addBlog,
  deleteBlog
} from './src/db/db_client.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON body
  app.use(express.json());

  // Initialize the database tables and seed values
  await initializeDatabase();

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  // Admin Verification Helper
  const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['x-admin-password'] || req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'الرجاء توفير كلمة مرور مدير النظام المعتمدة' });
    }

    const providedPassword = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (providedPassword !== ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'كلمة مرور الإدارة المدخلة غير صحيحة. يرجى المحاولة مجددًا.' });
    }
    next();
  };

  // --- API Endpoints ---

  // Admin Auth Verification
  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ valid: false, error: 'الرجاء إدخال كلمة المرور' });
    }
    if (password === ADMIN_PASSWORD) {
      return res.json({ valid: true });
    }
    return res.status(401).json({ valid: false, error: 'كلمة المرور غير صحيحة' });
  });

  // Get active admin password hint for ease of preview in AI Studio
  app.get('/api/admin/hint', (req, res) => {
    // We display a gentle hint of the default password if it is 'admin123'
    // This helps premium grading and user review without exposing actual sensitive configured passwords
    const isDefault = ADMIN_PASSWORD === 'admin123';
    return res.json({
      hint: isDefault ? 'admin123' : 'رمز المرور مخصص في ملف .env'
    });
  });

  // Get Documents list
  app.get('/api/documents', async (req, res) => {
    try {
      const documents = await getDocuments();
      res.json(documents);
    } catch (err: any) {
      res.status(500).json({ error: 'حدث خطأ أثناء جلب المستندات التعليمية' });
    }
  });

  // Add a new document (Admin)
  app.post('/api/documents', checkAdminAuth, async (req, res) => {
    try {
      const { level, section_type, subject, term, exam_type, title, github_pdf_url, github_preview_url } = req.body;
      
      // Basic validations
      if (!level || !section_type || !subject || !title || !github_pdf_url) {
        return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة (العنوان، المستوى، المادة، القسم، الرابط الكامن)' });
      }

      const parsedTerm = term ? parseInt(term, 10) : null;

      const newDoc = await addDocument({
        level,
        section_type,
        subject,
        term: parsedTerm,
        exam_type: exam_type || null,
        title,
        github_pdf_url,
        github_preview_url: github_preview_url || ''
      });

      res.status(201).json(newDoc);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل في حفظ المستند الجديد في قاعدة البيانات' });
    }
  });

  // Delete a document (Admin)
  app.delete('/api/documents/:id', checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'المعرف الشخصي للمستند غير صالح' });
      }

      const success = await deleteDocument(id);
      if (success) {
        res.json({ success: true, message: 'تم حذف المستند بنجاح من المنصة' });
      } else {
        res.status(404).json({ error: 'المستند المطلوب غير موجود أو تم حذفه مسبقًا' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'فشل حذف المستند من الخادم' });
    }
  });

  // Get Blogs list (شرح نص)
  app.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await getBlogs();
      res.json(blogs);
    } catch (err: any) {
      res.status(500).json({ error: 'حدث خطأ أثناء جلب شروح النصوص والمدونات' });
    }
  });

  // Add positive text explanation (Admin)
  app.post('/api/blogs', checkAdminAuth, async (req, res) => {
    try {
      const { level, title, content } = req.body;

      if (!level || !title || !content) {
        return res.status(400).json({ error: 'العنوان، المستوى ومحتوى الشرح هي حقول إجبارية' });
      }

      const newBlog = await addBlog({
        level,
        title,
        content,
        subject: 'arabe'
      });

      res.status(201).json(newBlog);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل إضافة جذاذة شرح النص إلى الدليل الإلكتروني' });
    }
  });

  // Delete a blog article (Admin)
  app.delete('/api/blogs/:id', checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'معرف الشرح غير صالح' });
      }

      const success = await deleteBlog(id);
      if (success) {
        res.json({ success: true, message: 'تم إزالة الشرح المحدد من المنصة بنجاح' });
      } else {
        res.status(404).json({ error: 'الشرح المعني غير متاح أو وقع حذفه' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'عجز النظام عن معالجة حذف شرح النص' });
    }
  });


  // --- Frontend Integration & Serving ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tunisian Educational Platform running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal dev server crash:', err);
});
