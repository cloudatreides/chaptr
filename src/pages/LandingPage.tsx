import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D0B12]">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />

      {/* Top fade — #0D0B12 → transparent */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0D0B12CC 0%, #0D0B1200 100%)',
        }}
      />

      {/* Bottom gradient overlay — transparent → #0D0B12 */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '300px',
          height: '544px',
          background: 'linear-gradient(to bottom, #0D0B1200 0%, #0D0B12FF 55%, #0D0B12FF 100%)',
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 max-w-[430px] mx-auto w-full">

        {/* Logo — top left */}
        <motion.div
          className="flex items-center gap-2 pt-[74px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon */}
          <div
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #E05263 0%, #D4799A 100%)',
            }}
          >
            <span className="text-white font-bold text-[19px] font-sans leading-none">C</span>
            <div className="absolute bottom-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-white" />
          </div>
          {/* Wordmark */}
          <span className="text-white font-medium text-[18px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            chaptr
          </span>
        </motion.div>

        {/* Spacer pushes hero text to y≈490 equivalent */}
        <div className="flex-1" />

        {/* Hero text block */}
        <motion.div
          className="flex flex-col gap-4"
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
              fontSize: '48px',
              letterSpacing: '-1px',
              lineHeight: '0.95',
            }}
          >
            Your face.<br />Your story.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            style={{
              color: '#B0A8BF',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            Step inside the story. AI generates a world where you're the main character.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          className="mt-8 w-full flex items-center justify-center gap-2 rounded-[28px] h-[56px] text-white font-bold text-[16px]"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '0.5px',
            background: 'linear-gradient(to bottom, #D4799A 0%, #9B7EC8 100%)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/universes')}
        >
          Start Your Story
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Social proof */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="w-[6px] h-[6px] rounded-full bg-[#D4799A]" />
          <span style={{ color: '#6B6275', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px' }}>
            96.7K stories started this week
          </span>
        </motion.div>
      </div>
    </div>
  );
}
