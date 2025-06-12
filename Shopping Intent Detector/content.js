// Shopping Intent Detector Content Script
(function() {
    'use strict';
    
    // Prevent multiple executions
    if (window.shoppingIntentDetectorLoaded) {
        return;
    }
    window.shoppingIntentDetectorLoaded = true;
    
    // Shopping intent keywords and patterns
    const SHOPPING_KEYWORDS = [
        // Action words
        'buy', 'purchase', 'order', 'shop', 'get', 'find', 'search for',
        // Price-related
        'price', 'cost', 'cheap', 'expensive', 'discount', 'deal', 'sale', 'offer',
        'under', 'budget', 'affordable', 'free shipping',
        // Quality indicators
        'best', 'top', 'review', 'rating', 'compare', 'vs', 'versus',
        // Product categories
        'shoes', 'clothing', 'shirt', 'pants', 'dress', 'jacket', 'watch', 'jewelry',
        'phone', 'laptop', 'computer', 'tablet', 'headphones', 'camera',
        'book', 'furniture', 'chair', 'table', 'bed', 'sofa',
        'car', 'bike', 'electronics', 'gadget', 'appliance',
        'makeup', 'skincare', 'perfume', 'shampoo',
        'food', 'restaurant', 'hotel', 'flight', 'vacation',
        // Brand indicators
        'brand', 'model', 'size', 'color', 'style', 'type',
        // Shopping platforms
        'amazon', 'ebay', 'walmart', 'target', 'store', 'shop'
    ];
    
    // Exclusion patterns (informational queries)
    const EXCLUSION_KEYWORDS = [
        'how to', 'what is', 'who is', 'where is', 'when is', 'why',
        'history of', 'definition', 'meaning', 'explain',
        'tutorial', 'guide', 'learn', 'study',
        'weather', 'news', 'directions', 'map',
        'recipe', 'cooking', 'health', 'medical',
        'wikipedia', 'wiki'
    ];
    
    /**
     * Extract search query from URL parameters
     */
    function getSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        return query ? query.toLowerCase() : '';
    }
    
    /**
     * Detect if query has shopping intent
     */
    function hasShoppingIntent(query) {
        if (!query || query.trim() === '') {
            return false;
        }
        
        // Check for exclusion patterns first
        for (const exclusion of EXCLUSION_KEYWORDS) {
            if (query.includes(exclusion)) {
                return false;
            }
        }
        
        // Check for shopping keywords
        for (const keyword of SHOPPING_KEYWORDS) {
            if (query.includes(keyword)) {
                return true;
            }
        }
        
        // Additional pattern matching for price queries
        const pricePatterns = [
            /\$\d+/,  // $100
            /under \$?\d+/,  // under $100
            /less than \$?\d+/,  // less than 100
            /price of/,  // price of
            /how much/   // how much
        ];
        
        for (const pattern of pricePatterns) {
            if (pattern.test(query)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Create and insert shopping info box
     */
    function createShoppingInfoBox(query) {
        // Check if info box already exists
        if (document.getElementById('shopping-intent-info-box')) {
            return;
        }
        
        // Find the right-hand sidebar
        let rhsContainer = document.getElementById('rhs');
        if (!rhsContainer) {
            // Check for previously created fallback container
            rhsContainer = document.getElementById('shopping-rhs-container');
            if (!rhsContainer) {
                // Create fallback container if none exists
                rhsContainer = document.createElement('div');
                rhsContainer.id = 'shopping-rhs-container';
                const parent = document.getElementById('rcnt') || document.body;
                parent.appendChild(rhsContainer);
            }
        }
        
        // Create info box element
        const infoBox = document.createElement('div');
        infoBox.id = 'shopping-intent-info-box';
        infoBox.className = 'shopping-intent-box';
        
        // Create shopping icon (SVG)
        const icon = `
            <svg class="shopping-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#4285F4"/>
                <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#4285F4"/>
            </svg>
        `;
        
        // Create content
        infoBox.innerHTML = `
            <div class="shopping-header">
                ${icon}
                <h3>Shopping Insights</h3>
            </div>
            <div class="shopping-content">
                <p><strong>Product search detected!</strong></p>
                <p>This appears to be a product-related search. Here you could find:</p>
                <ul>
                    <li>Price comparisons across retailers</li>
                    <li>Customer reviews and ratings</li>
                    <li>Product specifications</li>
                    <li>Buying guides and tips</li>
                    <li>Similar product recommendations</li>
                </ul>
            </div>
            <div class="shopping-footer">
                <small>Enhanced by Shopping Intent Detector</small>
            </div>
        `;
        
        // Insert at the beginning of RHS container
        rhsContainer.insertBefore(infoBox, rhsContainer.firstChild);
        
        // Add click tracking
        infoBox.addEventListener('click', function() {
            console.log('Shopping Intent Detector: Info box clicked for query:', query);
        });
        
        console.log('Shopping Intent Detector: Info box inserted for query:', query);
    }
    
    /**
     * Main execution function
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        const query = getSearchQuery();
        
        if (hasShoppingIntent(query)) {
            // Use MutationObserver to wait for RHS container if not immediately available
            const observer = new MutationObserver(function(mutations) {
                const rhsContainer = document.getElementById('rhs') || document.getElementById('shopping-rhs-container');
                if (rhsContainer) {
                    createShoppingInfoBox(query);
                    observer.disconnect();
                }
            });
            
            // Start observing immediately
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Also try immediately in case RHS is already available
            setTimeout(() => {
                createShoppingInfoBox(query);
            }, 100);
            
            // Fallback timeout to stop observing after 5 seconds
            setTimeout(() => {
                observer.disconnect();
            }, 5000);
        }
    }
    
    // Handle page navigation within Google (e.g., pagination, new searches)
    let currentQuery = getSearchQuery();
    
    const navigationObserver = new MutationObserver(function(mutations) {
        const newQuery = getSearchQuery();
        if (newQuery !== currentQuery) {
            currentQuery = newQuery;
            
            // Remove existing info box
            const existingBox = document.getElementById('shopping-intent-info-box');
            if (existingBox) {
                existingBox.remove();
            }

            const backupContainer = document.getElementById('shopping-rhs-container');
            if (backupContainer) {
                backupContainer.remove();
            }
            
            // Re-initialize with new query
            if (hasShoppingIntent(newQuery)) {
                setTimeout(() => {
                    createShoppingInfoBox(newQuery);
                }, 500);
            }
        }
    });
    
    navigationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Initialize
    init();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        setTimeout(init, 100);
    });
    
})();
