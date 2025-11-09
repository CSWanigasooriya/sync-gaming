import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import '../styles/analytics.scss';

function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const auth = getAuth();

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    } else if (activeTab === 'games' && selectedGame) {
      fetchGameAnalytics(selectedGame);
    }
  }, [activeTab, selectedGame]);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/analytics/all-users?limit=${pagination.limit}&offset=${pagination.offset}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameAnalytics = async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/analytics/game/${gameId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch game analytics');
      const data = await response.json();
      setGames([data.analytics]);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching game analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {[
          { id: 'users', label: '👥 Top Users', icon: '👤' },
          { id: 'games', label: '🎮 Game Stats', icon: '📊' }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200"
        >
          <p className="font-semibold">Error: {error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={activeTab === 'users' ? fetchAllUsers : () => selectedGame && fetchGameAnalytics(selectedGame)}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition"
          >
            Retry
          </motion.button>
        </motion.div>
      )}

      {/* Top Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  📊
                </motion.div>
                <p className="text-gray-400">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No users yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl font-bold w-10 text-center text-blue-400">
                        #{user.rank || idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{user.userName || 'Unknown'}</p>
                        <p className="text-sm text-gray-400">{user.userEmail || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">{user.totalGamesPlayed || 0}</p>
                      <p className="text-xs text-gray-400">Games</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-400">{formatTime(user.totalPlayTime || 0)}</p>
                      <p className="text-xs text-gray-400">Playtime</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{user.totalScore || 0}</p>
                      <p className="text-xs text-gray-400">Total Score</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex gap-4 justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPagination({ ...pagination, offset: Math.max(0, pagination.offset - pagination.limit) })}
                disabled={pagination.offset === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded font-semibold transition"
              >
                ← Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPagination({ ...pagination, offset: pagination.offset + pagination.limit })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
              >
                Next →
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Game Stats Tab */}
      {activeTab === 'games' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Game Selector Placeholder */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              ℹ️ Game analytics require a specific game ID. This feature displays detailed stats for a selected game including top players, play frequency, and score distributions.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  🎮
                </motion.div>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : games.length > 0 && games[0] ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 rounded-lg p-6 space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Total Plays</p>
                  <p className="text-3xl font-bold text-blue-400">{games[0].totalPlays || 0}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Unique Players</p>
                  <p className="text-3xl font-bold text-purple-400">{games[0].totalPlayers || 0}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Avg Score</p>
                  <p className="text-3xl font-bold text-green-400">{Math.round(games[0].averageScore || 0)}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">High Score</p>
                  <p className="text-3xl font-bold text-yellow-400">{games[0].highScore || 0}</p>
                </div>
              </div>

              {/* Top Players */}
              {games[0].topPlayers && games[0].topPlayers.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold mb-3">🏆 Top Players</h4>
                  <div className="space-y-2">
                    {games[0].topPlayers.map((player, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-900 p-3 rounded">
                        <span className="text-xl font-bold text-blue-400">#{idx + 1}</span>
                        <span className="flex-1">{player.userName}</span>
                        <span className="text-green-400 font-bold">{player.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Select a game to view detailed analytics</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AdminAnalytics;
