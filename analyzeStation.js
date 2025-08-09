const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function analyzeStationPage() {
  try {
    console.log('Analyzing a station page to understand streaming URL structure...');
    
    // Fetch a station page
    const response = await axios.get('https://www.canliradyodinle.fm/alem-fm-dinle.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Save the HTML for analysis
    fs.writeFileSync('stationPage.html', response.data);
    console.log('Station page HTML saved to stationPage.html');
    
    const $ = cheerio.load(response.data);
    
    // Look for audio elements
    console.log('\nLooking for audio elements:');
    $('audio').each((i, elem) => {
      console.log(`Audio element ${i}:`, $(elem).html());
      console.log(`Source:`, $(elem).find('source').attr('src'));
    });
    
    // Look for JavaScript functions
    console.log('\nLooking for JavaScript functions:');
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html() || $(elem).attr('src') || '';
      if (scriptContent.includes('change_radio') || scriptContent.includes('stream')) {
        console.log(`Script ${i}:`, scriptContent.substring(0, 200) + (scriptContent.length > 200 ? '...' : ''));
      }
    });
    
    // Look for onclick handlers
    console.log('\nLooking for onclick handlers:');
    $('[onclick]').each((i, elem) => {
      const onclick = $(elem).attr('onclick');
      if (onclick.includes('change_radio') || onclick.includes('stream')) {
        console.log(`Onclick ${i}:`, onclick);
      }
    });
    
  } catch (error) {
    console.error('Error analyzing station page:', error.message);
  }
}

// Run the analysis
analyzeStationPage();