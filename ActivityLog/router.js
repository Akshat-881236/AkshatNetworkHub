// =====================================
// ANH - Akshat Network Hub
// Router.js - URL History Manager
// IndexedDB Integration for Data Storage
// =====================================

class HistoryRouter {
  constructor() {
    this.dbName = 'ANH_HistoryDB';
    this.storeName = 'urlHistory';
    this.db = null;
    this.screenTimeStart = null;
    this.currentUrl = null;
    
    this.initDB();
    this.setupEventListeners();
    this.startScreenTimeTracking();
  }

  // Initialize IndexedDB
  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          objectStore.createIndex('url', 'url', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('title', 'title', { unique: false });
          
          console.log('Object store created with indexes');
        }
      };
    });
  }

  // Start Screen Time Tracking
  startScreenTimeTracking() {
    this.screenTimeStart = Date.now();
    this.currentUrl = window.location.href;

    window.addEventListener('beforeunload', () => {
      this.recordHistory();
    });

    window.addEventListener('focus', () => {
      this.screenTimeStart = Date.now();
    });

    window.addEventListener('blur', () => {
      this.recordHistory();
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordHistory();
      } else {
        this.screenTimeStart = Date.now();
      }
    });
  }

  // Extract and Store URL Information
  async recordHistory() {
    if (!this.screenTimeStart) return;

    const screentime = Math.round((Date.now() - this.screenTimeStart) / 1000);
    
    const historyEntry = {
      url: this.currentUrl,
      title: document.title || 'Untitled',
      timestamp: new Date().toISOString(),
      screentime: screentime,
      pageLoadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
      domain: new URL(this.currentUrl).hostname
    };

    await this.addToHistory(historyEntry);
    this.screenTimeStart = null;
  }

  // Add Entry to IndexedDB
  async addToHistory(entry) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('Entry added to history:', entry);
        this.updateDashboard();
        resolve(request.result);
      };
    });
  }

  // Get All History Entries
  async getAllHistory() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Get History by URL
  async getHistoryByUrl(url) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('url');
      const request = index.getAll(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Delete History Entry
  async deleteHistory(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('Entry deleted:', id);
        this.updateDashboard();
        resolve();
      };
    });
  }

  // Clear All History
  async clearAllHistory() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('All history cleared');
        this.updateDashboard();
        resolve();
      };
    });
  }

  // Search History
  async searchHistory(query) {
    const allHistory = await this.getAllHistory();
    return allHistory.filter(entry => 
      entry.url.toLowerCase().includes(query.toLowerCase()) ||
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.domain.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Update Dashboard (will be called from dashboard.js)
  async updateDashboard() {
    const event = new CustomEvent('historyUpdated', { detail: await this.getAllHistory() });
    document.dispatchEvent(event);
  }

  // Setup Event Listeners
  setupEventListeners() {
    document.addEventListener('routerRevisit', (event) => {
      window.open(event.detail.url, '_blank');
    });

    document.addEventListener('routerDelete', (event) => {
      this.deleteHistory(event.detail.id);
    });

    document.addEventListener('routerClear', () => {
      this.clearAllHistory();
    });

    document.addEventListener('routerSearch', async (event) => {
      const results = await this.searchHistory(event.detail.query);
      const searchEvent = new CustomEvent('searchResults', { detail: results });
      document.dispatchEvent(searchEvent);
    });
  }

  // Format Time Display
  formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  }

  // Format Timestamp
  formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

// Initialize Router when DOM is ready
let historyRouter;
document.addEventListener('DOMContentLoaded', () => {
  historyRouter = new HistoryRouter();
});

// ===================================== Pop up Visit Card for Previous Visit Page on load of Any ANH page after 120 seconds of visit =====================================//
setTimeout(() => {
  if (window.location.href.includes('/AkshatNetworkHub/ActivityLog/index.htm')) return; // Don't show on dashboard
    if (confirm('You have been on this page for a while. Would you like to review your browsing history?')) {
        window.open('/AkshatNetworkHub/ActivityLog/index.htm', '_blank');
    }
}, 120000); // 120 seconds = 2 minutes

// Show User messages like Resume your Last Journey where you leave last day based on Activity log in next 150 seconds i.e., 300 seconds of visit
setTimeout(() => {
  if (window.location.href.includes('/AkshatNetworkHub/ActivityLog/index.htm')) return; // Don't show on dashboard
    if (confirm('Welcome back! Would you like to resume your last browsing session?')) {
        window.open('/AkshatNetworkHub/ActivityLog/index.htm', '_blank');
    }
}, 300000); // 300 seconds = 5 minutes