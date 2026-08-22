import { initialMockState } from '../data/mockData';

const DEMO_STORE_KEY = 'dayflow_demo_state';
const STORE_VERSION = '2'; // Bump this when mockData changes to force re-seed
const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Initialize localStorage if empty or outdated version
const initializeStore = () => {
  const stored = localStorage.getItem(DEMO_STORE_KEY);
  const storedVersion = localStorage.getItem(`${DEMO_STORE_KEY}_version`);
  
  if (!stored || storedVersion !== STORE_VERSION) {
    localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(initialMockState));
    localStorage.setItem(`${DEMO_STORE_KEY}_version`, STORE_VERSION);
    console.log('[DEMO MODE] Store (re-)seeded with latest mock data v' + STORE_VERSION);
  }
};

if (IS_DEMO_MODE) {
  initializeStore();
  console.warn("DAYFLOW DEMO MODE ACTIVE: Using local storage for data persistence.");
}

export const getStore = () => {
  initializeStore();
  return JSON.parse(localStorage.getItem(DEMO_STORE_KEY));
};

export const setStore = (newState) => {
  localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(newState));
  window.dispatchEvent(new Event('demo_store_changed'));
};

/**
 * Fallback Wrapper: Tries the Firebase action. If it fails or if Demo Mode is active,
 * it runs the fallback local action.
 */
export const withFallback = async (firebaseAction, localAction, collectionName = 'data') => {
  if (IS_DEMO_MODE) {
    console.log(`[DEMO MODE] Executing local action for ${collectionName}`);
    return await localAction();
  }

  try {
    return await firebaseAction();
  } catch (error) {
    console.warn(`[FIREBASE ERROR] ${collectionName}: ${error.message}. Falling back to local data.`);
    return await localAction();
  }
};

/**
 * Common Mock Helpers
 */
export const mockHelpers = {
  getCollection: (collectionName) => {
    return getStore()[collectionName] || [];
  },
  
  addDocument: (collectionName, doc) => {
    const store = getStore();
    const newDoc = { ...doc, id: `${collectionName.toUpperCase().substring(0,3)}-${Date.now()}`, createdAt: new Date().toISOString() };
    store[collectionName] = [newDoc, ...(store[collectionName] || [])];
    setStore(store);
    return newDoc;
  },

  updateDocument: (collectionName, id, updates) => {
    const store = getStore();
    if (!store[collectionName]) return null;
    
    const index = store[collectionName].findIndex(d => d.id === id);
    if (index === -1) return null;
    
    store[collectionName][index] = { ...store[collectionName][index], ...updates };
    setStore(store);
    return store[collectionName][index];
  },

  deleteDocument: (collectionName, id) => {
    const store = getStore();
    if (!store[collectionName]) return;
    
    store[collectionName] = store[collectionName].filter(d => d.id !== id);
    setStore(store);
  },
  
  queryCollection: (collectionName, filters = {}) => {
    let data = getStore()[collectionName] || [];
    Object.keys(filters).forEach(key => {
      data = data.filter(item => item[key] === filters[key]);
    });
    return data;
  }
};
