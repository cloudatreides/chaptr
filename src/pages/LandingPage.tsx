import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(to bottom, #0D0B12, #1A0A1E)' }}
    >
      {/* Silhouette SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 opacity-30"
        viewBox="0 0 1440 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <path
          d="M200 300 Q210 180 240 160 Q260 140 270 120 Q280 100 275 80 Q270 60 255 55 Q240 50 230 60 Q220 70 218 90 Q215 110 210 130 Q200 160 180 180 Q160 200 150 240 Q140 270 140 300Z"
          fill="#2A1A3E"
        />
        <path
          d="M600 300 Q610 200 630 170 Q650 140 660 110 Q670 80 665 60 Q660 40 645 35 Q630 30 620 42 Q610 55 608 75 Q605 100 600 130 Q590 170 570 200 Q555 230 550 260 Q545 280 540 300Z"
          fill="#2A1A3E"
        />
        <path
          d="M1000 300 Q1010 210 1030 180 Q1050 150 1065 120 Q1080 90 1075 65 Q1070 45 1055 38 Q1040 32 1028 44 Q1018 58 1015 80 Q1012 105 1005 140 Q995 175 975 210 Q960 240 950 270 Q945 285 940 300Z"
          fill="#2A1A3E"
        />
        <path
          d="M1250 300 Q1255 230 1270 200 Q1285 170 1295 145 Q1305 120 1300 98 Q1295 80 1282 75 Q1270 70 1260 80 Q1252 92 1250 110 Q1248 130 1242 155 Q1232 185 1218 215 Q1208 240 1200 270 Q1195 285 1190 300Z"
          fill="#2A1A3E"
        />
      </svg>

      {/* Hero content */}
      <motion.div
        className="relative z-10 page-container px-5 text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-text-primary font-sans font-semibold text-4xl md:text-5xl leading-tight">
            Your face. Your story.
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            className="bg-rose-accent text-[#0D0B12] font-sans text-base font-medium px-8 py-3 rounded-full mt-8 focus-visible:ring-2 focus-visible:ring-rose-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/universes')}
          >
            Start Your Story
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
