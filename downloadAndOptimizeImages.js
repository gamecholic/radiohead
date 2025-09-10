const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');
const stations = require('./lib/data/radio-stations.json');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download an image and return a promise
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Image already exists: ${filename}`);
      resolve(filename);
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {}); // Delete the file if download failed
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${filename}`);
          resolve(filename);
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Function to optimize an image (resize, compress, convert to WebP)
async function optimizeImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  const outputFilename = path.parse(filename).name + '.webp';
  const outputPath = path.join(imagesDir, outputFilename);
  
  try {
    // Skip if already optimized
    if (fs.existsSync(outputPath)) {
      console.log(`Already optimized: ${outputFilename}`);
      return outputFilename;
    }
    
    await sharp(inputPath)
      .resize(256, 256, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    // Remove original file after conversion
    fs.unlinkSync(inputPath);
    
    console.log(`Optimized: ${filename} -> ${outputFilename}`);
    return outputFilename;
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
    throw error;
  }
}

// Function to update the radio-stations.json with new image paths
function updateStationsWithNewPaths(stations, imageMap) {
  const updatedStations = stations.map(station => {
    const originalUrl = station.stationIconUrl;
    const filename = path.basename(new URL(originalUrl).pathname);
    const newFilename = imageMap[filename];
    
    if (newFilename) {
      return {
        ...station,
        stationIconUrl: `/images/${newFilename}`
      };
    }
    
    return station;
  });
  
  fs.writeFileSync(
    path.join(__dirname, 'lib', 'data', 'radio-stations.json'),
    JSON.stringify(updatedStations, null, 2),
    'utf-8'
  );
  
  console.log('Updated radio-stations.json with new image paths');
}

// Main function to process all images
async function processAllImages() {
  console.log(`Processing ${stations.length} radio station images...`);
  
  const imageMap = {};
  
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    if (!station.stationIconUrl) continue;
    
    try {
      // Extract filename from URL
      const url = new URL(station.stationIconUrl);
      const filename = path.basename(url.pathname);
      
      // Download image
      await downloadImage(station.stationIconUrl, filename);
      
      // Optimize image
      const optimizedFilename = await optimizeImage(filename);
      
      // Map original filename to optimized filename
      imageMap[filename] = optimizedFilename;
      
      console.log(`Processed ${i + 1}/${stations.length}: ${station.stationName}`);
    } catch (error) {
      console.error(`Error processing ${station.stationName}:`, error.message);
    }
  }
  
  // Update JSON with new paths
  updateStationsWithNewPaths(stations, imageMap);
  
  console.log('All images processed successfully!');
}

// Run the script
processAllImages().catch(error => {
  console.error('Error processing images:', error);
});