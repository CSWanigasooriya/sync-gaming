import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, db, app } from '../firebase';
import Navbar from '../components/Navbar';
import AdminManagement from '../components/AdminManagement';

const auth = getAuth(app);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [gameThumbnail, setGameThumbnail] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('games');

  // Check authentication and admin claims
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/auth');
      } else {
        setUser(currentUser);
        
        // Get token
        const token = await currentUser.getIdToken();
        setUserToken(token);

        // Check admin claims
        const claims = (await currentUser.getIdTokenResult()).claims;
        const isUserAdmin = claims.admin === true;
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          // Not an admin, redirect to home
          navigate('/');
        } else {
          fetchGames();
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch games from Firestore
  const fetchGames = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'games'));
      const snapshot = await getDocs(q);
      const gamesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(gamesList);
    } catch (err) {
      setError('Failed to fetch games: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      
      if (!file.name.endsWith('.zip')) {
        setError('Please upload a .zip file');
      } else if (file.size > MAX_FILE_SIZE) {
        setError(`File too large! Maximum size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      } else {
        setZipFile(file);
        setError('');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      
      if (!file.name.endsWith('.zip')) {
        setError('Please upload a .zip file');
      } else if (file.size > MAX_FILE_SIZE) {
        setError(`File too large! Maximum size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      } else {
        setZipFile(file);
        setError('');
      }
    }
  };

  const handleUploadGame = async (e) => {
    e.preventDefault();
    
    if (!gameTitle || !gameDescription || !gameThumbnail || !zipFile) {
      setError('Please fill in all fields and select a zip file');
      return;
    }

    // Check file size limit (50MB max)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (zipFile.size > MAX_FILE_SIZE) {
      setError(`File too large! Maximum size is 50MB. Your file is ${(zipFile.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Store in Firestore with Base64 encoding (free alternative)
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64String = event.target.result.split(',')[1];

          // Add game metadata and file to Firestore
          await addDoc(collection(db, 'games'), {
            title: gameTitle,
            description: gameDescription,
            thumbnail: gameThumbnail,
            fileData: base64String,  // Base64 encoded ZIP file
            fileName: zipFile.name,
            fileSize: zipFile.size,
            createdAt: new Date(),
            createdBy: user.email,
            downloads: 0
          });

          // Reset form
          setGameTitle('');
          setGameDescription('');
          setGameThumbnail('');
          setZipFile(null);
          
          // Refresh games list
          await fetchGames();
          alert('Game uploaded successfully!');
        } catch (err) {
          setError('Upload failed: ' + err.message);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(zipFile);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setUploading(false);
    }
  };

  const handleDeleteGame = async (gameId, zipFileName) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'games', gameId));

      // Delete from Storage
      const storageRef = ref(storage, zipFileName);
      await deleteObject(storageRef);

      // Refresh games list
      await fetchGames();
    } catch (err) {
      setError('Failed to delete game: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setError('Logout failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <Navbar isScrolled={true} />

      <div className="pt-24 px-4 md:px-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mb-8">Manage games, admins, and platform settings</p>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            {[
              { id: 'games', label: '🎮 Games' },
              { id: 'admins', label: '👨‍💼 Admin Management' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all relative ${
                  activeTab === tab.id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Games Tab */}
            {activeTab === 'games' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid md:grid-cols-3 gap-8"
              >
                {/* Upload Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-1 bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50"
                >
                  <h2 className="text-2xl font-bold mb-6">Upload Game</h2>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleUploadGame} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Game Title"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      value={gameTitle}
                      onChange={e => setGameTitle(e.target.value)}
                      required
                    />

                    <textarea
                      placeholder="Game Description"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
                      value={gameDescription}
                      onChange={e => setGameDescription(e.target.value)}
                      required
                    />

                    <input
                      type="url"
                      placeholder="Thumbnail URL"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      value={gameThumbnail}
                      onChange={e => setGameThumbnail(e.target.value)}
                      required
                    />

                    {/* Drag and Drop Area */}
                    <motion.div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      whileHover={{ borderColor: '#3b82f6' }}
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
                      }`}
                    >
                      <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="pointer-events-none">
                        <div className="text-3xl mb-2">📦</div>
                        {zipFile ? (
                          <p className="text-green-400 font-semibold">{zipFile.name}</p>
                        ) : (
                          <>
                            <p className="text-gray-300">Drag and drop your .zip file</p>
                            <p className="text-gray-500 text-sm">or click to browse</p>
                          </>
                        )}
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={uploading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload Game'}
                    </motion.button>
                  </form>
                </motion.div>

                {/* Games List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-2"
                >
                  <h2 className="text-2xl font-bold mb-6">Games ({games.length})</h2>

                  {loading ? (
                    <p className="text-gray-400">Loading games...</p>
                  ) : games.length === 0 ? (
                    <p className="text-gray-400">No games uploaded yet</p>
                  ) : (
                    <div className="space-y-4">
                      {games.map((game, idx) => (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-gray-800/50 backdrop-blur-xl p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <img 
                                src={game.thumbnail} 
                                alt={game.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">{game.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  Uploaded by {game.createdBy} • {new Date(game.createdAt?.toDate?.()).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={`/play/${game.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 transition text-sm"
                            >
                              Preview
                            </motion.a>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteGame(game.id, game.zipUrl)}
                              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition text-sm"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && userToken && (
              <AdminManagement userToken={userToken} currentUserEmail={user?.email} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
