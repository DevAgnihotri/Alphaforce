'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  Users,
  Mail,
  Phone,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Activity,
  Lock
} from 'lucide-react';

// Animated gradient orb component
function GlowOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );
}

// Animated grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
}

// Animated data stream visualization
function DataStream({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"
      style={{ width: '200px' }}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: '100vw', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
    />
  );
}

// Section reveal animation wrapper
function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Feature card with hover effects
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-8 border border-white/[0.08] rounded-2xl bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.15] transition-colors duration-500">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all duration-500">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Metric display component
function MetricDisplay({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-light text-white tracking-tight mb-2">{value}</div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</div>
    </motion.div>
  );
}

// Main landing page component
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#0a0a0b] text-white overflow-x-hidden">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <GlowOrb className="w-[800px] h-[800px] bg-cyan-600 -top-40 -left-40" delay={0} />
        <GlowOrb className="w-[600px] h-[600px] bg-blue-600 top-1/3 -right-20" delay={2} />
        <GlowOrb className="w-[700px] h-[700px] bg-purple-600 -bottom-40 left-1/3" delay={4} />
      </div>

      <GridBackground />

      {/* Floating data streams */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: `${20 + i * 15}%`, left: 0, right: 0 }}>
            <DataStream delay={i * 0.8} />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">AlphaForce</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-sm text-white/40 hidden md:block">For Elite Financial Advisors</span>
            <Link 
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-medium bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] rounded-lg transition-all duration-300 hover:border-white/[0.2]"
            >
              Enter System
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        {/* Radial gradient spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at ${50 + mousePosition.x * 0.5}% ${40 + mousePosition.y * 0.5}%, rgba(6,182,212,0.15) 0%, transparent 50%)`
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[0.15em] text-white/60">System Online</span>
            <Lock className="w-3 h-3 text-white/40" />
          </motion.div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 leading-[0.95]">
            <span className="block text-white/90">Your AI</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Force Multiplier
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The intelligence layer for elite financial advisors. 
            Transform complexity into conviction.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow duration-300 flex items-center gap-3"
              >
                Experience AlphaForce
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <button className="px-8 py-4 text-white/60 hover:text-white/90 font-medium transition-colors duration-300 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              View Capabilities
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Problem Statement Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80 mb-6">The Reality</p>
              <h2 className="text-3xl md:text-5xl font-light text-white/90 leading-tight max-w-4xl mx-auto">
                CRM systems track data — they don&apos;t <span className="text-white/40">think</span>.
                <br />
                Dashboards show charts — they don&apos;t <span className="text-white/40">act</span>.
              </h2>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <RevealSection className="md:col-span-1">
              <div className="p-6 border border-red-500/20 bg-red-500/[0.03] rounded-2xl">
                <div className="text-red-400/80 text-sm font-medium mb-2">Follow-ups slip</div>
                <p className="text-white/40 text-sm">Critical client touchpoints disappear into crowded calendars</p>
              </div>
            </RevealSection>
            <RevealSection className="md:col-span-1">
              <div className="p-6 border border-amber-500/20 bg-amber-500/[0.03] rounded-2xl">
                <div className="text-amber-400/80 text-sm font-medium mb-2">Opportunities decay</div>
                <p className="text-white/40 text-sm">High-value prospects cool while you&apos;re managing volume</p>
              </div>
            </RevealSection>
            <RevealSection className="md:col-span-1">
              <div className="p-6 border border-orange-500/20 bg-orange-500/[0.03] rounded-2xl">
                <div className="text-orange-400/80 text-sm font-medium mb-2">Risk hides in plain sight</div>
                <p className="text-white/40 text-sm">Portfolio misalignments buried in spreadsheets</p>
              </div>
            </RevealSection>
          </div>

          <RevealSection>
            <div className="text-center">
              <p className="text-xl md:text-2xl text-white/60 font-light">
                AlphaForce exists to turn <span className="text-white">complexity into conviction</span>.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Capabilities Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80 mb-6">Capabilities</p>
              <h2 className="text-3xl md:text-5xl font-light text-white/90 mb-4">
                Intelligence That Acts
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Powered by Salesforce data and Tableau-grade analytics. 
                Engineered for advisors who move markets.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Target}
              title="Opportunity Scoring"
              description="ML-powered signals identify which clients are ready to act. Stop guessing, start closing."
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="AI Insights Engine"
              description="Real-time analysis of portfolio health, risk alignment, and market positioning for every client."
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Predictive Intelligence"
              description="Anticipate client needs before they arise. Transform reactive service into proactive growth."
              delay={0.2}
            />
            <FeatureCard
              icon={Mail}
              title="Personalized Outreach"
              description="AI-generated emails and call scripts tailored to each client's profile, goals, and history."
              delay={0.3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Tableau Integration"
              description="Enterprise-grade dashboards with the analytics depth advisors demand. No compromises."
              delay={0.4}
            />
            <FeatureCard
              icon={Shield}
              title="Risk Intelligence"
              description="Continuous monitoring surfaces portfolio misalignments and compliance concerns instantly."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="relative">
              {/* Mock dashboard visualization */}
              <div className="relative aspect-[16/9] rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden">
                {/* Dashboard header */}
                <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/[0.05] flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <span className="ml-4 text-xs text-white/30">AlphaForce Command Center</span>
                </div>

                {/* Dashboard content mockup */}
                <div className="absolute inset-0 pt-12 p-6 grid grid-cols-4 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-1 space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="h-8 bg-white/[0.03] rounded-lg"
                      />
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="col-span-3 grid grid-cols-3 gap-4">
                    {/* Stat cards */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                      >
                        <div className="h-3 w-16 bg-white/[0.1] rounded mb-3" />
                        <div className="h-6 w-24 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded" />
                      </motion.div>
                    ))}

                    {/* Chart area */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="col-span-2 row-span-2 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                    >
                      <div className="h-full flex items-end justify-around gap-2 pb-4">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                            className="w-full bg-gradient-to-t from-cyan-500/40 to-blue-500/20 rounded-t"
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Client list */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="row-span-2 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-3"
                    >
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                          <div className="flex-1">
                            <div className="h-2 w-20 bg-white/[0.1] rounded mb-1" />
                            <div className="h-2 w-12 bg-white/[0.05] rounded" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Ambient glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <MetricDisplay value="3.2x" label="Faster Response" delay={0} />
              <MetricDisplay value="47%" label="More Conversions" delay={0.1} />
              <MetricDisplay value="$2.4M" label="Avg. AUM/Advisor" delay={0.2} />
              <MetricDisplay value="<2s" label="Insight Generation" delay={0.3} />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex items-center gap-3 text-white/40">
                <Shield className="w-5 h-5" />
                <span className="text-sm">SOC 2 Compliant</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-3 text-white/40">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-3 text-white/40">
                <Users className="w-5 h-5" />
                <span className="text-sm">Salesforce Native</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <motion.div
              className="relative"
              whileInView={{ scale: [0.95, 1] }}
              transition={{ duration: 0.8 }}
            >
              {/* Radial glow behind CTA */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
              </div>

              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-8" />
              
              <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                Ready to lead?
              </h2>
              
              <p className="text-lg text-white/40 max-w-xl mx-auto mb-12">
                Join the advisors who&apos;ve transformed their practice with AI-powered intelligence.
              </p>

              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(6,182,212,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl font-medium text-lg text-white shadow-2xl shadow-cyan-500/20 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Experience AlphaForce
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                </motion.button>
              </Link>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AF</span>
            </div>
            <span className="text-sm text-white/60">AlphaForce</span>
          </div>
          <p className="text-xs text-white/30">
            © 2026 AlphaForce. Built for elite financial advisors.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">Terms</span>
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
