import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './styles/themes.scss';
import './App.css';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import GamePlayer from './pages/GamePlayer';

const FEATURES = [
  {
    icon: '🎮',
    title: 'Instant Play',
    description: 'No downloads or installations. Click and play immediately in your browser.'
  },
  {
    icon: '🌐',
    title: 'Cross-Platform',
    description: 'Play on any device - desktop, tablet, or mobile. Fully responsive experience.'
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    description: 'Compete with players worldwide and climb to the top of the rankings.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized WebGL technology ensures smooth gameplay at 60+ FPS.'
  }
];

function AnimatedGameCard({ game, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <motion.img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
        <p className="mb-4 text-gray-300">{game.description}</p>
        <Link 
          to={`/play/${game.id}`}
          className="inline-block w-full text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
        >
          Play Now
        </Link>
      </div>
    </motion.div>
  );
}

function AnimatedFeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
    >
      <motion.div 
        className="text-5xl mb-4 inline-block"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: 'center center' }}
      >
        {feature.icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-300">{feature.description}</p>
    </motion.div>
  );
}

function MainLanding() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch games from Firestore
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoadingGames(true);
        const snapshot = await getDocs(collection(db, 'games'));
        const gamesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGames(gamesList);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoadingGames(false);
      }
    };
    fetchGames();
  }, []);

  // Smooth scroll behavior
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white font-sans overflow-x-hidden">
      {/* Animated Navigation */}
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section with Parallax */}
      <motion.header 
        style={{ y: backgroundY }}
        className="relative flex flex-col items-center justify-center text-center pt-32 pb-24 px-4 min-h-screen w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ opacity }}
          className="w-full max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Play WebGL Games Instantly
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 mx-auto max-w-3xl text-gray-300 leading-relaxed text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover, click, and play high-quality WebGL games online. No downloads, just pure gaming fun!
          </motion.p>
          
          <motion.button
            onClick={() => scrollToSection('games')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-2xl hover:shadow-blue-500/50"
          >
            Browse Games
          </motion.button>

          {/* Floating Animation */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-16"
          >
            <div className="text-4xl">👇</div>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-16 bg-gradient-to-b from-transparent to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Choose SyncGaming?
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Experience gaming like never before with our cutting-edge platform
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <AnimatedFeatureCard key={feature.title} feature={feature} index={idx} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 px-4 md:px-16 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Games
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Start playing your favorite games right now
          </p>
          
          {loadingGames ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading games...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No games available yet</p>
              <p className="text-gray-500 text-sm">Check back soon for amazing WebGL games!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {games.map((game, idx) => (
                <AnimatedGameCard key={game.id} game={game} index={idx} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Start Playing?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join thousands of gamers worldwide and experience the future of browser gaming
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/auth"
              className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-2xl"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} SyncGaming. All rights reserved.
        </motion.div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/play/:gameId" element={<GamePlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
