const { createApp } = Vue;

createApp({
    data() {
        return {
            novels: [],
            loading: true,
            selectedCategoryFilter: 'all',
            favorites: []
        }
    },
    computed: {
        categories() {
            const cats = [...new Set(this.novels.map(novel => novel.category))];
            return cats.sort();
        },
        filteredCategoryNovels() {
            if (this.selectedCategoryFilter === 'all') {
                return this.novels;
            }
            return this.novels.filter(novel => novel.category === this.selectedCategoryFilter);
        },
        completedCount() {
            return this.filteredCategoryNovels.filter(novel => novel.isCompleted).length;
        },
        ongoingCount() {
            return this.filteredCategoryNovels.filter(novel => !novel.isCompleted).length;
        }
    },
    async mounted() {
        await this.loadNovels();
        this.loadFavorites();
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
            } finally {
                this.loading = false;
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
        setCategoryFilter(category) {
            this.selectedCategoryFilter = category;
        },
        getCategoryIcon(category) {
            const icons = {
                '仙侠': '⚔️',
                '玄幻': '🔮',
                '都市': '🏙️',
                '历史': '📜',
                '科幻': '🚀',
                '言情': '💕',
                '悬疑': '🔍',
                '武侠': '🗡️'
            };
            return icons[category] || '📖';
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
