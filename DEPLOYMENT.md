# 🚀 دليل النشر - مِرصاد على GitHub و Coolify

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر مشروع **مِرصاد** على GitHub ومن ثم نشره على Coolify باستخدام Docker.

---

## ✅ المتطلبات

- حساب GitHub
- حساب Coolify (أو خادم بـ Docker مثبت عليه)
- نسخة محلية من المشروع

---

## 📍 الخطوة 1: تحضير المشروع محلياً

### 1.1 التأكد من الملفات المطلوبة

```bash
✅ Dockerfile        - بناء الصورة
✅ docker-compose.yml - التشغيل المحلي
✅ docker-entrypoint.sh - تهيئة البيانات
✅ package.json      - مع engines: { node, bun }
✅ .dockerignore     - استثناء الملفات الكبيرة
```

### 1.2 اختبار البناء محلياً (اختياري)

```bash
# بناء الصورة
docker build -t mirsad:latest .

# تشغيل المحلي
docker compose up -d

# عرض السجلات
docker compose logs -f

# إيقاف
docker compose down
```

---

## 🔐 الخطوة 2: إعداد ملفات البيئة الآمنة

### 2.1 ملف البيئة المحلي (.env)

**لا تنسَ:** لا ترفع `.env` على GitHub! يجب أن تكون محمية.

```bash
# انسخ الملف الافتراضي
cp .env.example .env

# عدّل القيم الحساسة
nano .env
```

### 2.2 القيم الحرجة للإنتاج

```env
# ✅ مطلوب تغييره في الإنتاج
NODE_ENV=production
DATABASE_URL=file:/data/db/mirsad.db
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 🔐 آمان
ADMIN_PASSWORD=<كلمة_مرور_قوية_جداً>
ADMIN_SECRET=<سلسلة_عشوائية_32_حرف>

# 🎨 مخصص (اختياري)
NEXT_PUBLIC_BRAND_VARIANT=default
```

---

## 📤 الخطوة 3: رفع على GitHub

### 3.1 إنشاء مستودع على GitHub

```bash
# في صفحة GitHub، انقر: New Repository
# اسم: mirsad
# وصف: Arab News Monitoring Platform
# خصوصية: Public (أو Private حسب اختيارك)
```

### 3.2 رفع الكود الأول

```bash
cd /path/to/mRsaaD

# إضافة GitHub كـ remote
git remote add origin https://github.com/YOUR_USERNAME/mirsad.git
git branch -M main

# دفع الكود
git add .
git commit -m "🚀 Initial commit: Mirsad v0.3.0"
git push -u origin main
```

### 3.3 تفعيل GitHub Actions

```bash
# يتم تلقائياً! ستجد أيقونة ✅ بجانب الـ commits
# هذا يعني:
# ✅ التحقق من ESLint
# ✅ اختبار Build
# ✅ بناء Docker image
```

---

## 🐳 الخطوة 4: النشر على Coolify

### 4.1 الدخول إلى لوحة Coolify

1. اذهب إلى: `https://your-coolify-instance.com`
2. سجّل دخولك
3. انقر: **Projects** → **New Project**

### 4.2 ربط GitHub (الخيار 1)

```
1. اختر: "GitHub"
2. أذن لـ Coolify بالوصول إلى حسابك
3. اختر المستودع: your-username/mirsad
4. اختر الفرع: main
```

### 4.3 إعداد النشر (Deployment)

| الخيار | القيمة |
|--------|--------|
| **Deployment Type** | Docker (استخدم Dockerfile) |
| **Build Pack** | Auto-detected |
| **Port** | 3000 |
| **Auto-Deploy** | ✅ تفعيل (نشر تلقائي عند كل push) |

### 4.4 إضافة متغيرات البيئة

انقر: **Settings** → **Environment Variables**

أضف القيم التالية:

```
NODE_ENV=production
DATABASE_URL=file:/data/db/mirsad.db
NEXT_PUBLIC_APP_URL=https://your-domain.com
ADMIN_PASSWORD=<قيمة_قوية>
ADMIN_SECRET=<قيمة_عشوائية>
NEXT_PUBLIC_BRAND_VARIANT=default
LOG_LEVEL=info
```

### 4.5 إعداد التخزين الدائم (Persistent Storage)

انقر: **Settings** → **Volumes**

أضف:
```
Mount Path: /data/db
Size: 10 GB (أو حسب احتياجك)
```

---

## 🔄 الخطوة 5: النشر التلقائي (Auto-Deploy)

بعد إعداد كل شيء:

1. **كل push إلى GitHub** → 
2. **GitHub Actions تبني الصورة** → 
3. **Coolify تسحب الصورة وتشغلها** → 
4. **تطبيقك يعمل بدون تدخل!** 🎉

---

## ✅ التحقق من النشر

### 5.1 هل النشر ناجح؟

```
✅ الموقع يفتح: https://your-domain.com
✅ قاعدة البيانات تم إنشاؤها
✅ السجلات (Logs) بدون أخطاء
✅ API تعمل: /api/health (إذا أضفت endpoint)
```

### 5.2 عرض السجلات

في لوحة Coolify:
- انقر على المشروع
- اختر: **Logs**
- استخدم **Filters** للبحث

---

## 🔧 استكشاف الأخطاء

### المشكلة: الحاوية لا تبدأ

```bash
# في Coolify:
1. افتح Logs
2. ابحث عن الخطأ
3. الأسباب الشائعة:
   - DATABASE_URL غير صحيح
   - ADMIN_PASSWORD غير معرّف
   - حجم التخزين غير كافي
```

### المشكلة: بناء Docker يفشل

```bash
# تحقق من:
1. هل بناء محلي يعمل؟ → docker build -t test .
2. هل الملفات صحيحة؟ → ls Dockerfile docker-entrypoint.sh
3. هل package.json صحيح؟
```

---

## 📊 الصيانة والتحديثات

### تحديث الكود

```bash
# غيّر الملفات محلياً
git add .
git commit -m "🐛 Fix: issue description"
git push origin main

# Coolify يلقطها تلقائياً! ✅
```

### جدولة مهام (Scheduled Tasks)

لجلب الأخبار تلقائياً كل 15 دقيقة:

في **Coolify Settings → Scheduled Tasks**:

```
Command: curl -X POST https://your-domain.com/api/fetch-news
Frequency: */15 * * * *
```

---

## 🎯 قائمة التحقق النهائية

- [ ] المشروع رفع على GitHub
- [ ] `.env` محمي (موجود في `.gitignore`)
- [ ] Coolify متصل بـ GitHub
- [ ] متغيرات البيئة مضبوطة
- [ ] التخزين الدائم معرّف
- [ ] الموقع يفتح بدون أخطاء
- [ ] السجلات نظيفة
- [ ] النشر التلقائي تفعّل

---

## 💬 للمساعدة

- **الأخطاء الشائعة:** شاهد السجلات في Coolify
- **الدعم:** تحقق من `ARCHITECTURE.md` و`ADMIN_GUIDE.md`
- **المشاكل:** افتح Issue على GitHub

---

**مبروك! 🎉 مِرصاد الآن على Coolify!**
