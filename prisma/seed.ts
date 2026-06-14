/**
 * Database Seed Script
 * يقوم بتعبئة قاعدة البيانات بـ:
 * 1. الدول العربية مع إحداثياتها
 * 2. مصادر RSS العربية الحقيقية
 */

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// ============================================
// الدول العربية مع الإحداثيات الحقيقية
// ============================================
const arabCountries = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', region: 'GCC', regionAr: 'الخليج', capital: 'Riyadh', capitalAr: 'الرياض', coordinates: { lat: 24.7136, lng: 46.6753 }, flag: '🇸🇦', population: 35000000, riskIndex: 3.2 },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', region: 'GCC', regionAr: 'الخليج', capital: 'Abu Dhabi', capitalAr: 'أبوظبي', coordinates: { lat: 24.4539, lng: 54.3773 }, flag: '🇦🇪', population: 10000000, riskIndex: 2.1 },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Cairo', capitalAr: 'القاهرة', coordinates: { lat: 30.0444, lng: 31.2357 }, flag: '🇪🇬', population: 105000000, riskIndex: 4.5 },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', region: 'GCC', regionAr: 'الخليج', capital: 'Doha', capitalAr: 'الدوحة', coordinates: { lat: 25.2854, lng: 51.5310 }, flag: '🇶🇦', population: 2900000, riskIndex: 2.0 },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', region: 'GCC', regionAr: 'الخليج', capital: 'Kuwait City', capitalAr: 'مدينة الكويت', coordinates: { lat: 29.3759, lng: 47.9774 }, flag: '🇰🇼', population: 4300000, riskIndex: 2.5 },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', region: 'GCC', regionAr: 'الخليج', capital: 'Manama', capitalAr: 'المنامة', coordinates: { lat: 26.0667, lng: 50.5577 }, flag: '🇧🇭', population: 1700000, riskIndex: 3.0 },
  { code: 'OM', name: 'Oman', nameAr: 'سلطنة عُمان', region: 'GCC', regionAr: 'الخليج', capital: 'Muscat', capitalAr: 'مسقط', coordinates: { lat: 23.5880, lng: 58.3829 }, flag: '🇴🇲', population: 5100000, riskIndex: 2.3 },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', region: 'Levant', regionAr: 'بلاد الشام', capital: 'Amman', capitalAr: 'عمّان', coordinates: { lat: 31.9454, lng: 35.9284 }, flag: '🇯🇴', population: 11000000, riskIndex: 4.0 },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', region: 'Levant', regionAr: 'بلاد الشام', capital: 'Beirut', capitalAr: 'بيروت', coordinates: { lat: 33.8938, lng: 35.5018 }, flag: '🇱🇧', population: 5500000, riskIndex: 6.8 },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', region: 'Levant', regionAr: 'بلاد الشام', capital: 'Damascus', capitalAr: 'دمشق', coordinates: { lat: 33.5138, lng: 36.2765 }, flag: '🇸🇾', population: 22000000, riskIndex: 8.5 },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', region: 'Levant', regionAr: 'بلاد الشام', capital: 'Baghdad', capitalAr: 'بغداد', coordinates: { lat: 33.3152, lng: 44.3661 }, flag: '🇮🇶', population: 43000000, riskIndex: 6.5 },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', region: 'Arabian Peninsula', regionAr: 'شبه الجزيرة العربية', capital: 'Sanaa', capitalAr: 'صنعاء', coordinates: { lat: 15.3694, lng: 44.1910 }, flag: '🇾🇪', population: 33000000, riskIndex: 8.8 },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', region: 'Levant', regionAr: 'بلاد الشام', capital: 'Jerusalem', capitalAr: 'القدس', coordinates: { lat: 31.7683, lng: 35.2137 }, flag: '🇵🇸', population: 5500000, riskIndex: 8.2 },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Tripoli', capitalAr: 'طرابلس', coordinates: { lat: 32.8872, lng: 13.1913 }, flag: '🇱🇾', population: 7000000, riskIndex: 7.0 },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Tunis', capitalAr: 'تونس', coordinates: { lat: 36.8065, lng: 10.1815 }, flag: '🇹🇳', population: 12000000, riskIndex: 4.2 },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Algiers', capitalAr: 'الجزائر', coordinates: { lat: 36.7538, lng: 3.0588 }, flag: '🇩🇿', population: 45000000, riskIndex: 4.5 },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Rabat', capitalAr: 'الرباط', coordinates: { lat: 34.0209, lng: -6.8416 }, flag: '🇲🇦', population: 37000000, riskIndex: 3.5 },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', region: 'North Africa', regionAr: 'شمال أفريقيا', capital: 'Khartoum', capitalAr: 'الخرطوم', coordinates: { lat: 15.5007, lng: 32.5599 }, flag: '🇸🇩', population: 46000000, riskIndex: 8.0 },
];

// ============================================
// مصادر RSS عربية حقيقية وموثوقة
// ============================================
const rssSources = [
  // قنوات إخبارية رئيسية
  { name: 'Al Jazeera', nameAr: 'الجزيرة', url: 'https://www.aljazeera.net', feedUrl: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84a4d4b04c7/73d0e1b4-532f-45ef-b135-bfdff8b8cab9', country: 'QA', credibility: 85 },
  { name: 'Al Arabiya', nameAr: 'العربية', url: 'https://www.alarabiya.net', feedUrl: 'https://www.alarabiya.net/.mrss/ar.xml', country: 'AE', credibility: 80 },
  { name: 'BBC Arabic', nameAr: 'بي بي سي عربي', url: 'https://www.bbc.com/arabic', feedUrl: 'https://feeds.bbci.co.uk/arabic/rss.xml', country: 'GB', credibility: 90 },
  { name: 'CNN Arabic', nameAr: 'سي إن إن بالعربية', url: 'https://arabic.cnn.com', feedUrl: 'https://arabic.cnn.com/api/v1/rss/middle_east/rss.xml', country: 'US', credibility: 85 },
  { name: 'DW Arabic', nameAr: 'دويتشه فيله عربي', url: 'https://www.dw.com/ar', feedUrl: 'https://rss.dw.com/xml/rss-ar-all', country: 'DE', credibility: 88 },
  { name: 'France 24 Arabic', nameAr: 'فرانس 24 عربي', url: 'https://www.france24.com/ar', feedUrl: 'https://www.france24.com/ar/rss', country: 'FR', credibility: 85 },
  { name: 'Sky News Arabia', nameAr: 'سكاي نيوز عربية', url: 'https://www.skynewsarabia.com', feedUrl: 'https://www.skynewsarabia.com/web/rss/4019.xml', country: 'AE', credibility: 80 },
  { name: 'RT Arabic', nameAr: 'روسيا اليوم', url: 'https://arabic.rt.com', feedUrl: 'https://arabic.rt.com/rss/', country: 'RU', credibility: 65 },
  
  // مصادر اقتصادية
  { name: 'Argaam', nameAr: 'أرقام', url: 'https://www.argaam.com', feedUrl: 'https://www.argaam.com/ar/rss/news', country: 'SA', credibility: 85, category: 'economy' },
  { name: 'Mubasher', nameAr: 'مباشر', url: 'https://www.mubasher.info', feedUrl: 'https://www.mubasher.info/feed/news', country: 'AE', credibility: 80, category: 'economy' },
  
  // مصادر إقليمية
  { name: 'Asharq Al-Awsat', nameAr: 'الشرق الأوسط', url: 'https://aawsat.com', feedUrl: 'https://aawsat.com/feed', country: 'SA', credibility: 82 },
  { name: 'Al Riyadh', nameAr: 'الرياض', url: 'https://www.alriyadh.com', feedUrl: 'https://www.alriyadh.com/rss.xml', country: 'SA', credibility: 75 },
  { name: 'Al Khaleej', nameAr: 'الخليج', url: 'https://www.alkhaleej.ae', feedUrl: 'https://www.alkhaleej.ae/rss', country: 'AE', credibility: 75 },
  { name: 'Al-Ahram', nameAr: 'الأهرام', url: 'https://gate.ahram.org.eg', feedUrl: 'https://gate.ahram.org.eg/Media/rss/rss.aspx', country: 'EG', credibility: 70 },
  { name: 'Youm7', nameAr: 'اليوم السابع', url: 'https://www.youm7.com', feedUrl: 'https://www.youm7.com/rss/SectionRss?SectionID=65', country: 'EG', credibility: 70 },
];

async function main() {
  console.log('🌱 بدء عملية تعبئة قاعدة البيانات...');
  
  // 1. تعبئة الدول
  console.log('\n📍 إضافة الدول العربية...');
  for (const country of arabCountries) {
    await db.country.upsert({
      where: { code: country.code },
      update: country,
      create: country,
    });
    console.log(`  ✓ ${country.nameAr} (${country.code})`);
  }
  console.log(`✅ تم إضافة ${arabCountries.length} دولة`);
  
  // 2. تعبئة مصادر RSS
  console.log('\n📰 إضافة مصادر الأخبار...');
  for (const source of rssSources) {
    const existing = await db.source.findFirst({
      where: { feedUrl: source.feedUrl },
    });
    
    if (existing) {
      await db.source.update({
        where: { id: existing.id },
        data: {
          name: source.name,
          nameAr: source.nameAr,
          url: source.url,
          country: source.country,
          credibility: source.credibility,
          category: source.category,
          isActive: true,
        },
      });
    } else {
      await db.source.create({
        data: {
          name: source.name,
          nameAr: source.nameAr,
          url: source.url,
          feedUrl: source.feedUrl,
          type: 'RSS',
          country: source.country,
          credibility: source.credibility,
          category: source.category,
          language: 'ar',
          isActive: true,
        },
      });
    }
    console.log(`  ✓ ${source.nameAr}`);
  }
  console.log(`✅ تم إضافة ${rssSources.length} مصدر`);
  
  console.log('\n🎉 اكتملت عملية التعبئة بنجاح!');
  console.log('\n💡 الخطوة التالية:');
  console.log('   شغّل: curl http://localhost:3000/api/fetch-news');
  console.log('   لجلب الأخبار من جميع المصادر');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في التعبئة:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
