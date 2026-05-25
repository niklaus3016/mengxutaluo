import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceIcon = path.join(__dirname, 'mengxu512.png');

// Android mipmap icon sizes
const mipmapSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Android splash screen sizes (portrait and landscape)
const splashSizes = {
  'drawable-port-mdpi': { width: 320, height: 480 },
  'drawable-port-hdpi': { width: 480, height: 720 },
  'drawable-port-xhdpi': { width: 640, height: 960 },
  'drawable-port-xxhdpi': { width: 960, height: 1440 },
  'drawable-port-xxxhdpi': { width: 1280, height: 1920 },
  'drawable-land-mdpi': { width: 480, height: 320 },
  'drawable-land-hdpi': { width: 720, height: 480 },
  'drawable-land-xhdpi': { width: 960, height: 640 },
  'drawable-land-xxhdpi': { width: 1440, height: 960 },
  'drawable-land-xxxhdpi': { width: 1920, height: 1280 }
};

async function replaceIcons() {
  console.log('Starting icon replacement...');

  // Replace mipmap icons
  for (const [folder, size] of Object.entries(mipmapSizes)) {
    const folderPath = path.join(__dirname, 'android/app/src/main/res', folder);
    
    const iconFiles = ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'];
    
    for (const iconFile of iconFiles) {
      const outputPath = path.join(folderPath, iconFile);
      
      console.log(`Processing ${outputPath} (${size}x${size})`);
      
      await sharp(sourceIcon)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .png()
        .toFile(outputPath);
    }
  }

  // Replace splash screens
  for (const [folder, dimensions] of Object.entries(splashSizes)) {
    const folderPath = path.join(__dirname, 'android/app/src/main/res', folder);
    const outputPath = path.join(folderPath, 'splash.png');
    
    console.log(`Processing ${outputPath} (${dimensions.width}x${dimensions.height})`);
    
    await sharp(sourceIcon)
      .resize(dimensions.width, dimensions.height, { fit: 'contain', background: { r: 10, g: 10, b: 15, alpha: 1 } })
      .png()
      .toFile(outputPath);
  }

  // Replace main drawable splash
  const mainSplashPath = path.join(__dirname, 'android/app/src/main/res/drawable/splash.png');
  console.log(`Processing ${mainSplashPath} (512x512)`);
  
  await sharp(sourceIcon)
    .resize(512, 512, { fit: 'contain', background: { r: 10, g: 10, b: 15, alpha: 1 } })
    .png()
    .toFile(mainSplashPath);

  console.log('All icons replaced successfully!');
}

replaceIcons().catch(console.error);
