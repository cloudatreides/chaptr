import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: 'Upload your photo',
    desc: 'Your face becomes the protagonist. Private — never stored beyond your session.',
  },
  {
    num: '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Choose your universe',
    desc: 'K-pop romance, mystery, horror. Pick a world and step inside it.',
  },
  {
    num: '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Live the story',
    desc: 'Every choice shapes the narrative. AI writes prose that remembers who you are.',
  },
];

const TRUST_PILLS = ['No account needed', 'Free to start', 'Your photo stays private'];

export default function LandingPage() {
  const navigate = useNavigate();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const triggerSelfiePrompt = useChaptrStore((s) => s.triggerSelfiePrompt);

  function handleStart() {
    navigate('/universes');
    if (!selfieUrl) triggerSelfiePrompt();
  }

  return (
    <div className="relative bg-[#0D0B12] min-h-screen overflow-x-hidden">

      {/* ── HERO SECTION ── */}
      <div className="relative min-h-screen flex flex-col">

        {/* Background image — full bleed, with fallback color */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')", backgroundColor: '#1A1020' }}
        />

        {/* Top vignette */}
        <div
          className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #0D0B12CC 0%, #0D0B1200 100%)' }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #0D0B1200 0%, #0D0B12FF 60%)' }}
        />

        {/* Content — max-w-[1440px] container */}
        <div className="relative z-20 flex flex-col min-h-screen max-w-[1440px] mx-auto w-full px-6 md:px-[60px]">

          {/* Nav */}
          <motion.div
            className="flex items-center justify-between pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-[34px] h-[34px] rounded-lg flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #E05263 0%, #D4799A 100%)' }}
              >
                <span className="text-white font-bold text-[19px] font-sans leading-none">C</span>
                <div className="absolute bottom-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-white" />
              </div>
              <span className="text-white font-medium text-[18px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                chaptr
              </span>
            </div>

            {/* Nav CTA — desktop only */}
            <button
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={handleStart}
            >
              Start reading →
            </button>
          </motion.div>

          {/* Hero — two column on desktop */}
          <div className="flex-1 flex items-end md:items-center pb-20 md:pb-0">
            <div className="w-full md:max-w-[600px]">
              <motion.div
                className="flex flex-col gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Tag */}
                <motion.p
                  variants={itemVariants}
                  className="text-[11px] font-semibold tracking-[2px]"
                  style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  AI · INTERACTIVE · PERSONALIZED
                </motion.p>

                {/* Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-white font-bold"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(40px, 6vw, 72px)',
                    letterSpacing: '-1.5px',
                    lineHeight: '0.95',
                  }}
                >
                  Your face.<br />Your story.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={itemVariants}
                  className="max-w-[420px]"
                  style={{
                    color: '#B0A8BF',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  Upload your photo. AI writes an interactive story where you are the protagonist — every scene, every choice, every outcome.
                </motion.p>

                {/* Trust pills */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                  {TRUST_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="text-[12px] px-3 py-1 rounded-full border"
                      style={{
                        color: '#8B8099',
                        borderColor: '#2D2538',
                        fontFamily: 'Space Grotesk, sans-serif',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 pt-1"
                >
                  <motion.button
                    className="flex items-center justify-center gap-2 rounded-[28px] h-[56px] text-white font-bold text-[16px] w-full sm:w-auto sm:px-10"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      letterSpacing: '0.5px',
                      background: 'linear-gradient(to right, #D4799A 0%, #9B7EC8 100%)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart}
                  >
                    Start Your Story
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D3548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-[60px] py-20 md:py-28">
        <div className="max-w-[900px]">
          <motion.p
            className="text-[11px] font-semibold tracking-[2px] mb-4"
            style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            className="text-white font-bold mb-12 md:mb-16"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(24px, 3vw, 40px)',
              letterSpacing: '-0.5px',
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Three steps into your story
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                {/* Icon circle */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D4799A22 0%, #9B7EC822 100%)',
                    border: '1px solid #2D2538',
                    color: '#D4799A',
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <span
                    className="font-bold block mb-2"
                    style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1.5px' }}
                  >
                    {step.num}
                  </span>
                  <h3
                    className="text-white font-semibold text-lg mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-[60px] pb-24">
        <motion.div
          className="rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: 'linear-gradient(135deg, #1A1624 0%, #241E30 100%)', border: '1px solid #2D2538' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3
              className="text-white font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.5px' }}
            >
              Ready to be the main character?
            </h3>
            <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' }}>
              Free to start. No account needed.
            </p>
          </div>
          <motion.button
            className="flex items-center gap-2 rounded-[28px] h-[56px] px-10 text-white font-bold text-[16px] shrink-0"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(to right, #D4799A 0%, #9B7EC8 100%)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
          >
            Start Your Story
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-[60px] pb-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-[24px] h-[24px] rounded-md flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #E05263 0%, #D4799A 100%)' }}
          >
            <span className="text-white font-bold text-[13px] font-sans leading-none">C</span>
          </div>
          <span style={{ color: '#3D3548', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>
            © 2026 Chaptr
          </span>
        </div>
        <span style={{ color: '#3D3548', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px' }}>
          Your photo never leaves your device.
        </span>
      </div>

    </div>
  );
}
