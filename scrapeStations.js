const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Target format: { stationName: string, stationIconUrl: string, stationCategories: string[], stationPlaybackUrl: string }

async function getStreamUrlFromStationPage(stationUrl) {
  try {
    console.log(`Fetching stream URL from: ${stationUrl}`);
    const response = await axios.get(stationUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Look for the streaming URL in various possible locations
    let streamUrl = '';
    
    // Check for direct audio source
    const audioSrc = $('audio source').attr('src');
    if (audioSrc) {
      streamUrl = audioSrc;
    }
    
    // Check for JavaScript change_radio function calls
    const scripts = $('script').html();
    if (scripts) {
      const streamMatch = scripts.match(/change_radio\(['"]([^'"]+)['"]\)/);
      if (streamMatch && streamMatch[1]) {
        streamUrl = streamMatch[1];
      }
    }
    
    // Check for onclick attributes with change_radio
    const onclickElements = $('[onclick*="change_radio"]');
    if (onclickElements.length > 0) {
      const onclick = onclickElements.first().attr('onclick');
      if (onclick) {
        const streamMatch = onclick.match(/change_radio\(['"]([^'"]+)['"]\)/);
        if (streamMatch && streamMatch[1]) {
          streamUrl = streamMatch[1];
        }
      }
    }
    
    return streamUrl;
  } catch (error) {
    console.error(`Error fetching stream URL from ${stationUrl}:`, error.message);
    return '';
  }
}

async function scrapeRadioStations() {
  try {
    console.log('Fetching radio stations from canliradyodinle.fm...');
    
    // Fetch the main page
    const response = await axios.get('https://www.canliradyodinle.fm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const stations = [];
    
    // Extract stations from the "Canlı Radyo Listesi" section
    const stationElements = $('.canli-radyo-listesi li a');
    console.log(`Found ${stationElements.length} station elements`);
    
    for (let i = 0; i < Math.min(stationElements.length, 10); i++) { // Limit to 10 for testing
      try {
        const element = stationElements[i];
        const $element = $(element);
        const stationName = $element.find('strong').text().trim();
        let stationIconUrl = $element.find('img').attr('data-lazy-src') || $element.find('img').attr('src') || '';
        const stationPageUrl = $element.attr('href') || '';
        
        // Validate and clean up the data
        if (stationName && stationIconUrl && stationPageUrl) {
          // Fix relative URLs
          if (stationIconUrl.startsWith('//')) {
            stationIconUrl = 'https:' + stationIconUrl;
          } else if (stationIconUrl.startsWith('/') && !stationIconUrl.startsWith('//')) {
            stationIconUrl = `https://www.canliradyodinle.fm${stationIconUrl}`;
          }
          
          // Fix page URLs
          let fullPageUrl = stationPageUrl;
          if (stationPageUrl.startsWith('/') && !stationPageUrl.startsWith('//')) {
            fullPageUrl = `https://www.canliradyodinle.fm${stationPageUrl}`;
          }
          
          // Get the actual streaming URL by visiting the station page
          const streamUrl = await getStreamUrlFromStationPage(fullPageUrl);
          
          // Extract categories from the page URL or navigation
          const categories = [];
          if (fullPageUrl.includes('turkce-pop')) {
            categories.push('Pop');
          } else if (fullPageUrl.includes('turkce-slow')) {
            categories.push('Slow');
          } else if (fullPageUrl.includes('arabesk')) {
            categories.push('Arabesk');
          } else if (fullPageUrl.includes('halk-muzigi')) {
            categories.push('Halk Müziği');
          } else if (fullPageUrl.includes('sanat-muzigi')) {
            categories.push('Sanat Müziği');
          } else if (fullPageUrl.includes('islami')) {
            categories.push('İslami');
          } else if (fullPageUrl.includes('haber') || fullPageUrl.includes('spor')) {
            categories.push('Haber ve Spor');
          } else if (fullPageUrl.includes('rap') || fullPageUrl.includes('rock')) {
            categories.push('Rap ve Rock');
          } else if (fullPageUrl.includes('yabanci')) {
            categories.push('Yabancı Müzik');
          } else if (fullPageUrl.includes('web')) {
            categories.push('Web Radyo');
          } else if (fullPageUrl.includes('klasik')) {
            categories.push('Klasik Müzik');
          }
          
          stations.push({
            stationName,
            stationIconUrl,
            stationCategories: categories,
            stationPlaybackUrl: streamUrl || fullPageUrl // Fallback to page URL if stream not found
          });
          
          console.log(`Processed: ${stationName}`);
        }
      } catch (error) {
        console.error('Error processing station element:', error);
      }
    }
    
    // Save to JSON file
    fs.writeFileSync('radioStations.json', JSON.stringify(stations, null, 2));
    console.log(`Successfully scraped ${stations.length} radio stations!`);
    console.log('Data saved to radioStations.json');
    
    // Log first few stations as example
    console.log('\nFirst 5 stations:');
    console.log(stations.slice(0, 5));
    
    return stations;
  } catch (error) {
    console.error('Error scraping radio stations:', error.message);
    return [];
  }
}

// Run the scraper
scrapeRadioStations();