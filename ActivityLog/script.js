// =====================================
// ANH Dashboard - Display & Interaction
// =====================================

class Dashboard {
  constructor() {
    this.historyBody = document.getElementById('historyBody');
    this.searchInput = document.getElementById('searchInput');
    this.clearAllBtn = document.getElementById('clearAllBtn');
    this.allHistory = [];
    
    this.setupEventListeners();
    this.loadHistory();
  }

  setupEventListeners() {
    // Search functionality
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // Clear all functionality
    this.clearAllBtn.addEventListener('click', () => {
      this.handleClearAll();
    });

    // Listen for history updates from router
    document.addEventListener('historyUpdated', (event) => {
      this.allHistory = event.detail;
      this.renderTable();
      this.updateStats();
    });

    // Listen for search results
    document.addEventListener('searchResults', (event) => {
      this.renderTable(event.detail);
    });
  }

  async loadHistory() {
    try {
      this.allHistory = await historyRouter.getAllHistory();
      this.renderTable();
      this.updateStats();
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }

  renderTable(data = null) {
    const historyData = data || this.allHistory;
    
    if (historyData.length === 0) {
      this.historyBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="6">
            <div class="empty-message">
              <p>No history records yet</p>
              <small>Start browsing to see your history</small>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Sort by timestamp (newest first)
    const sortedData = [...historyData].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    this.historyBody.innerHTML = sortedData.map((entry, index) => `
      <tr data-id="${entry.id}">
        <td class="col-sr" data-label="SR NO.">
          <span class="sr-no">${index + 1}</span>
        </td>
        <td class="col-title" data-label="Title">
          <span class="title-text" title="${entry.title}">${this.truncateText(entry.title, 50)}</span>
        </td>
        <td class="col-url" data-label="URL">
          <a href="${entry.url}" target="_blank" rel="noopener noreferrer" class="url-text" title="${entry.url}">
            ${this.truncateText(entry.url, 60)}
          </a>
        </td>
        <td class="col-timestamp" data-label="Timestamp">
          <span class="timestamp-text">${historyRouter.formatTimestamp(entry.timestamp)}</span>
        </td>
        <td class="col-screentime" data-label="Screentime">
          <span class="screentime-badge">${historyRouter.formatTime(entry.screentime)}</span>
        </td>
        <td class="col-actions" data-label="Actions">
          <div class="action-buttons">
            <button class="btn-action btn-revisit" 
              onclick="dashboard.revisitUrl('${entry.url}')" 
              title="Revisit" 
              aria-label="Revisit ${entry.title}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 1v6h-6M1 23v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
            <button class="btn-action btn-delete" 
              onclick="dashboard.deleteEntry(${entry.id})" 
              title="Delete" 
              aria-label="Delete ${entry.title}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async handleSearch(query) {
    if (query.trim().length === 0) {
      this.renderTable();
      return;
    }

    document.dispatchEvent(new CustomEvent('routerSearch', { 
      detail: { query } 
    }));
  }

  async handleClearAll() {
    if (confirm('Are you sure you want to delete all history? This action cannot be undone.')) {
      document.dispatchEvent(new Event('routerClear'));
    }
  }

  revisitUrl(url) {
    window.open(url, '_blank');
  }

  async deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
      document.dispatchEvent(new CustomEvent('routerDelete', { 
        detail: { id } 
      }));
    }
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  updateStats() {
    const totalVisits = this.allHistory.length;
    const totalScreentime = this.allHistory.reduce((sum, entry) => sum + entry.screentime, 0);
    const uniqueDomains = new Set(this.allHistory.map(entry => entry.domain)).size;
    const avgSessionTime = totalVisits > 0 ? Math.round(totalScreentime / totalVisits) : 0;

    document.getElementById('totalVisits').textContent = totalVisits;
    document.getElementById('totalScreentime').textContent = this.formatTotalTime(totalScreentime);
    document.getElementById('totalDomains').textContent = uniqueDomains;
    document.getElementById('avgSessionTime').textContent = historyRouter.formatTime(avgSessionTime);
  }

  formatTotalTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

// Initialize Dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new Dashboard();
});