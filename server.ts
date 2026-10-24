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

  // API Route: Process Lecture with Gemini AI
  app.post(['/api/process-lecture', '/api/process-lecture/'], async (req, res) => {
    try {
      const { mode, lectureText, fileName } = req.body;

      if (!lectureText || typeof lectureText !== 'string' || !lectureText.trim()) {
        return res.status(400).json({ error: 'محتوى المحاضرة مطلوب للبدء.' });
      }

      const userProvidedKey = req.body.apiKey ? String(req.body.apiKey).trim() : '';
      const apiKey = userProvidedKey;

      if (!apiKey) {
        return res.status(400).json({
          error: 'يرجى إدخال مفتاح Gemini API الخاص بك للمتابعة. يمكنك الحصول على مفتاح مجاني من Google AI Studio.',
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

CORE REQUIREMENTS:
- Provide exhaustive, university-level medical details, comprehensive tables, in-depth pathophysiological mechanisms, and complete clinical breakdowns without any omissions or shortcuts.
- STRICTLY DO NOT output emojis, arrows (-> or -->), or decorative symbols (such as ==). Use pure clean text, bold keywords, and neat tables.

Generate the complete, exhaustive English output now using clean Markdown:
`;

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
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
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });

          if (response.text && response.text.trim()) {
            outputText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`[AI Studio] Model ${modelName} error:`, err?.message || err);
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
