<div align="center">

# 🌍 مِرصاد — Mirsad

### نافذتك على العالم العربي

[![Version](https://img.shields.io/badge/الإصدار-0.3.0-green.svg?style=for-the-badge)](https://github.com/mirsad/mirsad)
[![License](https://img.shields.io/badge/الترخيص-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/badge/البناء-Nightly-orange.svg?style=for-the-badge)]()
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

[🚀 البدء السريع](#-البدء-السريع) • [📚 التوثيق](docs/) • [🤝 المساهمة](#-المساهمة) • [📜 الترخيص](#-الترخيص)

</div>

---

## 📖 نبذة عن المشروع

**مِرصاد** هي منصة عربية متكاملة لرصد وتحليل الأخبار والأحداث في العالم العربي. تجمع المنصة الأخبار من مصادر متعددة وتقدم تحليلات ذكية بالذكاء الاصطناعي مع عرض جغرافي تفاعلي.

### ✨ الميزات الرئيسية

| الميزة | الوصف |
|--------|-------|
| 📰 **تجميع الأخبار** | جمع تلقائي من مصادر RSS و APIs متعددة |
| 🗺️ **خريطة تفاعلية** | عرض جغرافي للأحداث والأخبار |
| 🤖 **تحليلات ذكية** | تلخيص وتحليل بالذكاء الاصطناعي |
| 🔔 **تنبيهات مخصصة** | إشعارات فورية حسب اهتماماتك |
| 📊 **لوحة تحكم** | إحصائيات ورسوم بيانية تفاعلية |

---

## 📸 لقطات الشاشة

<div align="center">

### لوحة التحكم الرئيسية
![لوحة التحكم](./docs/screenshots/dashboard.png)
*لوحة تحكم شاملة تعرض آخر الأخبار والإحصائيات*

### الخريطة التفاعلية
![الخريطة التفاعلية](./docs/screenshots/map.png)
*خريطة تفاعلية لتوزيع الأحداث والأخبار*

### صفحة التحليلات الذكية
![التحليلات](./docs/screenshots/analytics.png)
*تحليلات مدعومة بالذكاء الاصطناعي*

</div>

---

## 🎯 المميزات التفصيلية

### 📰 تجميع الأخبار
- دعم مصادر RSS و APIs المختلفة
- تجميع تلقائي كل فترة محددة
- إزالة التكرار والتكرارات المشابهة
- تصنيف تلقائي حسب الدولة والقطاع والموضوع
- استخراج الكيانات (أشخاص، شركات، دول)

### 🗺️ الخريطة التفاعلية
- عرض جغرافي للأحداث والأخبار
- طبقات متعددة (أحداث، أخبار، نقاط ساخنة)
- خريطة حرارية للتركيز الإعلامي
- تجميع ذكي للعلامات
- تصفية حسب التاريخ والنوع والخطورة

### 🤖 التحليلات الذكية
- تلخيص تلقائي باللغة العربية
- تحليل الشعور العام (Sentiment Analysis)
- تحديد مستوى المخاطر
- استخراج الكيانات والعلاقات
- اكتشاف الأنماط والاتجاهات

### 🔔 التنبيهات المخصصة
- تنبيهات فورية أو مجدولة
- تصفية حسب الكلمات المفتاحية
- تصفية حسب الدول والتصنيفات
- قنوات إرسال متعددة (بريد، ويب هوك)
- تاريخ كامل للتنبيهات

### 🌐 دعم RTL الكامل
- واجهة عربية كاملة من اليمين لليسار
- خطوط عربية محسّنة
- تنسيق تلقائي للنصوص العربية

### 🌙 الوضع الداكن
- دعم كامل للوضع الداكن
- تبديل سلس بين الأوضاع
- تذكر تفضيلات المستخدم

### 🔄 النسخ المتعددة (Multi-Variant)
- **مِرصاد** - المنصة العامة
- **مرصد الاقتصاد** - تركيز على الاقتصاد
- **مرصد التقنية** - تركيز على التقنية
- **مرصد الطاقة** - تركيز على الطاقة

---

## 🚀 البدء السريع

### 📋 المتطلبات

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) (مُوصى به) أو npm
- [Git](https://git-scm.com/)

### ⚡ التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/mirsad/mirsad.git
cd mirsad

# تثبيت التبعيات
bun install

# إعداد قاعدة البيانات
bun run db:push

# نسخ ملف البيئة
cp .env.example .env
```

### 🔧 التكوين

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# قاعدة البيانات
DATABASE_URL="file:./db/custom.db"

# الذكاء الاصطناعي (اختياري)
Z_AI_API_KEY="your-api-key"

# نسخة العلامة التجارية
NEXT_PUBLIC_BRAND_VARIANT="default"  # default | economy | tech | energy
```

### 🏃 التشغيل

```bash
# تشغيل بيئة التطوير
bun run dev

# بناء للإنتاج
bun run build

# تشغيل الإنتاج
bun start
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 🚢 النشر على الإنتاج

### 🐳 النشر باستخدام Docker

**المحلي:**
```bash
# بناء الصورة
docker build -t mirsad:latest .

# تشغيل عبر Docker Compose
docker compose up -d

# عرض السجلات
docker compose logs -f

# إيقاف
docker compose down
```

### ☁️ النشر على Coolify

اتبع الخطوات التفصيلية في **[دليل النشر الكامل](DEPLOYMENT.md)**:

1. **رفع على GitHub**
   ```bash
   git push -u origin main
   ```

2. **ربط Coolify بـ GitHub** وتفعيل Auto-Deploy

3. **تعيين متغيرات البيئة** في لوحة Coolify

4. **إنشاء Persistent Storage** لقاعدة البيانات

5. **النشر تلقائي** مع كل push! 🎉

**الملفات المطلوبة:**
- ✅ `Dockerfile` - جاهز
- ✅ `docker-compose.yml` - جاهز
- ✅ `docker-entrypoint.sh` - جاهز
- ✅ `.dockerignore` - جاهز
- ✅ `package.json` engines - جاهز

**عرض التفاصيل الكاملة:** اقرأ [DEPLOYMENT.md](DEPLOYMENT.md) 📖

---

## 🏗️ البنية التقنية

### 💻 التقنيات المستخدمة

| الطبقة | التقنية | الاستخدام |
|--------|---------|-----------|
| **الواجهة** | Next.js 16 + React 19 | SSR & App Router |
| **التنسيق** | Tailwind CSS 4 + shadcn/ui | واجهة RTL |
| **الحالة** | Zustand + TanStack Query | إدارة الحالة |
| **قاعدة البيانات** | Prisma + SQLite | التخزين |
| **الرسوم البيانية** | Recharts | التصور البياني |
| **الخرائط** | MapLibre GL | الخرائط التفاعلية |
| **الذكاء الاصطناعي** | z-ai-web-dev-sdk | LLM, TTS, VLM |
| **الترجمة** | next-intl | دعم العربية |

### 📁 هيكل المجلدات

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # التوجيه حسب اللغة
│   │   ├── page.tsx       # لوحة التحكم
│   │   ├── map/           # الخريطة التفاعلية
│   │   ├── news/          # تدفق الأخبار
│   │   ├── countries/     # صفحات الدول
│   │   ├── analytics/     # التحليلات الذكية
│   │   ├── alerts/        # التنبيهات
│   │   ├── signals/       # الإشارات
│   │   ├── settings/      # الإعدادات
│   │   └── about/         # عن المنصة
│   └── api/               # نقاط النهاية API
│       ├── news/          # أخبار
│       ├── ai/            # الذكاء الاصطناعي
│       ├── countries/     # الدول
│       ├── alerts/        # التنبيهات
│       └── events/        # الأحداث
├── components/
│   ├── ui/                # مكونات shadcn/ui
│   └── layout/            # مكونات التخطيط
├── lib/
│   ├── db.ts              # عميل قاعدة البيانات
│   └── utils.ts           # الأدوات المساعدة
├── hooks/                 # الـ Hooks المخصصة
├── types/                 # أنواع TypeScript
├── config/                # إعدادات التطبيق
│   └── branding.ts        # تكوين العلامة التجارية
└── i18n/                  # الترجمات
    ├── ar.json            # العربية
    └── en.json            # الإنجليزية
```

---

## ⚙️ التكوين

### 🔑 متغيرات البيئة

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `DATABASE_URL` | رابط قاعدة البيانات | `file:./db/custom.db` |
| `Z_AI_API_KEY` | مفتاح الذكاء الاصطناعي | - |
| `NEXT_PUBLIC_BRAND_VARIANT` | نسخة العلامة التجارية | `default` |

### 📡 إضافة مصدر جديد

1. أضف المصدر في قاعدة البيانات أو عبر API:

```typescript
// إضافة مصدر RSS جديد
const source = await db.source.create({
  data: {
    name: 'الجزيرة',
    nameAr: 'الجزيرة',
    url: 'https://www.aljazeera.net',
    feedUrl: 'https://www.aljazeera.net/xml/rss/all.xml',
    type: 'RSS',
    country: 'QA',
    language: 'ar',
    credibility: 85,
  },
});
```

### 🎨 إضافة نسخة جديدة (Variant)

1. حرر ملف `src/config/branding.ts`:

```typescript
const BRAND_VARIANTS: Record<string, BrandConfig> = {
  // ... النسخ الموجودة
  
  custom: {
    id: 'custom',
    name: 'My Custom Monitor',
    nameAr: 'مرصدي المخصص',
    tagline: 'Custom Tagline',
    taglineAr: 'شعار مخصص',
    theme: {
      primary: 'hsl(200, 80%, 50%)',
      secondary: 'hsl(280, 60%, 50%)',
      accent: 'hsl(120, 70%, 40%)',
    },
    features: {
      map: true,
      ai: true,
      alerts: true,
      analytics: true,
      timeline: true,
      export: true,
    },
    defaultSectors: [
      { id: 'sector1', name: 'Sector 1', nameAr: 'القطاع 1' },
    ],
    defaultCountries: ['SA', 'AE', 'EG'],
    defaultSources: [],
  },
};
```

2. اضبط متغير البيئة:
```env
NEXT_PUBLIC_BRAND_VARIANT="custom"
```

---

## 🔌 واجهة برمجة التطبيقات (API)

### 📰 الأخبار

```http
GET /api/news
```

**المعاملات:**
| المعامل | النوع | الوصف |
|---------|-------|-------|
| `country` | string | تصفية حسب الدولة |
| `category` | string | تصفية حسب التصنيف |
| `limit` | number | عدد النتائج |
| `offset` | number | ترحيل النتائج |

**مثال:**
```bash
curl "http://localhost:3000/api/news?country=SA&limit=10"
```

### 🌍 الدول

```http
GET /api/countries
GET /api/countries/:code
```

**مثال:**
```bash
curl "http://localhost:3000/api/countries/SA"
```

### 🤖 الذكاء الاصطناعي

```http
POST /api/ai
```

**نص الطلب:**
```json
{
  "action": "summarize",
  "text": "نص المقال للتلخيص..."
}
```

### 🔔 التنبيهات

```http
GET /api/alerts
POST /api/alerts
PUT /api/alerts/:id
DELETE /api/alerts/:id
```

**مثال إنشاء تنبيه:**
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "تنبيه النفط",
    "keywords": ["نفط", "بترول", "أوبك"],
    "countries": ["SA", "AE", "KW"],
    "frequency": "immediate"
  }'
```

### 📊 الإحصائيات

```http
GET /api/stats
```

---

## 🤝 المساهمة

نرحب بمساهماتكم! 🎉

### 📝 كيفية المساهمة

1. **Fork** المستودع
2. أنشئ فرعاً جديداً (`git checkout -b feature/amazing-feature`)
3. قم بالتغييرات
4. أرسل **Pull Request**

### 🛠️ إرشادات التطوير

- اتبع [دليل الأنماط](./docs/architecture.md)
- اكتب اختبارات للميزات الجديدة
- حدّث التوثيق عند الحاجة
- تأكد من نجاح الاختبارات قبل PR

### 📋 قائمة التحقق للـ PR

- [ ] الكود يتبع أنماط المشروع
- [ ] الاختبارات تمر بنجاح
- [ ] التوثيق مُحدّث
- [ ] لا توجد تعارضات

---

## 📚 التوثيق

| الملف | الوصف |
|-------|-------|
| [architecture.md](./docs/architecture.md) | المعمارية التقنية |
| [data-flow.md](./docs/data-flow.md) | تدفق البيانات |
| [ai-layer.md](./docs/ai-layer.md) | طبقة الذكاء الاصطناعي |
| [deployment.md](./docs/deployment.md) | النشر والتشغيل |
| [roadmap.md](./docs/roadmap.md) | خارطة الطريق |

---

## 📊 الجمهور المستهدف

- 🔬 **الباحثون والمحللون** - متابعة وتحليل المستجدات
- 📰 **غرف الأخبار** - رصد وتجميع الأخبار
- 🏛️ **الجهات الحكومية** - متابعة التطورات الإقليمية
- 💼 **المستثمرون** - متابعة الأسواق والطاقة
- 🕵️ **فرق OSINT** - التحقيقات المفتوحة المصدر

---

## 📜 الترخيص

هذا المشروع مرخص تحت رخصة [MIT](LICENSE).

---

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/) - إطار العمل
- [shadcn/ui](https://ui.shadcn.com/) - مكونات الواجهة
- [Prisma](https://www.prisma.io/) - ORM
- [Recharts](https://recharts.org/) - الرسوم البيانية
- [Lucide](https://lucide.dev/) - الأيقونات

---

<div align="center">

**صُنع بـ ❤️ للعالم العربي**

[⬆️ العودة للأعلى](#-مِرصاد--mirsad)

</div>
