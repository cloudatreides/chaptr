import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const TRUST_PILLS = ['No account needed', 'Free to start', 'Your photo stays private'];

const GENRES = [
  { emoji: '💌', label: 'Romance', sub: 'K-pop world · Jiwoo', color: '#D4799A', bg: '#D4799A14', border: '#D4799A30' },
  { emoji: '🕯', label: 'Horror', sub: 'Abandoned theater · Dark secrets', color: '#9B7EC8', bg: '#9B7EC814', border: '#9B7EC830' },
  { emoji: '🔍', label: 'Mystery', sub: 'Cryptic letter · Hidden truths', color: '#D4AF37', bg: '#D4AF3714', border: '#D4AF3730' },
];

const PREVIEW_CHOICES = [
  { text: 'Introduce yourself and walk to reception →', active: true },
  { text: 'Hang back and observe quietly', active: false },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const triggerSelfiePrompt = useChaptrStore((s) => s.triggerSelfiePrompt);

  function handleStart() {
    navigate('/universes');
    if (!selfieUrl) triggerSelfiePrompt();
  }

  return (
    <div className="bg-[#0D0B12] min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <div className="relative min-h-screen flex flex-col">

        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')", backgroundColor: '#1A1020' }}
        />
        {/* Overlay gradient — fades image into dark, heavier at bottom */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, #0D0B12BB 0%, #0D0B1200 25%, #0D0B1200 40%, #0D0B12FF 80%)' }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen max-w-[1440px] mx-auto w-full px-6 md:px-[60px]">

          {/* Nav */}
          <motion.div
            className="flex items-center justify-between h-[72px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-[34px] h-[34px] rounded-lg flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #E05263 0%, #D4799A 100%)' }}
              >
                <span className="text-white font-bold text-[18px] leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
                <div className="absolute bottom-[7px] right-[7px] w-[5px] h-[5px] rounded-full bg-white" />
              </div>
              <span className="text-white font-medium text-[18px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>chaptr</span>
            </div>
            <button
              className="hidden md:block text-[14px] font-semibold text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={handleStart}
            >
              Start reading →
            </button>
          </motion.div>

          {/* Hero body — bottom-anchored, two-column on desktop */}
          <div className="flex-1 flex items-end pb-[10vh] md:pb-[80px]">
            <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">

              {/* Left column */}
              <motion.div
                className="flex flex-col gap-6 md:w-[580px]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-[11px] font-semibold tracking-[2px]"
                  style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  AI · INTERACTIVE · PERSONALIZED
                </motion.p>

                <motion.div variants={itemVariants}>
                  <h1
                    className="text-white font-bold leading-[0.92]"
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: 'clamp(52px, 5.5vw, 72px)',
                      letterSpacing: '-2px',
                    }}
                  >
                    Your face.<br />Your story.
                  </h1>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-[16px] leading-relaxed max-w-[400px]"
                  style={{ color: '#B0A8BF', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.65' }}
                >
                  Upload your photo. AI writes an interactive story where you are the protagonist — every scene, every choice, every outcome.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                  {TRUST_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="text-[12px] px-[14px] py-[6px] rounded-full"
                      style={{
                        color: '#8B8099',
                        border: '1px solid #2D2538',
                        background: 'rgba(255,255,255,0.03)',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    className="flex items-center justify-center gap-2 h-[56px] px-10 rounded-[28px] text-white font-bold text-[16px]"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      background: 'linear-gradient(90deg, #D4799A 0%, #9B7EC8 100%)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStart}
                  >
                    Start Your Story
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right column — story preview card, desktop only */}
              <motion.div
                className="hidden md:block w-[380px] shrink-0"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
              >
                <div
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    background: 'rgba(20, 16, 30, 0.85)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4799A]" />
                    <span
                      className="text-[10px] font-semibold tracking-[1.5px]"
                      style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      CHAPTER 1 · THE SEOUL TRANSFER
                    </span>
                  </div>
                  <p
                    className="text-[13px] leading-[1.75]"
                    style={{ color: '#B0A8BF', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    "You step through the glass doors of NOVA Entertainment and the world shifts. A tall figure leans against the far pillar, watching you with sharp, curious eyes — and he is looking directly at you."
                  </p>
                  <div className="flex flex-col gap-2">
                    {PREVIEW_CHOICES.map((c, i) => (
                      <div
                        key={i}
                        className="text-[13px] px-4 py-2.5 rounded-xl"
                        style={{
                          color: c.active ? '#D4799A' : '#6B6275',
                          background: c.active ? '#D4799A14' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${c.active ? '#D4799A33' : 'rgba(255,255,255,0.05)'}`,
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }}
          >
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D3548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-[#0D0B12] py-[100px]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-[120px]">

          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-semibold tracking-[2px] mb-4" style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}>
              HOW IT WORKS
            </p>
            <h2
              className="text-white font-bold"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-1px' }}
            >
              Three steps into your story
            </h2>
          </motion.div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Step 01 — Upload photo */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              {/* Visual — photo collage */}
              <div
                className="w-full h-[200px] rounded-2xl overflow-hidden"
                style={{ background: '#1A1624', border: '1px solid #2D2538' }}
              >
                <img
                  src="/scene-studio.jpeg"
                  alt="Story scene"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-[2px]" style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}>01</span>
                <h3 className="text-white font-semibold text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upload your photo</h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Your face becomes the protagonist. Private — never stored beyond your session.
                </p>
              </div>
            </motion.div>

            {/* Step 02 — Choose universe */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              {/* Visual — genre cards */}
              <div
                className="w-full h-[200px] rounded-2xl p-5 flex flex-col justify-center gap-2.5"
                style={{ background: '#1A1624', border: '1px solid #2D2538' }}
              >
                {GENRES.map((g) => (
                  <div
                    key={g.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: g.bg, border: `1px solid ${g.border}` }}
                  >
                    <span className="text-[18px] leading-none">{g.emoji}</span>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: g.color, fontFamily: 'Space Grotesk, sans-serif' }}>{g.label}</div>
                      <div className="text-[11px]" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>{g.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-[2px]" style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}>02</span>
                <h3 className="text-white font-semibold text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Choose your universe</h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>
                  K-pop romance, mystery, horror. Pick a world and step inside it.
                </p>
              </div>
            </motion.div>

            {/* Step 03 — Live the story */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              {/* Visual — prose snippet */}
              <div
                className="w-full h-[200px] rounded-2xl p-5 flex flex-col justify-between"
                style={{ background: '#0F0C18', border: '1px solid #2D2538' }}
              >
                <p
                  className="text-[12px] leading-[1.75] flex-1"
                  style={{ color: '#8B8099', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  "The elevator opens onto a wide corridor. Through Studio B's frosted glass, shapes move in unison — a choreography so locked it looks like a single organism. The music stops. Then starts again from the top."
                </p>
                <div
                  className="text-[12px] px-3 py-2 rounded-lg mt-3 shrink-0"
                  style={{
                    color: '#D4799A',
                    background: '#D4799A0F',
                    border: '1px solid #D4799A25',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  Step through the door without hesitation →
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-[2px]" style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif' }}>03</span>
                <h3 className="text-white font-semibold text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live the story</h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Every choice shapes the narrative. AI writes prose that remembers who you are.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="bg-[#0D0B12] px-6 md:px-[120px] pb-[100px]">
        <motion.div
          className="max-w-[1440px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="rounded-2xl px-[80px] py-[64px] flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: 'linear-gradient(135deg, #1A1624 0%, #241E30 100%)',
              border: '1px solid #2D2538',
            }}
          >
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h3
                className="text-white font-bold"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(24px, 2.5vw, 32px)', letterSpacing: '-0.5px' }}
              >
                Ready to be the main character?
              </h3>
              <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' }}>
                Free to start. No account needed.
              </p>
            </div>
            <motion.button
              className="flex items-center gap-2 h-[56px] px-10 rounded-[28px] text-white font-bold text-[16px] shrink-0"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                background: 'linear-gradient(90deg, #D4799A 0%, #9B7EC8 100%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
            >
              Start Your Story →
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="bg-[#0D0B12] px-6 md:px-[120px] pb-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-[22px] h-[22px] rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E05263 0%, #D4799A 100%)' }}
            >
              <span className="text-white font-bold text-[12px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
            </div>
            <span style={{ color: '#3D3548', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>© 2026 Chaptr</span>
          </div>
          <span style={{ color: '#3D3548', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px' }}>
            Your photo never leaves your device.
          </span>
        </div>
      </div>

    </div>
  );
}
