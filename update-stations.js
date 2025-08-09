const fs = require('fs');

// Load the data
const radioGroups = require('./lib/data/radio-groups.json');
const radioStations = require('./lib/data/radio-stations.json');

// Create a map of group names to slugs
const groupSlugMap = {};
radioGroups.forEach(group => {
  groupSlugMap[group.groupName] = group.slug;
});

// Update radio stations
const updatedStations = radioStations.map(station => {
  return {
    ...station,
    radioGroups: station.radioGroups.map(groupName => {
      const slug = groupSlugMap[groupName];
      if (slug) {
        return {
          groupName: groupName,
          slug: slug
        };
      }
      // If we can't find the slug, return the original string
      // This shouldn't happen if our data is consistent
      return groupName;
    })
  };
});

// Write the updated data back to the file
fs.writeFileSync('./lib/data/radio-stations.json', JSON.stringify(updatedStations, null, 2));

console.log('Radio stations updated successfully!');