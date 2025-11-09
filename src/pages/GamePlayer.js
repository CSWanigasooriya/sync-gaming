import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import JSZip from 'jszip';
import { db } from '../firebase';
import Navbar from '../components/Navbar';

export default function GamePlayer() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    fetchGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'games', gameId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setGame(gameData);

        // Extract and load the game from zip (Base64 from Firestore)
        await loadGameFromZip(gameData);

        // Increment download count
        await updateDoc(docRef, {
          downloads: (gameData.downloads || 0) + 1
        });
      } else {
        setError('Game not found');
      }
    } catch (err) {
      setError('Failed to load game: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGameFromZip = async (gameData) => {
    try {
      if (gameData.fileData) {
        // Decode Base64 to binary
        const binaryString = atob(gameData.fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Extract ZIP file
        const zip = new JSZip();
        await zip.loadAsync(bytes);

        // Find index.html
        let indexHtmlContent = null;
        let indexHtmlPath = null;

        // Search for index.html in the root or first folder
        zip.forEach((relativePath, file) => {
          if (relativePath.endsWith('index.html') && !file.dir) {
            indexHtmlPath = relativePath;
          }
        });

        if (indexHtmlPath) {
          indexHtmlContent = await zip.file(indexHtmlPath).async('string');

          // Create a custom HTML that can load resources from the zip
          const modifiedHtml = createSandboxedHTML(indexHtmlContent);
          setIframeContent(modifiedHtml);

          // Also create download URL for backup
          const blob = new Blob([bytes], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          setGameUrl(url);
        } else {
          setError('No index.html found in the uploaded ZIP file');
        }
      }
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Failed to load game content: ' + err.message);
    }
  };

  const createSandboxedHTML = (htmlContent) => {
    // Wrap the HTML content in a safe container
    const wrapper = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          html, body { width: 100%; height: 100%; }
          canvas { display: block; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    return wrapper;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="text-4xl">🎮</div>
          </div>
          <p className="text-xl">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar isScrolled={true} />

      {/* Game Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-20 px-4 mb-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 mb-6">
            <img 
              src={game?.thumbnail} 
              alt={game?.title}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{game?.title}</h1>
              <p className="text-gray-400 mb-4">{game?.description}</p>
              <div className="flex gap-6 text-sm text-gray-500">
                <span>📊 Downloads: {game?.downloads || 0}</span>
                <span>👤 By: {game?.createdBy}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Container */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black rounded-lg overflow-hidden border border-gray-700"
        >
      {/* WebGL Game Container */}
          <div className="w-full aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
            {iframeContent ? (
              <iframe
                srcDoc={iframeContent}
                className="w-full h-full border-0"
                title="Game Player"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-400 mb-4">Game Preview</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Loading game...
                </p>
              </div>
            )}
          </div>

          {/* Download Button */}
          {gameUrl && (
            <div className="mt-4 flex gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={gameUrl}
                download={`${game?.title}.zip`}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
              >
                Download Game
              </motion.a>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-xl p-6 rounded-lg border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4">How to Play</h3>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>The game is playing in the browser above</li>
            <li>Use your mouse and keyboard to control the game</li>
            <li>Alternatively, download the game zip file and run it locally</li>
            <li>Enjoy the game!</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
