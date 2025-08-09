const axios = require('axios');
const fs = require('fs');

async function fetchWebsiteStructure() {
  try {
    console.log('Fetching website structure from canliradyodinle.fm...');
    
    // Fetch the main page with a browser-like user agent
    const response = await axios.get('https://www.canliradyodinle.fm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Save the raw HTML for analysis
    fs.writeFileSync('website.html', response.data);
    console.log('Website HTML saved to website.html');
    
    // Show first 2000 characters of the HTML
    console.log('First 2000 characters of HTML:');
    console.log(response.data.substring(0, 2000));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching website structure:', error.message);
    return '';
  }
}

// Run the function
fetchWebsiteStructure();