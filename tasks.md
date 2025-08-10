- translations (i18n)
- tests
- pages (browse / library)
          For the Browse Tab:

            1. Advanced Filtering System:
                - Add filter options by country, language, and bitrate
                - Implement a search bar with autocomplete suggestions
                - Create "Mood-based" categories (e.g., "Relaxing", "Energetic", "Focus")

            2. Discovery Features:
                - "Random Station" button for serendipitous discovery
                - "Similar to Favorites" section based on user's favorite stations
                - "Trending Now" section showing stations with higher recent plays

            3. Interactive Elements:
                - Genre exploration map or wheel visualization
                - Country-based world map for geographic browsing
                - Tag cloud for quick category access

            For the Library Tab:

            1. Personalization Features:
                - Recently played stations section
                - Custom playlists creation feature
                - Listening history with timestamps and duration

            2. Organization Tools:
                - Custom tags for user's stations
                - Smart folders based on listening patterns
                - Export/Import functionality for station lists

            3. Social Features:
                - "Friends' Favorites" section
                - Community-created station lists
                - Listening stats and achievements

            Implementation Approach:

            1. Browse Tab:
                - Create dedicated /browse page with advanced filtering UI
                - Add visualizations for data exploration
                - Implement search with real-time results

            2. Library Tab:
                - Develop /library page with tabbed interface (History, Playlists, etc.)
                - Add data persistence for user-created content
                - Create management tools for user's collections
- remember the last station played, and offer as featured/