// generate-sitemap.js
const fs = require('fs');
const path = require('path');

// Get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Define the base URL (update this to your actual domain)
const BASE_URL = 'https://radiohead-one.vercel.app';

// Define the pages with their priorities and change frequencies
// changefreq values can be "always", "hourly", "daily", "weekly", "monthly", "yearly", or "never"
const pages = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/browse', priority: '0.9', changefreq: 'monthly' },
  { path: '/favorites', priority: '0.7', changefreq: 'monthly' },
  { path: '/library', priority: '0.7', changefreq: 'monthly' },
  { path: '/radyo-dinle', priority: '0.9', changefreq: 'weekly' },
  // Add more pages here as they are created
];

// Read radio groups data
const radioGroupsPath = path.join(__dirname, 'lib', 'data', 'radio-groups.json');
const radioGroups = JSON.parse(fs.readFileSync(radioGroupsPath, 'utf8'));

// Add radio group pages to the sitemap
radioGroups.forEach(group => {
  pages.push({
    path: `/group/${group.slug}`,
    priority: '0.8',
    changefreq: 'monthly'
  });
});

// Generate the sitemap XML
const generateSitemap = () => {
  const currentDate = getCurrentDate();
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>' + '\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + '\n';
  
  pages.forEach(page => {
    sitemap += '  <url>' + '\n';
    sitemap += `    <loc>${BASE_URL}${page.path}</loc>` + '\n';
    sitemap += `    <lastmod>${currentDate}</lastmod>` + '\n';
    sitemap += `    <changefreq>${page.changefreq}</changefreq>` + '\n';
    sitemap += `    <priority>${page.priority}</priority>` + '\n';
    sitemap += '  </url>' + '\n';
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
};

// Write the sitemap to the public directory
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const publicDir = path.join(__dirname, 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap generated successfully at:', sitemapPath);
};

// Run the script
writeSitemap();