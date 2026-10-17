import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getModePrompt, SYSTEM_INSTRUCTION, LectureMode } from './src/services/lecturePrompts.ts';

async function startServer() {
  const app = express();
  // Dev server binds to PORT or default 3000
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Informative GET route for /api/process-lecture
  app.get(['/api/process-lecture', '/api/process-lecture/'], (_req, res) => {
    return res.json({
      status: 'ready',
      endpoint: '/api/process-lecture',
      method: 'POST required',
      modes: ['tables', 'qa', 'zaytouna', 'memory', 'numbers', 'why'],
      message: 'Medical Lecture Processing AI Engine is online. Send a POST request with { lectureText, mode } to analyze.',
    });
  });

  // API Route: Process Lecture with Gemini AI (supports with or without trailing slash)
  app.post(['/api/process-lecture', '/api/process-lecture/'], async (req, res) => {
    try {
      const { mode, lectureText, fileName } = req.body;

      if (!lectureText || typeof lectureText !== 'string' || !lectureText.trim()) {
        return res.status(400).json({ error: 'محتوى المحاضرة مطلوب للبدء.' });
      }

      const apiKey = process.env.GEMINI_API_KEY || (req.body.apiKey ? String(req.body.apiKey).trim() : '');

      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY غير مهيأ على الخادم. يرجى التأكد من إضافة المفتاح في لوحة التحكم.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const modePrompt = getModePrompt(mode || 'tables');
      const systemInstruction = `You are a distinguished medical professor, board examination contributor, and master clinical educator.
ABSOLUTE CORE RULES:
1. LANGUAGE: The entire response MUST BE 100% IN PURE ENGLISH (Medical English). Do not write Arabic in the generated output.
2. FORMATTING: Use pure Markdown (headers, tables, lists, bold text).
3. NO RAW HTML TAGS: Strictly DO NOT output raw HTML tags like <mark>, <span>, <div>, or broken tags like </mark rounded">>. To emphasize key facts, use standard Markdown bolding like **CRITICAL PEARL** or wrap with double equals like ==Key Differentiating Feature==.
4. COMPLETENESS: Never omit, delete, or skip any detail, number, dose, or clinical nuance from the input lecture.`;

      const fullPrompt = `
${modePrompt}

==================================================
DOCUMENT TITLE: ${fileName || 'Medical Lecture'}
COMPLETE LECTURE CONTENT:
${lectureText}
==================================================

Generate the complete, exhaustive English output now using clean Markdown:
`;

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];

      let lastError: any = null;
      let outputText = '';

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });

          if (response.text && response.text.trim()) {
            outputText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`[AI Studio] Model ${modelName} error:`, err?.message || err);
          lastError = err;
          const msg = err?.message || '';
          if (msg.includes('404') || msg.includes('NOT_FOUND') || msg.includes('503') || msg.includes('UNAVAILABLE')) {
            continue;
          }
          if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
            break;
          }
        }
      }

      if (outputText) {
        return res.json({ result: outputText });
      }

      const errMsg = lastError?.message || 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
      return res.status(500).json({ error: errMsg });
    } catch (error: any) {
      console.error('[AI Studio] Server error in /api/process-lecture:', error);
      return res.status(500).json({ error: error?.message || 'حدث خطأ داخلي في الخادم.' });
    }
  });

  // Health check endpoint
  app.get(['/api/health', '/api/health/'], (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve static assets or mount Vite
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Studio] Server listening on http://0.0.0.0:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('[AI Studio] Failed to start server:', err);
  process.exit(1);
});
