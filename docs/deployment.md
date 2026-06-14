# 🚀 النشر والتشغيل

## 📋 نظرة عامة

يوضح هذا المستند كيفية نشر وتشغيل منصة مِرصاد في بيئات مختلفة، من التطوير المحلي إلى الإنتاج.

---

## 📦 المتطلبات

### متطلبات النظام

| المتطلب | الحد الأدنى | المُوصى به |
|---------|-------------|------------|
| CPU | 1 core | 2+ cores |
| RAM | 512 MB | 2+ GB |
| Storage | 1 GB | 10+ GB |
| Node.js | v18+ | v20+ |

### البرمجيات المطلوبة

```bash
# التحقق من الإصدارات
node --version    # v18.0.0+
bun --version     # v1.0.0+
git --version     # v2.0.0+
```

---

## 🔧 إعداد البيئة

### 1️⃣ متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# ===========================================
# قاعدة البيانات
# ===========================================
DATABASE_URL="file:./db/custom.db"

# ===========================================
# الذكاء الاصطناعي
# ===========================================
Z_AI_API_KEY="your-api-key-here"

# ===========================================
# العلامة التجارية
# ===========================================
NEXT_PUBLIC_BRAND_VARIANT="default"
# الخيارات: default | economy | tech | energy

# ===========================================
# التطبيق
# ===========================================
NODE_ENV="production"
PORT="3000"

# ===========================================
# المصادقة (اختياري)
# ===========================================
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# ===========================================
# المصادر الخارجية (اختياري)
# ===========================================
NEWS_API_KEY="your-news-api-key"
WEBHOOK_SECRET="your-webhook-secret"
```

### 2️⃣ إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
bun run db:push

# أو استخدام Prisma Migrate
bun run db:migrate

# إنشاء العميل
bun run db:generate
```

---

## 🏃 التشغيل المحلي

### بيئة التطوير

```bash
# تثبيت التبعيات
bun install

# تشغيل الخادم التطويري
bun run dev

# فتح في المتصفح
# http://localhost:3000
```

### مراقبة السجلات

```bash
# عرض سجلات التطوير
tail -f dev.log

# عرض سجلات Prisma
DEBUG="prisma:*" bun run dev
```

---

## 🏗️ البناء للإنتاج

### 1️⃣ بناء التطبيق

```bash
# بناء Next.js
bun run build

# النتيجة في مجلد .next/
```

### 2️⃣ هيكل البناء

```
.next/
├── standalone/        # خادم مستقل
│   ├── .next/        # ملفات Next.js
│   ├── public/       # الملفات الثابتة
│   └── server.js     # نقطة الدخول
├── static/           # الملفات الثابتة
└── ...
```

### 3️⃣ التشغيل

```bash
# تشغيل الخادم المستقل
NODE_ENV=production node .next/standalone/server.js

# أو باستخدام bun
NODE_ENV=production bun .next/standalone/server.js
```

---

## 🐳 النشر باستخدام Docker

### 1️⃣ Dockerfile

```dockerfile
# ===========================================
# Stage 1: Dependencies
# ===========================================
FROM oven/bun:1 AS deps

WORKDIR /app

# نسخ ملفات التبعيات
COPY package.json bun.lock ./
COPY prisma ./prisma/

# تثبيت التبعيات
RUN bun install --frozen-lockfile
RUN bun run db:generate

# ===========================================
# Stage 2: Builder
# ===========================================
FROM oven/bun:1 AS builder

WORKDIR /app

# نسخ التبعيات
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# بناء التطبيق
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# ===========================================
# Stage 3: Runner
# ===========================================
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# إنشاء مستخدم غير root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات المطلوبة
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# نسخ قاعدة البيانات
COPY --from=builder /app/db ./db
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "server.js"]
```

### 2️⃣ docker-compose.yml

```yaml
version: '3.8'

services:
  mirsad:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mirsad
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/db/custom.db
      - Z_AI_API_KEY=${Z_AI_API_KEY}
      - NEXT_PUBLIC_BRAND_VARIANT=${NEXT_PUBLIC_BRAND_VARIANT:-default}
    volumes:
      - mirsad-db:/app/db
      - mirsad-logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mirsad-db:
  mirsad-logs:
```

### 3️⃣ بناء وتشغيل Docker

```bash
# بناء الصورة
docker build -t mirsad:latest .

# تشغيل الحاوية
docker run -d \
  --name mirsad \
  -p 3000:3000 \
  -e Z_AI_API_KEY="your-key" \
  -v mirsad-db:/app/db \
  mirsad:latest

# أو باستخدام Docker Compose
docker-compose up -d
```

---

## ☁️ النشر على VPS

### 1️⃣ إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Bun
curl -fsSL https://bun.sh/install | bash

# تثبيت PM2
sudo npm install -g pm2

# تثبيت Caddy (للـ SSL التلقائي)
sudo apt install -y caddy
```

### 2️⃣ نشر التطبيق

```bash
# استنساخ المشروع
git clone https://github.com/mirsad/mirsad.git
cd mirsad

# تثبيت التبعيات
bun install

# إعداد قاعدة البيانات
bun run db:push

# بناء للتطبيق
bun run build

# نسخ الملفات المطلوبة
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

### 3️⃣ إعداد PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mirsad',
    script: '.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
```

```bash
# تشغيل مع PM2
pm2 start ecosystem.config.js --env production

# حفظ التكوين
pm2 save
pm2 startup
```

### 4️⃣ إعداد Caddy

```bash
# تعديل Caddyfile
sudo nano /etc/caddy/Caddyfile
```

```
# Caddyfile
your-domain.com {
    reverse_proxy localhost:3000
    
    # ضغط Gzip
    encode gzip
    
    # رؤوس الأمان
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
    }
}
```

```bash
# إعادة تحميل Caddy
sudo systemctl reload caddy
```

---

## ☁️ النشر على Vercel

### 1️⃣ إعداد المشروع

```json
// vercel.json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "Z_AI_API_KEY": "@z-ai-api-key"
  }
}
```

### 2️⃣ النشر

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### 3️⃣ متغيرات البيئة

```bash
# إضافة متغيرات البيئة
vercel env add DATABASE_URL
vercel env add Z_AI_API_KEY
vercel env add NEXT_PUBLIC_BRAND_VARIANT
```

---

## ☁️ النشر على Railway

### 1️⃣ إعداد المشروع

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "bun start"
healthcheckPath = "/api"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
```

### 2️⃣ النشر

```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع
railway init

# النشر
railway up
```

---

## 📊 المراقبة والتسجيل

### 1️⃣ السجلات

```bash
# عرض سجلات PM2
pm2 logs mirsad

# عرض سجلات النظام
tail -f /var/log/mirsad/app.log
```

### 2️⃣ المراقبة

```bash
# مراقبة PM2
pm2 monit

# حالة التطبيق
pm2 status
```

### 3️⃣ المقاييس الصحية

```typescript
// إضافة نقطة نهاية صحية
// src/app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabase(),
  };
  
  return Response.json(health);
}

async function checkDatabase(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
```

---

## 🔒 الأمان

### 1️⃣ جدار الحماية

```bash
# إعداد UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2️⃣ SSL/TLS

```bash
# Caddy يتكفل تلقائياً بـ SSL
# أو استخدام Certbot
sudo certbot --nginx -d your-domain.com
```

### 3️⃣ تحديثات الأمان

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تحديث التبعيات
bun update
```

---

## 🔄 التحديثات

### تحديث التطبيق

```bash
# سحب آخر التغييرات
git pull origin main

# تثبيت التبعيات الجديدة
bun install

# تحديث قاعدة البيانات
bun run db:push

# إعادة البناء
bun run build

# إعادة التشغيل
pm2 restart mirsad
```

### استراتيجية التحديث

```
Development → Staging → Production
     ↓            ↓           ↓
   Dev         Test        Live
  Server      Server      Server
```

---

## 🆘 استكشاف الأخطاء

### مشاكل شائعة

| المشكلة | السبب | الحل |
|---------|-------|------|
| فشل البناء | ذاكرة غير كافية | زيادة RAM أو استخدام Swap |
| خطأ في DB | عدم وجود ملف DB | تشغيل `db:push` |
| أخطاء API | مفاتيح خاطئة | التحقق من متغيرات البيئة |
| بطء التحميل | عدم تفعيل الضغط | تفعيل Gzip في Caddy |

### سجلات التصحيح

```bash
# تفعيل سجلات التصحيح
DEBUG="mirsad:*" bun run dev

# سجلات Prisma
DEBUG="prisma:*" bun run dev
```

---

## 📈 الأداء

### تحسينات الإنتاج

1. **ضغط Gzip** - تفعيل في الخادم
2. **تخزين مؤقت** - تفعيل Cache Headers
3. **CDN** - استخدام CDN للملفات الثابتة
4. **Load Balancing** - استخدام PM2 Cluster

### المقاييس المستهدفة

| المقياس | الهدف |
|---------|-------|
| Time to First Byte | < 200ms |
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |

---

*آخر تحديث: 2024*
