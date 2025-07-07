const SEARCH_HISTORY_KEY = 'tanakh-grepper-search-history';
const MAX_HISTORY_SIZE = 50;

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

export const addToSearchHistory = (query) => {
  if (!query || query.trim() === '') return;
  
  try {
    const history = getSearchHistory();
    const trimmedQuery = query.trim();
    
    // Remove existing entry if it exists
    const filteredHistory = history.filter(item => item !== trimmedQuery);
    
    // Add to beginning
    const newHistory = [trimmedQuery, ...filteredHistory];
    
    // Limit size
    const limitedHistory = newHistory.slice(0, MAX_HISTORY_SIZE);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};