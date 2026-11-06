import express from 'express';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getModePrompt, SYSTEM_INSTRUCTION, type LectureMode } from './src/services/lecturePrompts.ts';
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

function formatGeminiErrorMessage(raw: unknown): string {
  if (!raw) return 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
  let text = typeof raw === 'string' ? raw : '';
  
  if (typeof raw === 'object') {
    const anyObj = raw as any;
    text = anyObj?.message || anyObj?.error?.message || anyObj?.error || '';
    if (!text) {
      try {
        text = JSON.stringify(raw);
      } catch {
        text = String(raw);
      }
    }
  }

  // Handle nested stringified JSON error payloads
  let attempts = 0;
  while (attempts < 3 && typeof text === 'string' && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
    attempts++;
    try {
      const parsed = JSON.parse(text.trim());
      if (typeof parsed === 'string') {
        text = parsed;
      } else if (parsed && typeof parsed === 'object') {
        text = parsed.error?.message || parsed.message || parsed.error || JSON.stringify(parsed);
      }
    } catch {
      break;
    }
  }

  const lower = String(text || '').toLowerCase();
  if (
    lower.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('unavailable') ||
    lower.includes('spikes in demand') ||
    lower.includes('overloaded')
  ) {
    return 'نموذج الذكاء الاصطناعي يواجه ضغطاً مؤقتاً في هذه اللحظة (High Demand). Spikes in demand are temporary. يُرجى الانتظار بضع ثوانٍ ثم الضغط على "إعادة المحاولة".';
  }

  if (
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('rate limit')
  ) {
    return 'تم بلوغ حد الاستخدام المؤقت للنموذج (Rate Limit). يُرجى الانتظار دقيقة واحدة ثم إعادة المحاولة.';
  }

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('invalid api key')) {
    return 'مفتاح الـ API غير صالح أو انتهت صلاحيته.';
  }

  return String(text || 'حدث خطأ أثناء معالجة المحاضرة.');
}

async function startServer() {
  const app = express();
  const portArgIdx = process.argv.indexOf('--port') !== -1 ? process.argv.indexOf('--port') : process.argv.indexOf('-p');
  const portFromArg = portArgIdx !== -1 && process.argv[portArgIdx + 1] ? parseInt(process.argv[portArgIdx + 1], 10) : null;
  // When AI Studio launches dev server, it passes --port 3000 explicitly via CLI args.
  // When running on Cloud Run or in production, PORT is passed via process.env.PORT (8080).
  const PORT = portFromArg || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

  const hostArgIdx = process.argv.indexOf('--host') !== -1 ? process.argv.indexOf('--host') : process.argv.indexOf('-h');
  const HOST = hostArgIdx !== -1 && process.argv[hostArgIdx + 1] ? process.argv[hostArgIdx + 1] : '0.0.0.0';

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
  // Serve public directory assets (pdf worker, icons, robots, sitemap)
  app.use(express.static(path.resolve(__dirname, 'public')));

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
  app.post(['/api/process-lecture', '/api/process-lecture/', '/api/process-lecture/*', '/api/process-lecture-stream'], async (req, res) => {
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

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

        // Perform 2 passes across candidate models with backoff delay on 503/429
        streamLoop: for (let pass = 0; pass < 2; pass++) {
          if (pass > 0) {
            console.warn(`[AI Studio Server] Pass 1 hit high demand / errors, pausing 2000ms before pass ${pass + 1}...`);
            await sleep(2000);
          }

          for (const modelName of candidateModels) {
            if (isClientClosed) break streamLoop;
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
                if (isClientClosed) break streamLoop;
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
                break streamLoop;
              }
            } catch (err: any) {
              const errMsg = String(err?.message || err?.error || err || '');
              console.warn(`[AI Studio Server] Streaming Model ${modelName} error:`, errMsg);
              lastStreamError = err;

              const lower = errMsg.toLowerCase();
              if (lower.includes('api_key_invalid') || lower.includes('api key not valid')) {
                break streamLoop;
              }

              // If model is experiencing 503 high demand or 429 rate limit, pause briefly before next model
              if (
                lower.includes('503') ||
                lower.includes('high demand') ||
                lower.includes('unavailable') ||
                lower.includes('resource_exhausted') ||
                lower.includes('429')
              ) {
                await sleep(1200);
              }
              continue;
            }
          }
        }

        // If streaming did not succeed, fallback to generateContent and push in chunks
        if (!streamSuccess && !isClientClosed) {
          console.warn('[AI Studio Server] Streaming failed, falling back to generateContent with chunked SSE delivery...');
          contentLoop: for (let pass = 0; pass < 2; pass++) {
            if (pass > 0) {
              await sleep(2000);
            }

            for (const modelName of candidateModels) {
              if (isClientClosed) break contentLoop;
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
                    if (isClientClosed) break contentLoop;
                    streamedText += piece;
                    res.write(`data: ${JSON.stringify({ type: 'chunk', text: piece })}\n\n`);
                    if (typeof (res as any).flush === 'function') {
                      (res as any).flush();
                    }
                    await sleep(15);
                  }
                  streamSuccess = true;
                  break contentLoop;
                }
              } catch (err: any) {
                const errMsg = String(err?.message || err?.error || err || '');
                lastStreamError = err;
                const lower = errMsg.toLowerCase();
                if (lower.includes('api_key_invalid') || lower.includes('api key not valid')) {
                  break contentLoop;
                }
                if (
                  lower.includes('503') ||
                  lower.includes('high demand') ||
                  lower.includes('unavailable') ||
                  lower.includes('429')
                ) {
                  await sleep(1200);
                }
                continue;
              }
            }
          }
        }

        if (streamSuccess && !isClientClosed) {
          res.write(`data: ${JSON.stringify({ type: 'done', fullText: streamedText })}\n\n`);
          res.write('data: [DONE]\n\n');
          return res.end();
        }

        if (!isClientClosed) {
          const formattedErr = formatGeminiErrorMessage(lastStreamError);
          res.write(`data: ${JSON.stringify({ type: 'error', error: formattedErr })}\n\n`);
          return res.end();
        }
        return;
      }

      // Non-streaming fallback path (standard JSON POST)
      let lastError: any = null;
      let outputText = '';

      nonStreamLoop: for (let pass = 0; pass < 2; pass++) {
        if (pass > 0) {
          await sleep(2000);
        }

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
              break nonStreamLoop;
            }
          } catch (err: any) {
            console.warn(`[AI Studio Server] Model ${modelName} error:`, err?.message || err);
            lastError = err;
            const msg = (err?.message || '').toLowerCase();
            if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
              break nonStreamLoop;
            }
            if (
              msg.includes('503') ||
              msg.includes('high demand') ||
              msg.includes('unavailable') ||
              msg.includes('429')
            ) {
              await sleep(1200);
            }
            continue;
          }
        }
      }

      if (outputText) {
        return res.json({ result: outputText });
      }

      const formattedNonStreamErr = formatGeminiErrorMessage(lastError);
      return res.status(500).json({ error: formattedNonStreamErr });
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

  // Catch-all for undefined /api routes (prevent HTML 404)
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `المسار ${req.path} غير معرف على الخادم.` });
  });

  let vite: ViteDevServer | null = null;
  if (isDev) {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
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

  app.listen(PORT, HOST, () => {
    console.log(`[AI Studio] Server listening on http://${HOST}:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('[AI Studio] Failed to start server:', err);
  process.exit(1);
});
