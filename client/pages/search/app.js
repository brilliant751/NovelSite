const { createApp } = Vue;

createApp({
    data() {
        return {
            novels: [],
            searchQuery: '',
            searchResults: [],
            searchCategory: '',
            searchStatus: '',
            sortBy: 'relevance',
            searching: false,
            hasSearched: false,
            favorites: [],
            popularTags: ['Fantasy', 'Xianxia', 'Romance', 'Adventure', 'Magic', 'Cultivation', 'Modern', 'Ancient']
        }
    },
    computed: {
        categories() {
            const cats = [...new Set(this.novels.map(novel => novel.category))];
            return cats.sort();
        }
    },
    async mounted() {
        await this.loadNovels();
        this.loadFavorites();
        
        // Check if there's a search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            this.searchQuery = query;
            this.performSearch();
        }
    },
    methods: {
        async loadNovels() {
            try {
                const response = await axios.get('http://localhost:3000/api/novels');
                this.novels = response.data.map(novel => ({
                    ...novel,
                    isFavorited: false
                }));
                this.updateFavoriteStatus();
            } catch (error) {
                console.error('Failed to load novels:', error);
            }
        },
        loadFavorites() {
            const saved = localStorage.getItem('novelFavorites');
            if (saved) {
                this.favorites = JSON.parse(saved);
                this.updateFavoriteStatus();
            }
        },
        updateFavoriteStatus() {
            this.novels.forEach(novel => {
                novel.isFavorited = this.favorites.includes(novel.id);
            });
        },
        performSearch() {
            if (!this.searchQuery.trim() && !this.searchCategory && !this.searchStatus) {
                this.hasSearched = false;
                this.searchResults = [];
                return;
            }

            this.searching = true;
            this.hasSearched = true;

            // Simulate search delay
            setTimeout(() => {
                let results = [...this.novels];

                // Filter by search query
                if (this.searchQuery.trim()) {
                    const query = this.searchQuery.toLowerCase();
                    results = results.filter(novel => 
                        novel.title.toLowerCase().includes(query) ||
                        novel.author.toLowerCase().includes(query) ||
                        novel.description.toLowerCase().includes(query) ||
                        this.translateCategory(novel.category).toLowerCase().includes(query)
                    );
                }

                // Filter by category
                if (this.searchCategory) {
                    results = results.filter(novel => novel.category === this.searchCategory);
                }

                // Filter by status
                if (this.searchStatus) {
                    const isCompleted = this.searchStatus === 'completed';
                    results = results.filter(novel => novel.isCompleted === isCompleted);
                }

                // Sort results
                switch (this.sortBy) {
                    case 'popularity':
                        results.sort((a, b) => b.readCount - a.readCount);
                        break;
                    case 'latest':
                        results.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
                        break;
                    case 'title':
                        results.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'relevance':
                    default:
                        // Keep current order for relevance
                        break;
                }

                this.searchResults = results;
                this.searching = false;
            }, 300);
        },
        quickSearch(tag) {
            this.searchQuery = tag;
            this.performSearch();
        },
        highlightSearchTerm(text) {
            if (!this.searchQuery.trim()) return text;
            
            const query = this.searchQuery.trim();
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        },
        translateCategory(category) {
            const translations = {
                '仙侠': 'Xianxia',
                '玄幻': 'Fantasy',
                '都市': 'Urban',
                '历史': 'Historical',
                '科幻': 'Sci-Fi',
                '言情': 'Romance',
                '悬疑': 'Mystery',
                '武侠': 'Wuxia'
            };
            return translations[category] || category;
        },
        formatReadCount(count) {
            if (count >= 1000000) {
                return (count / 1000000).toFixed(1) + 'M';
            } else if (count >= 1000) {
                return (count / 1000).toFixed(1) + 'K';
            }
            return count.toString();
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        },
        toggleFavorite(novelId) {
            const index = this.favorites.indexOf(novelId);
            if (index > -1) {
                this.favorites.splice(index, 1);
            } else {
                this.favorites.push(novelId);
            }
            localStorage.setItem('novelFavorites', JSON.stringify(this.favorites));
            this.updateFavoriteStatus();
        },
        startReading(novel) {
            // Navigate to reading page
            window.location.href = `../reading/reading.html?id=${novel.id}`;
        }
    }
}).mount('#app');
