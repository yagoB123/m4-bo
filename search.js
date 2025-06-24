// Search functionality
class ProductSearch {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.products = this.getProducts();
        this.initEventListeners();
    }

    getProducts() {
        return [
            {
                id: 'pro-training-shoes',
                name: 'Pro Training Shoes',
                price: 129.99,
                image: 'img/pro-training-shoes.jpg',
                category: 'Basketball Shoes',
                page: 'product-detail.html',
                keywords: ['shoes', 'basketball shoes', 'training', 'pro', 'athletic']
            },
            {
                id: 'classic-high-tops',
                name: 'Classic High-Tops',
                price: 149.99,
                image: 'img/classic-high-tops.jpg',
                category: 'Basketball Shoes',
                page: 'product-detail.html',
                keywords: ['shoes', 'high tops', 'classic', 'retro', 'basketball shoes']
            },
            {
                id: 'wilson-evolution',
                name: 'Wilson Evolution',
                price: 64.99,
                image: 'img/wilson-ball.jpg',
                category: 'Basketballs',
                page: 'product-detail.html',
                keywords: ['wilson', 'evolution', 'basketball', 'premium', 'game ball', 'indoor']
            },
            {
                id: 'team-jersey',
                name: 'Team Jersey',
                price: 59.99,
                image: 'img/team-jersey.jpg',
                category: 'Jerseys',
                page: 'product-detail.html',
                keywords: ['jersey', 'team', 'uniform', 'basketball jersey', 'sportswear']
            },
            {
                id: 'practice-jersey',
                name: 'Practice Jersey',
                price: 49.99,
                image: 'img/practice-jersey.jpg',
                category: 'Jerseys',
                page: 'product-detail.html',
                keywords: ['jersey', 'practice', 'training', 'basketball', 'sportswear']
            },
            {
                id: 'basketball-shorts',
                name: 'Performance Shorts',
                price: 34.99,
                image: 'img/basketball-shorts.jpg',
                category: 'Apparel',
                page: 'product-detail.html',
                keywords: ['shorts', 'basketball shorts', 'performance', 'sportswear']
            },
            {
                id: 'basketball-socks',
                name: 'Elite Basketball Socks',
                price: 14.99,
                image: 'img/basketball-socks.jpg',
                category: 'Accessories',
                page: 'product-detail.html',
                keywords: ['socks', 'basketball socks', 'elite', 'performance']
            },
            {
                id: 'spalding-varsity',
                name: 'Spalding Varsity Basketball',
                price: 54.99,
                image: 'img/spalding-varsity.jpg',
                category: 'Basketballs',
                page: 'product-detail.html',
                keywords: ['spalding', 'varsity', 'basketball', 'game ball', 'official', 'indoor', 'ball']
            }
        ];
    }

    initEventListeners() {
        this.searchForm?.addEventListener('submit', this.handleSearchSubmit.bind(this));
        this.searchInput?.addEventListener('input', this.handleSearchInput.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    handleSearchSubmit(e) {
        e.preventDefault();
        const query = this.searchInput.value.trim().toLowerCase();
        if (query) this.performSearch(query);
    }

    handleSearchInput(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 1) {
            this.performSearch(query);
        } else {
            this.searchResults?.classList.remove('active');
        }
    }

    handleDocumentClick(e) {
        if (e.target.closest('.search-result-item')) {
            this.searchResults?.classList.remove('active');
            this.searchInput.value = '';
        } else if (!this.searchForm?.contains(e.target)) {
            this.searchResults?.classList.remove('active');
        }
    }

    performSearch(query) {
        if (!this.searchResults) return;
        
        // Convert to lowercase and split into terms, removing any empty strings
        const searchTerms = query.toLowerCase()
            .split(/\s+/)
            .filter(term => term.length > 0);
            
        if (searchTerms.length === 0) {
            this.searchResults.innerHTML = '';
            this.searchResults.classList.remove('active');
            return;
        }
        
        // Score products based on matches
        const scoredProducts = this.products.map(product => {
            const score = this.calculateMatchScore(product, searchTerms);
            return { product, score };
        });
        
        // Filter out products with 0 score and sort by score (highest first)
        const results = scoredProducts
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.product);
            
        this.displayResults(results);
    }

    calculateMatchScore(product, searchTerms) {
        // Combine all searchable fields into one string
        const searchableText = [
            product.name,
            product.category,
            product.id,
            ...(product.keywords || [])
        ].join(' ').toLowerCase();

        let totalScore = 0;
        
        // Check each search term
        for (const term of searchTerms) {
            if (term.length < 2) continue; // Skip very short terms
            
            let termScore = 0;
            
            // Check for exact matches first (higher score)
            if (searchableText.includes(term)) {
                // Exact match in name gets highest score
                if (product.name.toLowerCase().includes(term)) {
                    termScore = 10;
                } 
                // Then category
                else if (product.category.toLowerCase().includes(term)) {
                    termScore = 8;
                }
                // Then keywords
                else if (product.keywords?.some(kw => kw.toLowerCase().includes(term))) {
                    termScore = 6;
                }
                // Then anywhere else
                else {
                    termScore = 3;
                }
            }
            // Check for partial matches
            else {
                const words = searchableText.split(/\s+/);
                for (const word of words) {
                    if (word.includes(term) || term.includes(word)) {
                        termScore = 5; // Partial match score
                        break;
                    }
                }
            }
            
            // If no match found for this term, the product doesn't match
            if (termScore === 0) return 0;
            
            totalScore += termScore;
        }
        
        return totalScore;
    }

    displayResults(results) {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = '';
        this.searchResults.classList.toggle('active', results.length > 0);

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No products found';
            this.searchResults.appendChild(noResults);
        } else {
            results.slice(0, 5).forEach(product => {
                const resultItem = document.createElement('a');
                // Ensure we're using the correct URL format: page + ?id=productId
                const productUrl = `${product.page}?id=${encodeURIComponent(product.id)}`;
                resultItem.href = productUrl;
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name.replace(/"/g, '&quot;')}" 
                         onerror="this.src='https://via.placeholder.com/100?text=Image+Not+Found';">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <span class="category">${product.category}</span>
                    </div>`;
                this.searchResults.appendChild(resultItem);
            });
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new ProductSearch());