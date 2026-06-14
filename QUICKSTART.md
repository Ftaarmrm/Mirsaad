# 🚀 البدء السريع - الأخبار المباشرة الحقيقية

## ⚡ الإعداد في 3 خطوات

### 1. التثبيت
```bash
bun install
```

### 2. إعداد قاعدة البيانات + تعبئة المصادر
```bash
# إنشاء الجداول
bun run db:push

# تعبئة الدول العربية ومصادر RSS الحقيقية (الجزيرة، العربية، BBC، CNN، إلخ)
bun run db:seed
```

### 3. التشغيل
```bash
bun run dev
```

افتح: **http://localhost:3000**

---

## 📰 جلب الأخبار المباشرة

### الطريقة الأولى: من الواجهة
- اذهب إلى صفحة الأخبار
- اضغط زر **"تحديث الأخبار"** أو **"جلب الأخبار الآن"**
- ستظهر الأخبار الحقيقية خلال ثوانٍ

### الطريقة الثانية: من Terminal
```bash
curl -X POST http://localhost:3000/api/fetch-news
```

### الطريقة الثالثة: جلب دوري تلقائي (Cron)
أضف لـ crontab:
```bash
# كل 15 دقيقة
*/15 * * * * curl -X POST http://localhost:3000/api/fetch-news
```

أو استخدم **Coolify Scheduled Tasks**:
- Command: `curl -X POST http://localhost:3000/api/fetch-news`
- Frequency: `*/15 * * * *`

---

## ✅ ما الذي يعمل بشكل حقيقي الآن؟

### 🔴 الواجهة المباشرة (Live):

| الميزة | الحالة | المصدر |
|--------|--------|--------|
| 📰 صفحة الأخبار | ✅ مباشر | API + قاعدة البيانات |
| 🏠 الصفحة الرئيسية | ✅ مباشر | API + قاعدة البيانات |
| 🗺️ الخريطة | ✅ مباشر | API + قاعدة البيانات |
| 📊 الإحصائيات | ✅ مباشر | محسوبة من قاعدة البيانات |
| 🌍 الدول | ✅ مباشر | 18 دولة عربية حقيقية |

### 📡 مصادر RSS الحقيقية (15 مصدر):

**قنوات رئيسية:**
- 🟢 الجزيرة (Al Jazeera)
- 🟢 العربية (Al Arabiya)  
- 🟢 BBC عربي
- 🟢 CNN بالعربية
- 🟢 DW عربي
- 🟢 France 24 عربي
- 🟢 سكاي نيوز عربية
- 🟢 RT عربي

**اقتصادية:**
- 🟢 أرقام (Argaam)
- 🟢 مباشر (Mubasher)

**إقليمية:**
- 🟢 الشرق الأوسط
- 🟢 الرياض
- 🟢 الخليج
- 🟢 الأهرام
- 🟢 اليوم السابع

---

## 🔄 كيف يتدفق الخبر؟

```
RSS Feed (الجزيرة)
      ↓
fetchSourceRSS()  ← يستدعي الـ feed
      ↓
parseRSS()  ← يحلل XML
      ↓
guessCategory() + guessCountry()  ← تصنيف تلقائي
      ↓
db.article.create()  ← حفظ في قاعدة البيانات
      ↓
API /api/news  ← يستدعى من الواجهة
      ↓
useNews() hook  ← React Query
      ↓
NewsPage UI  ← عرض للمستخدم
```

**التحديث التلقائي:** كل 5 دقائق (`refetchInterval`)

---

## 🧪 الاختبار

### اختبار 1: تأكد من أن البيانات حقيقية
```bash
# 1. شغّل المشروع
bun run dev

# 2. في terminal آخر، اجلب الأخبار
curl -X POST http://localhost:3000/api/fetch-news

# 3. تحقق من قاعدة البيانات
bun run db:studio
# افتح جدول Article - ستجد أخبار حقيقية بـ URLs حقيقية
```

### اختبار 2: تأكد من التحديث المباشر
- افتح صفحة الأخبار
- اضغط "تحديث"
- ستحصل على أخبار جديدة من المصادر فوراً

### اختبار 3: Health Check
```bash
curl http://localhost:3000/api/health
```

---

## ⚙️ الملفات الجديدة

### Core Services:
- `src/lib/rss-fetcher.ts` - خدمة جلب RSS
- `src/lib/logger.ts` - نظام Logging
- `src/lib/error-handler.ts` - معالج أخطاء
- `src/lib/validations.ts` - Zod schemas

### API Endpoints:
- `src/app/api/fetch-news/route.ts` - جلب RSS يدوي/cron
- `src/app/api/health/route.ts` - Health check

### Frontend:
- `src/hooks/use-api.ts` - React Query hooks
- `src/components/providers/query-provider.tsx` - QueryClient Provider
- `src/middleware.ts` - Security headers

### Database:
- `prisma/seed.ts` - تعبئة قاعدة البيانات

### الصفحات المُعاد كتابتها:
- ✅ `src/app/[locale]/page.tsx` - الصفحة الرئيسية
- ✅ `src/app/[locale]/news/page.tsx` - صفحة الأخبار
- ✅ `src/app/[locale]/map/page.tsx` - صفحة الخريطة (محدّثة)
- ✅ `src/components/map/interactive-map.tsx` - الخريطة (محدّثة)

---

## 🐛 استكشاف الأخطاء

### مشكلة: لا تظهر أخبار
**الحل:**
```bash
# 1. تأكد من seed
bun run db:seed

# 2. اجلب الأخبار يدوياً
curl -X POST http://localhost:3000/api/fetch-news

# 3. افحص قاعدة البيانات
bun run db:studio
```

### مشكلة: بعض RSS لا تعمل
**السبب:** بعض المواقع تحجب الـ feeds أحياناً
**الحل:** المشروع يستمر مع باقي المصادر تلقائياً - افحص الـ logs لرؤية أيها فشل

### مشكلة: الخريطة فارغة
**السبب:** لا توجد أحداث (Events) في قاعدة البيانات بعد
**الحل:** الأحداث تُستخرج من المقالات بواسطة AI - يحتاج تشغيل AI processor (موجود في `/api/ai`)

---

## 🎯 الخطوات التالية الموصى بها

1. **تشغيل AI Processing**: لاستخراج الأحداث والكيانات والمخاطر من المقالات
2. **إعداد Cron**: لجلب الأخبار كل 15 دقيقة تلقائياً
3. **إضافة مصادر أخرى**: أضف المزيد من RSS feeds في `prisma/seed.ts`
4. **تحسين التصنيف**: استخدم AI لتصنيف أفضل بدلاً من keywords

---

**🎉 المشروع الآن يعمل ببيانات حقيقية 100%!**
