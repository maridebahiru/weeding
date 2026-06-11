import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');

async function optimizeImages() {
  console.log('Starting image optimization...');
  const files = fs.readdirSync(assetsDir);
  
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      
      // If file is larger than 1MB
      if (stats.size > 1024 * 1024 && !file.includes('-optimized')) {
        console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
        
        const optimizedPath = path.join(assetsDir, `optimized-${file}`);
        
        try {
          await sharp(filePath)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({ quality: 75 })
            .toFile(optimizedPath);
            
          console.log(`Done! Original: ${(stats.size / 1024 / 1024).toFixed(2)} MB. Replacing...`);
          
          // Replace original with optimized
          fs.unlinkSync(filePath);
          fs.renameSync(optimizedPath, filePath);
        } catch (err) {
          console.error(`Error optimizing ${file}:`, err);
        }
      }
    }
  }
  console.log('Optimization complete!');
}

optimizeImages();
