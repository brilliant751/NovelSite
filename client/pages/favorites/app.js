const { createApp } = Vue;

createApp({
    data() {
        return {
            novels: [],
            favorites: [],
            loading: true
        }
    },
    computed: {
        favoriteNovels() {
            return this.novels.filter(novel => this.favorites.includes(novel.id));
        },
        completedFavorites() {
            return this.favoriteNovels.filter(novel => novel.isCompleted).length;
        },
        ongoingFavorites() {
            return this.favoriteNovels.filter(novel => !novel.isCompleted).length;
        }
    },
    async mounted() {
        this.loadFavorites();
        await this.loadNovels();
    },
    methods: {
        async loadNovels() {
            try {
                const response = await axios.get('http://localhost:3000/api/novels');
                this.novels = response.data;
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
            }
        },
        removeFavorite(novelId) {
            const index = this.favorites.indexOf(novelId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                localStorage.setItem('novelFavorites', JSON.stringify(this.favorites));
            }
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
        startReading(novel) {
            // Navigate to reading page
            window.location.href = `../reading/reading.html?id=${novel.id}`;
        }
    }
}).mount('#app');
