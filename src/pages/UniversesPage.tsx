import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

type Universe = {
  id: string;
  title: string;
  genre: string;
  premise: string;
  active: boolean;
  gradientFrom: string;
  gradientTo: string;
};

const UNIVERSES: Universe[] = [
  {
    id: 'the-seoul-transfer',
    title: 'The Seoul Transfer',
    genre: 'Romance',
    premise:
      "You're the newest trainee at NOVA Entertainment. Between grueling practice sessions and dorm room secrets, your path crosses with Jiwoo -- and nothing is the same.",
    active: true,
    gradientFrom: 'from-rose-accent/20',
    gradientTo: 'to-purple-accent/20',
  },
  {
    id: 'whispers-of-the-veil',
    title: 'Whispers of the Veil',
    genre: 'Horror',
    premise:
      'An abandoned theater holds secrets that refuse to stay buried. Every rehearsal brings you closer to a truth you may not survive.',
    active: false,
    gradientFrom: 'from-purple-accent/20',
    gradientTo: 'to-base',
  },
  {
    id: 'the-midnight-inquiry',
    title: 'The Midnight Inquiry',
    genre: 'Mystery',
    premise:
      'A cryptic letter arrives at your door. The sender is dead. The clues lead somewhere no one has returned from.',
    active: false,
    gradientFrom: 'from-muted/20',
    gradientTo: 'to-surface',
  },
  {
    id: 'beyond-the-rift',
    title: 'Beyond the Rift',
    genre: 'Adventure',
    premise:
      'The border between worlds is thinning. You are the only one who can see the cracks -- and what is coming through them.',
    active: false,
    gradientFrom: 'from-gold/20',
    gradientTo: 'to-purple-accent/20',
  },
];

const GENRE_TABS = ['ALL', 'ROMANCE', 'HORROR', 'MYSTERY', 'ADVENTURE'] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function UniversesPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const navigate = useNavigate();

  const filtered =
    activeTab === 'ALL'
      ? UNIVERSES
      : UNIVERSES.filter((u) => u.genre.toUpperCase() === activeTab);

  return (
    <div className="min-h-screen bg-base">
      <div className="page-container px-5 py-16">
        <h1 className="text-text-primary font-sans font-semibold text-xl text-center mb-8">
          Choose Your Universe
        </h1>

        {/* Genre Tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 border-b border-surface mb-8"
          role="tablist"
        >
          {GENRE_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-sans whitespace-nowrap min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-rose-accent focus-visible:outline-none ${
                activeTab === tab
                  ? 'text-text-primary border-b-2 border-rose-accent'
                  : 'text-muted border-b-2 border-transparent hover:text-text-primary/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeTab}
        >
          {filtered.map((u) =>
            u.active ? (
              <motion.div key={u.id} variants={itemVariants}>
                <motion.div
                  className="relative rounded-xl overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                  style={{ height: 200 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigate('/story/chapter-1')}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/story/chapter-1');
                    }
                  }}
                >
                  <img src="/seoul-transfer-card.jpeg" alt={u.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, #1A1624FF 100%)' }} />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="text-rose-accent text-xs font-sans font-semibold tracking-wide">{u.genre.toUpperCase()}</span>
                    <h2 className="text-text-primary font-semibold text-lg font-sans mt-1">{u.title}</h2>
                    <p className="text-muted text-sm font-sans mt-1 line-clamp-2">{u.premise}</p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key={u.id} variants={itemVariants}>
                <div
                  className={`relative grayscale opacity-50 rounded-xl p-6 bg-gradient-to-br ${u.gradientFrom} ${u.gradientTo} cursor-default`}
                  aria-disabled="true"
                >
                  <span className="text-rose-accent text-sm font-sans">
                    {u.genre}
                  </span>
                  <h2 className="text-text-primary font-semibold text-xl font-sans mt-1">
                    {u.title}
                  </h2>
                  <p className="text-muted text-base font-sans mt-2 line-clamp-2">
                    {u.premise}
                  </p>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Lock size={24} className="text-text-primary" />
                    <span className="text-muted text-sm mt-1">Notify me</span>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}
