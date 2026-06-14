'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ArrowRight, 
  Map, 
  Newspaper, 
  BarChart3, 
  AlertTriangle,
  Compass,
  Search
} from 'lucide-react';

// Animated SVG Illustration Component
function NotFoundIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-72 h-72 md:w-80 md:h-80"
    >
      {/* Floating circles background */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-8 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20"
      />
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          x: [0, -8, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-4 w-10 h-10 rounded-full bg-primary/15 dark:bg-primary/25"
      />
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20"
      />

      {/* Main compass illustration */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/30 dark:text-primary/40"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Middle circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/40 dark:text-primary/50"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
        />
        
        {/* Inner circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/50 dark:text-primary/60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
        />

        {/* Direction marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <motion.line
            key={angle}
            x1={100 + 80 * Math.cos((angle * Math.PI) / 180)}
            y1={100 + 80 * Math.sin((angle * Math.PI) / 180)}
            x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth={angle % 90 === 0 ? 2 : 1}
            className="text-primary/60 dark:text-primary/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.05 }}
          />
        ))}

        {/* Lost needle (spinning) */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* North pointer */}
          <path
            d="M100 45 L108 100 L100 95 L92 100 Z"
            fill="currentColor"
            className="text-primary"
          />
          {/* South pointer */}
          <path
            d="M100 155 L108 100 L100 105 L92 100 Z"
            fill="currentColor"
            className="text-muted-foreground/30"
          />
        </motion.g>

        {/* Center dot */}
        <motion.circle
          cx="100"
          cy="100"
          r="5"
          fill="currentColor"
          className="text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        />

        {/* Question marks floating */}
        <motion.text
          x="45"
          y="60"
          fontSize="16"
          fill="currentColor"
          className="text-primary/60 dark:text-primary/70"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ?
        </motion.text>
        <motion.text
          x="150"
          y="65"
          fontSize="14"
          fill="currentColor"
          className="text-primary/50 dark:text-primary/60"
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -7, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        >
          ?
        </motion.text>
        <motion.text
          x="155"
          y="145"
          fontSize="12"
          fill="currentColor"
          className="text-primary/40 dark:text-primary/50"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
        >
          ?
        </motion.text>
      </svg>
    </motion.div>
  );
}

// Quick links data
const quickLinks = [
  { href: '/', icon: Home, labelKey: 'navigation.dashboard' },
  { href: '/map', icon: Map, labelKey: 'navigation.map' },
  { href: '/news', icon: Newspaper, labelKey: 'navigation.news' },
  { href: '/analytics', icon: BarChart3, labelKey: 'navigation.analytics' },
  { href: '/alerts', icon: AlertTriangle, labelKey: 'navigation.alerts' },
];

export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <NotFoundIllustration />
        </div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-l from-primary via-primary to-green-600 dark:from-primary dark:via-primary dark:to-green-400 bg-clip-text text-transparent">
            404
          </h1>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 blur-3xl bg-primary/20 -z-10"
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold mt-4 mb-3 text-foreground"
        >
          {t('errors.notFound')}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
        >
          {t('errors.notFoundDesc')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <Button
            size="lg"
            className="gap-2 text-base"
            onClick={() => router.push('/')}
            asChild
          >
            <Link href="/">
              <Home className="w-5 h-5" />
              {t('errors.goHome')}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-base"
            onClick={() => router.back()}
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            {t('errors.goBack')}
          </Button>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-border pt-8"
        >
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center justify-center gap-2">
            <Compass className="w-5 h-5" />
            روابط سريعة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card hover:bg-accent border border-border hover:border-primary/30 transition-all duration-200 group"
                >
                  <link.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {t(link.labelKey)}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2 text-sm">
            <Search className="w-4 h-4" />
            جرّب البحث في المنصة للعثور على ما تبحث عنه
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
