import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getModePrompt, SYSTEM_INSTRUCTION, LectureMode } from './src/services/lecturePrompts.ts';
import { ARTICLES } from './src/data/articles.ts';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function injectArticleMeta(template: string, article: any, host: string, protocol: string): string {
  const origin = `${protocol}://${host || 'ais-pre-qq4lp6jybvwqicgxdgnjlm-245605164787.europe-west1.run.app'}`;
  const articleUrl = `${origin}/article/${article.id}`;
  const pageTitle = `${article.arabicTitle} | د. عبدالرحمن يونس`;
  const desc = article.summary;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "headline": article.arabicTitle,
    "description": desc,
    "articleSection": article.category,
    "image": `${origin}/og-image.png`,
    "author": {
      "@type": "Person",
      "name": "د. عبدالرحمن يونس",
      "jobTitle": "طبيب وباحث في تقنيات المذاكرة الطبية والذكاء الاصطناعي"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Abdelrhman Ai",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/icon-512.png`
      }
    },
    "datePublished": "2025-01-01",
    "dateModified": "2026-10-23"
  };

  let updated = template;

  // Replace Title
  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  
  // Replace description
  updated = updated.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(desc)}" />`);

  // Replace og:title
  updated = updated.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);

  // Replace og:description
  updated = updated.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(desc)}" />`);

  // Replace twitter:title
  updated = updated.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`);

  // Replace twitter:description
  updated = updated.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(desc)}" />`);

  // Inject additional SEO tags: canonical, og:url, og:type, robots, JSON-LD
  const injectedHead = `
    <!-- Search Engine Indexing & Canonical Link -->
    <link rel="canonical" href="${articleUrl}" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:type" content="article" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
    </script>
  `;

  updated = updated.replace('</head>', `${injectedHead}\n  </head>`);

  // Semantic Crawlable Article content inside #root for search engine indexing bots
  const preRendered = `
    <main style="display:none" class="seo-crawler-content" aria-hidden="true">
      <article itemscope itemtype="https://schema.org/Article">
        <header>
          <span itemprop="articleSection">${escapeHtml(article.category)}</span>
          <h1 itemprop="headline">${escapeHtml(article.arabicTitle)}</h1>
          <p itemprop="description">${escapeHtml(article.summary)}</p>
        </header>
        <div itemprop="articleBody">
          ${article.content.map((p: string) => `<p>${escapeHtml(p)}</p>`).join('\n          ')}
        </div>
      </article>
    </main>
  `;

  updated = updated.replace('<div id="root"></div>', `<div id="root">${preRendered}</div>`);

  return updated;
}

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

  // Sitemap.xml for search engines & indexing crawlers
  app.get(['/sitemap.xml', '/sitemap'], (_req, res) => {
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      return res.sendFile(sitemapPath);
    }
    return res.status(404).send('Sitemap not found');
  });

  // Robots.txt for search engines
  app.get('/robots.txt', (_req, res) => {
    const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      return res.sendFile(robotsPath);
    }
    return res.status(404).send('User-agent: *\nAllow: /\n');
  });

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

  // API Route: Process Lecture with Gemini AI (Server-Side with real-time streaming SSE & non-streaming support)
  app.post(['/api/process-lecture', '/api/process-lecture/', '/api/process-lecture-stream'], async (req, res) => {
    const isStreamRequested = 
      req.query.stream === 'true' || 
      req.body.stream === true || 
      req.path.includes('stream') ||
      Boolean(req.headers.accept && req.headers.accept.includes('text/event-stream'));

    let isClientClosed = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        isClientClosed = true;
      }
    });

    try {
      const { mode, lectureText, fileName } = req.body;

      if (!lectureText || typeof lectureText !== 'string' || !lectureText.trim()) {
        if (isStreamRequested) {
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.write(`data: ${JSON.stringify({ error: 'محتوى المحاضرة مطلوب للبدء.' })}\n\n`);
          return res.end();
        }
        return res.status(400).json({ error: 'محتوى المحاضرة مطلوب للبدء.' });
      }

      const userProvidedKey = req.body.apiKey ? String(req.body.apiKey).trim() : '';
      const serverKey = process.env.GEMINI_API_KEY ? String(process.env.GEMINI_API_KEY).trim() : '';
      const apiKey = userProvidedKey || serverKey;

      if (!apiKey) {
        const keyErr = 'لم يتم العثور على مفتاح Gemini API في الخادم. يرجى ضبط GEMINI_API_KEY في إعدادات الخادم أو إدخال مفتاح في الواجهة.';
        if (isStreamRequested) {
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.write(`data: ${JSON.stringify({ error: keyErr })}\n\n`);
          return res.end();
        }
        return res.status(500).json({ error: keyErr });
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
      const systemInstruction = SYSTEM_INSTRUCTION;

      const fullPrompt = `
${modePrompt}

==================================================
DOCUMENT TITLE: ${fileName || 'Medical Lecture'}
COMPLETE LECTURE CONTENT:
${lectureText}
==================================================

CORE REQUIREMENTS:
- Provide exhaustive, university-level medical details, comprehensive tables, in-depth pathophysiological mechanisms, and complete clinical breakdowns without any omissions or shortcuts.
- ABSOLUTE WORD COUNT MANDATE: The total output MUST NOT BE LESS THAN 1,500 WORDS (aim for 1,500 - 3,000 words). Thoroughly expand every clinical detail, mechanism, table cell, or memory anchor so the output is rich, complete, and exhaustive.
- STRICTLY DO NOT output emojis, arrows (-> or -->), or decorative symbols (such as ==). Use pure clean text, bold keywords, and neat tables.

Generate the complete, exhaustive English output now using clean Markdown:
`;

      const candidateModels = userProvidedKey
        ? ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
        : ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash'];

      if (isStreamRequested) {
        res.socket?.setNoDelay(true);
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') {
          res.flushHeaders();
        }

        // Send start event
        res.write(`data: ${JSON.stringify({ type: 'start', message: 'connected' })}\n\n`);

        let streamedText = '';
        let streamSuccess = false;
        let lastStreamError: any = null;

        for (const modelName of candidateModels) {
          if (isClientClosed) break;
          try {
            const config: any = {
              systemInstruction,
            };
            if (modelName === 'gemini-3.8-flash' || modelName === 'gemini-flash-latest') {
              config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
            }

            const streamResponse = await ai.models.generateContentStream({
              model: modelName,
              contents: fullPrompt,
              config,
            });

            for await (const chunk of streamResponse) {
              if (isClientClosed) break;
              const text = chunk.text;
              if (text) {
                streamedText += text;
                res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
                if (typeof (res as any).flush === 'function') {
                  (res as any).flush();
                }
              }
            }

            if (streamedText.trim().length > 0) {
              streamSuccess = true;
              break;
            }
          } catch (err: any) {
            console.warn(`[AI Studio Server] Streaming Model ${modelName} error:`, err?.message || err);
            lastStreamError = err;
            const msg = (err?.message || '').toLowerCase();
            if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
              break;
            }
            continue;
          }
        }

        // If streaming did not succeed, fallback to generateContent and push in chunks
        if (!streamSuccess && !isClientClosed) {
          console.warn('[AI Studio Server] Streaming failed, falling back to generateContent with chunked SSE delivery...');
          for (const modelName of candidateModels) {
            if (isClientClosed) break;
            try {
              const config: any = {
                systemInstruction,
              };
              if (modelName === 'gemini-3.8-flash' || modelName === 'gemini-flash-latest') {
                config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
              }

              const response = await ai.models.generateContent({
                model: modelName,
                contents: fullPrompt,
                config,
              });

              if (response.text && response.text.trim()) {
                const fullText = response.text;
                const pieces = fullText.match(/.{1,120}/gs) || [fullText];
                for (const piece of pieces) {
                  if (isClientClosed) break;
                  streamedText += piece;
                  res.write(`data: ${JSON.stringify({ type: 'chunk', text: piece })}\n\n`);
                  if (typeof (res as any).flush === 'function') {
                    (res as any).flush();
                  }
                  await new Promise((r) => setTimeout(r, 15));
                }
                streamSuccess = true;
                break;
              }
            } catch (err: any) {
              lastStreamError = err;
              continue;
            }
          }
        }

        if (streamSuccess && !isClientClosed) {
          res.write(`data: ${JSON.stringify({ type: 'done', fullText: streamedText })}\n\n`);
          res.write('data: [DONE]\n\n');
          return res.end();
        }

        if (!isClientClosed) {
          const rawErrMsg = lastStreamError?.message || 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
          res.write(`data: ${JSON.stringify({ type: 'error', error: rawErrMsg })}\n\n`);
          return res.end();
        }
        return;
      }

      // Non-streaming fallback path (standard JSON POST)
      let lastError: any = null;
      let outputText = '';

      for (const modelName of candidateModels) {
        try {
          const config: any = {
            systemInstruction,
          };
          if (modelName === 'gemini-3.8-flash' || modelName === 'gemini-flash-latest') {
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config,
          });

          if (response.text && response.text.trim()) {
            outputText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`[AI Studio Server] Model ${modelName} error:`, err?.message || err);
          lastError = err;
          const msg = (err?.message || '').toLowerCase();
          if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
            break;
          }
          continue;
        }
      }

      if (outputText) {
        return res.json({ result: outputText });
      }

      const rawErrMsg = lastError?.message || '';
      let errMsg = 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
      if (rawErrMsg.includes('PROXY_GENERATION_DISABLED') || rawErrMsg.includes('streamGenerateContent')) {
        errMsg = 'خطأ في إعدادات الاتصال بنموذج الذكاء الاصطناعي. تم تحديث طريقة الاتصال لتكون متوافقة تماماً.';
      } else if (rawErrMsg.includes('429') || rawErrMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = 'تم بلوغ حد الاستخدام المؤقت للنموذج، يُرجى الانتظار قليلاً ثم إعادة المحاولة.';
      } else if (rawErrMsg) {
        errMsg = rawErrMsg;
      }

      return res.status(500).json({ error: errMsg });
    } catch (error: any) {
      console.error('[AI Studio Server] Error in /api/process-lecture:', error);
      if (isStreamRequested && !res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.write(`data: ${JSON.stringify({ type: 'error', error: error?.message || 'حدث خطأ داخلي في الخادم.' })}\n\n`);
        return res.end();
      }
      return res.status(500).json({ error: error?.message || 'حدث خطأ داخلي في الخادم.' });
    }
  });

  // Health check endpoint
  app.get(['/api/health', '/api/health/'], (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  let vite: ViteDevServer | null = null;
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

function injectLegalPageMeta(template: string, tab: string, host: string, protocol: string): string {
  const origin = `${protocol}://${host || 'ais-pre-qq4lp6jybvwqicgxdgnjlm-245605164787.europe-west1.run.app'}`;
  const legalTitles: Record<string, string> = {
    privacy: 'سياسة الخصوصية (Privacy Policy) | د. عبدالرحمن يونس',
    terms: 'شروط الاستخدام (Terms of Service) | د. عبدالرحمن يونس',
    disclaimer: 'إخلاء المسؤولية الطبية والأكاديمية (Medical Disclaimer) | د. عبدالرحمن يونس',
    about: 'من نحن (About Us) | د. عبدالرحمن يونس',
    contact: 'اتصل بنا (Contact Us) | د. عبدالرحمن يونس',
  };
  const legalDescriptions: Record<string, string> = {
    privacy: 'سياسة الخصوصية لموقع د. عبدالرحمن يونس متوافقة مع شروط Google AdSense واستخدام ملفات تعريف الارتباط DART ومعايير حماية البيانات.',
    terms: 'شروط وأحكام استخدام موقع ومنظومة د. عبدالرحمن يونس للمذاكرة بالذكاء الاصطناعي واستخدام الـ AI Gems.',
    disclaimer: 'إخلاء المسؤولية الطبية: المنصة مخصصة فقط لتطوير أساليب الاستذكار لطلاب الطب، وليست بديلاً عن الاستشارة والتشخيص السريري.',
    about: 'نبذة عن د. عبدالرحمن يونس، طالب كلية الطب ومطور أدوات الذكاء الاصطناعي ومنظومة المذاكرة الذكية.',
    contact: 'بيانات التواصل الرسمية مع د. عبدالرحمن يونس عبر البريد الإلكتروني المعتمد abdoyounes1011@gmail.com والواتساب وتيليجرام.',
  };

  const title = legalTitles[tab] || 'المعلومات القانونية والسياسات | د. عبدالرحمن يونس';
  const desc = legalDescriptions[tab] || 'سياسات ومعلومات منصة د. عبدالرحمن يونس.';
  const pageUrl = `${origin}/${tab}`;

  let updated = template;
  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  updated = updated.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${escapeHtml(desc)}" />`);
  updated = updated.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  updated = updated.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(desc)}" />`);

  const injectedHead = `
    <link rel="canonical" href="${pageUrl}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta name="robots" content="index, follow" />
  `;
  updated = updated.replace('</head>', `${injectedHead}\n  </head>`);
  return updated;
}

  // Dedicated Route for Individual Articles (SEO Crawlers & Indexing)
  app.get(['/article/:id', '/articles/:id'], async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const article = ARTICLES.find((a) => a.id === articleId);

      const templatePath = isDev 
        ? path.resolve(__dirname, 'index.html') 
        : path.resolve(__dirname, 'dist', 'index.html');

      if (!fs.existsSync(templatePath)) {
        return next();
      }

      let html = fs.readFileSync(templatePath, 'utf-8');

      if (article) {
        const proto = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : req.protocol;
        const host = req.get('host') || '';
        html = injectArticleMeta(html, article, host, proto);
      }

      if (isDev && vite) {
        html = await vite.transformIndexHtml(req.originalUrl, html);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (err) {
      console.error('[SEO Article Route Error]:', err);
      next(err);
    }
  });

  // Dedicated Routes for Legal Pages (AdSense Compliance Reviewers & Crawlers)
  app.get([
    '/privacy', '/privacy-policy',
    '/terms', '/terms-of-service',
    '/disclaimer', '/medical-disclaimer',
    '/about', '/about-us',
    '/contact', '/contact-us'
  ], async (req, res, next) => {
    try {
      let tab = 'privacy';
      const p = req.path.toLowerCase();
      if (p.includes('term')) tab = 'terms';
      else if (p.includes('disclaimer')) tab = 'disclaimer';
      else if (p.includes('about')) tab = 'about';
      else if (p.includes('contact')) tab = 'contact';

      const templatePath = isDev 
        ? path.resolve(__dirname, 'index.html') 
        : path.resolve(__dirname, 'dist', 'index.html');

      if (!fs.existsSync(templatePath)) return next();

      let html = fs.readFileSync(templatePath, 'utf-8');
      const proto = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : req.protocol;
      const host = req.get('host') || '';
      html = injectLegalPageMeta(html, tab, host, proto);

      if (isDev && vite) {
        html = await vite.transformIndexHtml(req.originalUrl, html);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (err) {
      console.error('[SEO Legal Route Error]:', err);
      next(err);
    }
  });

  // Serve static assets or mount Vite
  if (isDev && vite) {
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
