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

const TRUST_PILLS = ['No account needed', 'Free to start', 'Your photo stays private'];

const PREVIEW_CHOICES = [
  'Introduce yourself and walk to reception',
  'Hang back and observe quietly',
];

// Mock avatar faces — skin tone + hair gradients
const AVATARS = [
  {
    label: 'asian girl',
    skin: ['#F2C4A0', '#E8A882'],
    hair: '#1A0A00',
    hairStyle: 'long',
  },
  {
    label: 'asian guy',
    skin: ['#E8B896', '#D4956A'],
    hair: '#0D0800',
    hairStyle: 'short',
  },
  {
    label: 'white girl',
    skin: ['#FADDCA', '#F0C4A8'],
    hair: '#8B5E3C',
    hairStyle: 'long',
  },
  {
    label: 'white guy',
    skin: ['#F5D5BE', '#E8B898'],
    hair: '#3D2B1A',
    hairStyle: 'short',
  },
];

function AvatarFace({ avatar, size = 64 }: { avatar: typeof AVATARS[0]; size?: number }) {
  const r = size / 2;
  const isLong = avatar.hairStyle === 'long';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Circle background / skin */}
      <defs>
        <radialGradient id={`skin-${avatar.label}`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={avatar.skin[0]} />
          <stop offset="100%" stopColor={avatar.skin[1]} />
        </radialGradient>
        <clipPath id={`clip-${avatar.label}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#skin-${avatar.label})`} />
      {/* Hair — top */}
      <g clipPath={`url(#clip-${avatar.label})`}>
        {/* Hair top */}
        <ellipse cx={r} cy={size * 0.22} rx={size * 0.38} ry={size * 0.2} fill={avatar.hair} />
        {/* Long hair sides */}
        {isLong && (
          <>
            <rect x={size * 0.04} y={size * 0.25} width={size * 0.1} height={size * 0.55} rx={size * 0.05} fill={avatar.hair} />
            <rect x={size * 0.86} y={size * 0.25} width={size * 0.1} height={size * 0.55} rx={size * 0.05} fill={avatar.hair} />
          </>
        )}
        {/* Face */}
        <ellipse cx={r} cy={size * 0.52} rx={size * 0.28} ry={size * 0.3} fill={`url(#skin-${avatar.label})`} />
        {/* Eyes */}
        <ellipse cx={r - size * 0.09} cy={size * 0.46} rx={size * 0.035} ry={size * 0.04} fill="#2D1A0E" />
        <ellipse cx={r + size * 0.09} cy={size * 0.46} rx={size * 0.035} ry={size * 0.04} fill="#2D1A0E" />
        {/* Mouth */}
        <path
          d={`M ${r - size * 0.07} ${size * 0.58} Q ${r} ${size * 0.63} ${r + size * 0.07} ${size * 0.58}`}
          stroke="#C08070"
          strokeWidth={size * 0.022}
          strokeLinecap="round"
          fill="none"
        />
        {/* Shoulders */}
        <ellipse cx={r} cy={size * 1.02} rx={size * 0.42} ry={size * 0.28} fill={avatar.hair === '#1A0A00' || avatar.hair === '#0D0800' ? '#1A1A2E' : '#2E1A1A'} />
      </g>
    </svg>
  );
}

const GENRES = [
  {
    label: 'Romance',
    icon: '💌',
    color: '#D4799A',
    bg: 'rgba(212,121,154,0.10)',
    border: 'rgba(212,121,154,0.25)',
    desc: 'K-pop world',
  },
  {
    label: 'Horror',
    icon: '🕯',
    color: '#9B7EC8',
    bg: 'rgba(155,126,200,0.10)',
    border: 'rgba(155,126,200,0.25)',
    desc: 'Dark secrets',
  },
  {
    label: 'Mystery',
    icon: '🔍',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.10)',
    border: 'rgba(212,175,55,0.25)',
    desc: 'Hidden truths',
  },
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
    <div className="relative bg-[#0D0B12] min-h-screen overflow-x-hidden">

      {/* ── HERO SECTION ── */}
      <div className="relative min-h-screen flex flex-col">

        {/* Background image — anchored to top */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')", backgroundColor: '#1A1020' }}
        />

        {/* Top vignette */}
        <div
          className="absolute top-0 left-0 right-0 h-[160px] pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #0D0B12E0 0%, #0D0B1200 100%)' }}
        />

        {/* Bottom vignette — covers blurry lower image */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[75%] pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #0D0B1200 0%, #0D0B12FF 55%)' }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col min-h-screen max-w-[1440px] mx-auto w-full px-6 md:px-[60px]">

          {/* Nav */}
          <motion.div
            className="flex items-center justify-between pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
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
            <button
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={handleStart}
            >
              Start reading →
            </button>
          </motion.div>

          {/* Hero body — two-column desktop, anchored to bottom */}
          <div className="flex-1 flex items-end pb-[10vh] md:pb-[12vh]">
            <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">

              {/* Left: headline + CTA */}
              <div className="md:max-w-[560px]">
                <motion.div
                  className="flex flex-col gap-5"
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

                  <motion.h1
                    variants={itemVariants}
                    className="text-white font-bold"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 'clamp(40px, 5.5vw, 72px)',
                      letterSpacing: '-1.5px',
                      lineHeight: '0.95',
                    }}
                  >
                    Your face.<br />Your story.
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="max-w-[400px]"
                    style={{
                      color: '#B0A8BF',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}
                  >
                    Upload your photo. AI writes an interactive story where you are the protagonist — every scene, every choice, every outcome.
                  </motion.p>

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

                  <motion.div variants={itemVariants} className="pt-1">
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

              {/* Right: story preview card — desktop only */}
              <motion.div
                className="hidden md:block w-full max-w-[360px] shrink-0"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(20, 16, 30, 0.85)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4799A' }} />
                    <span className="text-[10px] font-semibold tracking-[2px]" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>
                      CHAPTER 1 · THE SEOUL TRANSFER
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: '#B0A8BF', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.7' }}
                  >
                    "You step through the glass doors of NOVA Entertainment and the world shifts. A tall figure leans against the far pillar — and he is looking directly at you."
                  </p>
                  <div className="flex flex-col gap-2">
                    {PREVIEW_CHOICES.map((choice, i) => (
                      <div
                        key={i}
                        className="text-[13px] px-4 py-2.5 rounded-xl cursor-default"
                        style={{
                          color: i === 0 ? '#D4799A' : '#6B6275',
                          background: i === 0 ? 'rgba(212,121,154,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${i === 0 ? 'rgba(212,121,154,0.2)' : 'rgba(255,255,255,0.05)'}`,
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {choice}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
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
        <div className="max-w-[960px]">
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
            className="text-white font-bold mb-14"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

            {/* Step 01 — Upload photo */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              {/* Avatar grid */}
              <div className="grid grid-cols-2 gap-2 w-fit">
                {AVATARS.map((avatar) => (
                  <div
                    key={avatar.label}
                    className="rounded-xl overflow-hidden"
                    style={{ border: '2px solid #1E1A2A' }}
                  >
                    <AvatarFace avatar={avatar} size={72} />
                  </div>
                ))}
              </div>
              <div>
                <span
                  className="font-bold block mb-2"
                  style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  01
                </span>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Upload your photo
                </h3>
                <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                  Your face becomes the protagonist. Private — never stored beyond your session.
                </p>
              </div>
            </motion.div>

            {/* Step 02 — Choose universe */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              {/* Genre cards */}
              <div className="flex flex-col gap-2">
                {GENRES.map((g) => (
                  <div
                    key={g.label}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: g.bg,
                      border: `1px solid ${g.border}`,
                    }}
                  >
                    <span className="text-xl leading-none">{g.icon}</span>
                    <div>
                      <span className="text-sm font-semibold block" style={{ color: g.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                        {g.label}
                      </span>
                      <span className="text-xs" style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {g.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <span
                  className="font-bold block mb-2"
                  style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  02
                </span>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Choose your universe
                </h3>
                <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                  K-pop romance, mystery, horror. Pick a world and step inside it.
                </p>
              </div>
            </motion.div>

            {/* Step 03 — Live the story */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              {/* Story preview */}
              <div
                className="rounded-xl p-4"
                style={{ background: '#0F0C18', border: '1px solid #1E1A2A' }}
              >
                <p
                  className="text-[13px] leading-relaxed mb-3"
                  style={{ color: '#8B8099', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.7' }}
                >
                  "The elevator opens onto a wide corridor. Frosted glass panels line both sides. Through Studio B, shapes move in unison — a choreography so locked it looks like a single organism..."
                </p>
                <div
                  className="text-[12px] px-3 py-2 rounded-lg"
                  style={{
                    color: '#D4799A',
                    background: 'rgba(212,121,154,0.08)',
                    border: '1px solid rgba(212,121,154,0.2)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  Step through the door without hesitation →
                </div>
              </div>
              <div>
                <span
                  className="font-bold block mb-2"
                  style={{ color: '#D4799A', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  03
                </span>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Live the story
                </h3>
                <p style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
                  Every choice shapes the narrative. AI writes prose that remembers who you are.
                </p>
              </div>
            </motion.div>

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
            className="w-[24px] h-[24px] rounded-md flex items-center justify-center"
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
