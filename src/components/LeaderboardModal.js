import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/leaderboard.scss';

function LeaderboardModal({ isOpen, onClose, gameId, gameName }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && gameId) {
      fetchLeaderboard();
    }
  }, [isOpen, gameId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/leaderboard/${gameId}?limit=10&offset=0`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      setLeaderboard(data.scores || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '✨';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] overflow-y-auto border border-gray-700"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{gameName}</h2>
                <p className="text-blue-100 text-sm mt-1">🏆 Global Leaderboard</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition"
              >
                ✕
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-4xl mb-4"
                  >
                    🎮
                  </motion.div>
                  <p className="text-gray-400">Loading leaderboard...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200">
                  <p className="font-semibold">Error loading leaderboard</p>
                  <p className="text-sm mt-1">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchLeaderboard}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
                  >
                    Retry
                  </motion.button>
                </div>
              )}

              {!loading && !error && leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-4">📊</p>
                  <p className="text-gray-400">No scores yet</p>
                  <p className="text-gray-500 text-sm mt-2">Be the first to play and set a record!</p>
                </div>
              )}

              {!loading && !error && leaderboard.length > 0 && (
                <div className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 transition-colors flex items-center gap-4 group"
                    >
                      {/* Rank */}
                      <div className="text-2xl font-bold w-12 text-center">
                        {getMedalEmoji(entry.rank || idx + 1)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {entry.userName || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {entry.userEmail || 'N/A'}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">
                          {entry.score}
                        </p>
                        <p className="text-xs text-gray-400">
                          {entry.duration ? `${entry.duration}s` : 'N/A'}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="hidden sm:block text-right min-w-fit">
                        <p className="text-xs text-gray-500">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!loading && !error && leaderboard.length > 0 && (
              <div className="border-t border-gray-700 bg-gray-800/50 p-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing top {leaderboard.length} scores
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchLeaderboard}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                >
                  🔄 Refresh
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LeaderboardModal;
