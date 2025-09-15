const { createApp } = Vue;

createApp({
    data() {
        return {
            novels: [],
            loading: true,
            favorites: [],
            selectedCategory: 'all',
            filteredNovels: [],
            currentHero: 'hero-aurora-night',
            availableHeroes: [
                'hero-aurora-night',
                'hero-soft-parchment-waves',
                'hero-neon-swirl',
                'hero-grid-glow'
            ],
            showBackToTop: false
        }
    },
    computed: {
        completedNovels() {
            return this.novels.filter(novel => novel.isCompleted).length;
        },
        ongoingNovels() {
            return this.novels.filter(novel => !novel.isCompleted).length;
        },
        displayNovels() {
            if (this.selectedCategory === 'all') {
                return this.novels;
            }
            // Filter novels by category
            const categoryMap = {
                'fantasy': ['Fantasy', 'Xianxia'],
                'scifi': ['Sci-Fi'],
                'romance': ['Romance'],
                'mystery': ['Mystery'],
                'wuxia': ['Wuxia'],
                'slice_of_life': ['Urban'],
                'comedy': ['Urban'],
                'horror': ['Mystery'],
                'thriller': ['Mystery'],
                'cyberpunk': ['Sci-Fi'],
                'fanfic': ['Urban'],
                'historical': ['Historical']
            };
            
            const targetCategories = categoryMap[this.selectedCategory] || [];
            return this.novels.filter(novel => 
                targetCategories.includes(novel.category)
            );
        }
    },
    async mounted() {
        await this.loadNovels();
        this.loadFavorites();
        this.initSidebarScroll();
        this.initScrollListener();
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
        },
        filterByCategory(category) {
            this.selectedCategory = category;
            // Update category item active state
            this.$nextTick(() => {
                const categoryItems = document.querySelectorAll('.category-item');
                categoryItems.forEach(item => {
                    item.classList.remove('active');
                    const label = item.querySelector('.category-label').textContent;
                    if (category === 'all' && label === 'All') {
                        item.classList.add('active');
                    } else if (category !== 'all' && label === this.getCategoryLabel(category)) {
                        item.classList.add('active');
                    }
                });
            });
        },
        getCategoryLabel(category) {
            const labels = {
                'fantasy': 'Fantasy',
                'scifi': 'Sci-Fi',
                'romance': 'Romance',
                'mystery': 'Mystery',
                'wuxia': 'Wuxia',
                'slice_of_life': 'Slice of Life',
                'comedy': 'Comedy',
                'horror': 'Horror',
                'thriller': 'Thriller',
                'cyberpunk': 'Cyberpunk',
                'fanfic': 'Fanfic',
                'historical': 'Historical'
            };
            return labels[category] || category;
        },
        switchHero(hero) {
            this.currentHero = hero;
        },
        getHeroLabel(hero) {
            const labels = {
                'hero-aurora-night': 'Aurora Night',
                'hero-soft-parchment-waves': 'Soft Parchment Waves',
                'hero-neon-swirl': 'Neon Swirl',
                'hero-grid-glow': 'Grid Glow'
            };
            return labels[hero] || hero;
        },
        initScrollListener() {
            window.addEventListener('scroll', () => {
                this.showBackToTop = window.scrollY > 500;
            });
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        handleAdClick(adType) {
            console.log('Ad clicked:', adType);
            // You can add specific ad tracking or redirect logic here
            switch(adType) {
                case 'top-banner':
                    // Handle top banner ad click
                    alert('Premium subscription offer clicked!');
                    break;
                case 'middle-content':
                    // Handle middle content ad click
                    alert('Special offer claimed!');
                    break;
                case 'bottom-banner':
                    // Handle bottom banner ad click
                    alert('App download initiated!');
                    break;
                case 'left-sidebar':
                    // Handle left sidebar ad click
                    alert('New release novels - Redirecting to latest books!');
                    break;
                case 'left-sidebar-2':
                    // Handle second left sidebar ad
                    alert('Personalized recommendations activated!');
                    break;
                case 'left-sidebar-3':
                    // Handle third left sidebar ad
                    alert('Premium upgrade - Redirecting to subscription page!');
                    break;
                case 'right-sidebar':
                    // Handle right sidebar ad click
                    alert('Trending novels - Showing popular books!');
                    break;
                case 'right-sidebar-2':
                    // Handle second right sidebar ad
                    alert('Reading list feature - Creating your list!');
                    break;
                case 'right-sidebar-3':
                    // Handle third right sidebar ad
                    alert('Community feature - Joining book discussions!');
                    break;
                default:
                    console.log('Unknown ad type:', adType);
            }
        },
        initSidebarScroll() {
            console.log('Initializing sidebar scroll...');
            
            // Wait for DOM to fully load
            this.$nextTick(() => {
                const stickyElements = document.querySelectorAll('.sidebar-ad-sticky');
                console.log('Found sticky elements:', stickyElements.length);
                
                if (stickyElements.length === 0) {
                    console.log('No sticky elements found, retrying in 1 second...');
                    setTimeout(() => this.initSidebarScroll(), 1000);
                    return;
                }
                
                // Force set CSS properties
                stickyElements.forEach((element, index) => {
                    console.log(`Setting up sticky element ${index + 1}`);
                    element.style.position = 'sticky';
                    element.style.top = '20px';
                    element.style.zIndex = '100';
                    
                    // Test scroll event
                    window.addEventListener('scroll', () => {
                        console.log('Scroll event triggered, scrollY:', window.scrollY);
                    }, { passive: true });
                });
                
                console.log('Sidebar scroll initialization complete');
            });
        }
    }
}).mount('#app');
