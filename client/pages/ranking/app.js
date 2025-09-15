const { createApp } = Vue;

createApp({
    data() {
        return {
            novels: [],
            loading: true,
            selectedRanking: 'popular',
            favorites: []
        }
    },
    computed: {
        rankedNovels() {
            let sorted = [...this.novels];
            switch (this.selectedRanking) {
                case 'popular':
                    return sorted.sort((a, b) => b.readCount - a.readCount);
                case 'latest':
                    return sorted.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
                case 'completed':
                    return sorted.filter(novel => novel.isCompleted)
                        .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
                default:
                    return sorted;
            }
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
        setRanking(ranking) {
            this.selectedRanking = ranking;
        },
        getRankingClass(index) {
            if (index === 0) return 'gold';
            if (index === 1) return 'silver';
            if (index === 2) return 'bronze';
            return 'regular';
        },
        getRankingIcon(index) {
            if (index === 0) return '🥇';
            if (index === 1) return '🥈';
            if (index === 2) return '🥉';
            return '🏅';
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
