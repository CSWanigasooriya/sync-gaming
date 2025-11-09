#!/usr/bin/env node

/**
 * Game Packager - Creates ZIP files for all games in the /games directory
 * Usage: node package-games.js [gameName]
 * 
 * Examples:
 *   node package-games.js              # Package all games
 *   node package-games.js cube-game    # Package only cube-game
 * 
 * Output: Creates .zip files in the /games directory
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const gamesDir = path.join(__dirname, 'games');
const args = process.argv.slice(2);
const targetGame = args[0];

console.log('\n🎮 SyncGaming - Game Packager\n');

// Check if games directory exists
if (!fs.existsSync(gamesDir)) {
  console.error('❌ Games directory not found at:', gamesDir);
  process.exit(1);
}

// Get all subdirectories in games folder
const getGameDirs = () => {
  return fs.readdirSync(gamesDir)
    .filter(file => {
      const fullPath = path.join(gamesDir, file);
      return fs.statSync(fullPath).isDirectory();
    });
};

// Create ZIP for a single game
const packageGame = async (gameDir) => {
  return new Promise((resolve, reject) => {
    const gamePath = path.join(gamesDir, gameDir);
    const zipPath = path.join(gamesDir, `${gameDir}.zip`);

    // Check if index.html exists
    if (!fs.existsSync(path.join(gamePath, 'index.html'))) {
      console.warn(`⚠️  Skipping ${gameDir} - no index.html found`);
      resolve();
      return;
    }

    // Create output stream
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ ${gameDir}.zip created (${sizeMB}MB)`);
      resolve();
    });

    archive.on('error', (err) => {
      console.error(`❌ Error packaging ${gameDir}:`, err.message);
      reject(err);
    });

    // Pipe archive to file
    archive.pipe(output);

    // Add all files from game directory to ZIP
    archive.directory(gamePath, gameDir);

    // Finalize the archive
    archive.finalize();
  });
};

// Main execution
const main = async () => {
  try {
    const gameDirs = getGameDirs();

    if (gameDirs.length === 0) {
      console.log('📁 No games found in /games directory');
      console.log('Create a subdirectory for each game with an index.html file\n');
      console.log('Example structure:');
      console.log('  /games/my-game/');
      console.log('    ├── index.html');
      console.log('    ├── style.css');
      console.log('    └── game.js\n');
      process.exit(0);
    }

    const gamesToPackage = targetGame 
      ? gameDirs.filter(g => g === targetGame)
      : gameDirs;

    if (targetGame && gamesToPackage.length === 0) {
      console.error(`❌ Game '${targetGame}' not found in /games directory`);
      console.error(`Available games: ${gameDirs.join(', ')}\n`);
      process.exit(1);
    }

    console.log(`📦 Packaging ${gamesToPackage.length} game(s)...\n`);

    for (const gameDir of gamesToPackage) {
      await packageGame(gameDir);
    }

    console.log('\n✨ All games packaged successfully!');
    console.log(`📂 ZIP files created in: ${gamesDir}\n`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

main();
