import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

const auth = getAuth(app);

export default function Navbar({ isScrolled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user is admin
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          setIsAdmin(idTokenResult.claims.admin || false);
        } catch (err) {
          console.error('Error checking admin status:', err);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full min-w-0">
        <motion.div 
          className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
        >
          SyncGaming
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {!loading && user ? (
            <>
              <div className="text-xs sm:text-sm text-gray-300 hidden sm:block truncate max-w-[200px] lg:max-w-none">
                {user.email || user.displayName || 'User'}
              </div>
              {isAdmin && location.pathname !== '/admin' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/admin"
                    className="px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                  >
                    Admin Panel
                  </Link>
                </motion.div>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition shadow-lg font-semibold text-xs sm:text-sm whitespace-nowrap"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/auth"
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-semibold text-xs sm:text-sm whitespace-nowrap"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
