// ============================================
// RESPONSIVE UTILITIES & ENHANCEMENTS
// ============================================

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1440,
            xxl: 1920
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.init();
    }

    /**
     * Get current breakpoint based on window width
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.sm) return 'xs';
        if (width < this.breakpoints.md) return 'sm';
        if (width < this.breakpoints.lg) return 'md';
        if (width < this.breakpoints.xl) return 'lg';
        if (width < this.breakpoints.xxl) return 'xl';
        return 'xxl';
    }

    /**
     * Check if current breakpoint is mobile
     */
    isMobile() {
        return this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'sm';
    }

    /**
     * Check if current breakpoint is tablet
     */
    isTablet() {
        return this.currentBreakpoint === 'md';
    }

    /**
     * Check if current breakpoint is desktop
     */
    isDesktop() {
        return this.currentBreakpoint === 'lg' || 
               this.currentBreakpoint === 'xl' || 
               this.currentBreakpoint === 'xxl';
    }

    /**
     * Get window dimensions
     */
    getWindowDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint
        };
    }

    /**
     * Initialize responsive listeners
     */
    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleResize());
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
    }

    /**
     * Callback when breakpoint changes
     */
    onBreakpointChange(breakpoint) {
        console.log(`Breakpoint changed to: ${breakpoint}`);
        document.documentElement.setAttribute('data-breakpoint', breakpoint);
        
        // Dispatch custom event
        const event = new CustomEvent('breakpointchange', {
            detail: { breakpoint }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get grid gap based on breakpoint
     */
    getGridGap() {
        const gaps = {
            xs: 20,
            sm: 20,
            md: 24,
            lg: 32,
            xl: 32,
            xxl: 32
        };
        return gaps[this.currentBreakpoint];
    }

    /**
     * Get container max width based on breakpoint
     */
    getContainerWidth() {
        const widths = {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: 960,
            xl: 1200,
            xxl: 1320
        };
        return widths[this.currentBreakpoint];
    }
}

// ============================================
// INITIALIZE
// ============================================

// Create global responsive manager instance
const responsive = new ResponsiveManager();

// Log current state for debugging
console.log('Responsive Manager Initialized:', {
    breakpoint: responsive.currentBreakpoint,
    dimensions: responsive.getWindowDimensions(),
    gridGap: responsive.getGridGap(),
    containerWidth: responsive.getContainerWidth()
});

// Listen for breakpoint changes
window.addEventListener('breakpointchange', (event) => {
    console.log('Breakpoint changed:', event.detail.breakpoint);
});

// ============================================
// EXAMPLE: DYNAMIC CONTENT LOADING
// ============================================

/**
 * Load different content based on breakpoint
 */
function loadResponsiveContent() {
    if (responsive.isMobile()) {
        console.log('Loading mobile-optimized content');
    } else if (responsive.isTablet()) {
        console.log('Loading tablet-optimized content');
    } else if (responsive.isDesktop()) {
        console.log('Loading desktop-optimized content');
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadResponsiveContent);

// Call when breakpoint changes
window.addEventListener('breakpointchange', loadResponsiveContent);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get computed CSS variable value
 */
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
}

/**
 * Set CSS variable value
 */
function setCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
}

/**
 * Check if device supports touch
 */
function isTouch() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

console.log('Touch support:', isTouch());

// ============================================
// NAVBAR MOBILE MENU
// ============================================

/**
 * Mobile hamburger menu toggle
 */
function initNavbarMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navbarMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });

    // Close menu on screen resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
}

/**
 * Language selector
 */
function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            console.log('Language changed to:', button.getAttribute('data-lang'));
        });
    });
}

// ============================================
// PAGE LOAD INDICATOR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Responsive website loaded successfully');
    console.log('Current setup:', {
        breakpoint: responsive.currentBreakpoint,
        isMobile: responsive.isMobile(),
        isTablet: responsive.isTablet(),
        isDesktop: responsive.isDesktop(),
        windowWidth: window.innerWidth,
        gridGap: responsive.getGridGap(),
        containerWidth: responsive.getContainerWidth()
    });

    // Initialize navbar menu
    initNavbarMenu();
    
    // Initialize language selector
    initLanguageSelector();
    
    // Initialize particle swell effect for hero-2
    initParticleSwell();
    
    // Note: GSAP breathing animation is initialized separately via DOMContentLoaded
    
    // Initialize viewport observer for animations
    initViewportObserver();
});

// ============================================
// PARTICLE SWELL EFFECT FOR HERO-2
// ============================================

function initParticleSwell() {
    const hero2 = document.querySelector('.hero-2');
    if (!hero2) return;
    
    const particleSpacing = 25;
    const mouseDist = 350;
    const glideSpeed = 0.15;
    
    // Create particle grid
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;
    
    const cols = Math.ceil(hero2.offsetWidth / particleSpacing) + 1;
    const rows = Math.ceil(hero2.offsetHeight / particleSpacing) + 1;
    
    const particles = [];
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${i * particleSpacing}px;
                top: ${j * particleSpacing}px;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease-out;
                will-change: transform, opacity;
            `;
            particlesContainer.appendChild(particle);
            particles.push({
                element: particle,
                gridX: i,
                gridY: j,
                originX: i * particleSpacing,
                originY: j * particleSpacing,
                x: i * particleSpacing,
                y: j * particleSpacing,
                vx: 0,
                vy: 0
            });
        }
    }
    
    hero2.appendChild(particlesContainer);
    
    let globalMouseX = hero2.offsetWidth / 2;
    let globalMouseY = hero2.offsetHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        globalMouseX = e.clientX;
        globalMouseY = e.clientY;
    });
    
    function animate() {
        const rect = hero2.getBoundingClientRect();
        mouseX = globalMouseX - rect.left;
        mouseY = globalMouseY - rect.top;
        
        particles.forEach(p => {
            const dx = mouseX - p.originX;
            const dy = mouseY - p.originY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            let opacity = 0.4;
            let scale = 1;
            
            if (dist < mouseDist && dist > 0) {
                const proximity = 1 - (dist / mouseDist);
                const strength = proximity * proximity;
                
                // Map proximity to opacity: 0.4 to 1.0
                opacity = 0.4 + (strength * 0.6);
                
                // Circle closest to cursor scales to 6x
                // Surrounding circles scale to 2x+ based on proximity
                scale = 1 + (strength * 5);
            }
            
            p.element.style.opacity = opacity;
            p.element.style.transform = `scale(${scale})`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// SVG BREATHING EFFECT WITH GSAP (INLINE SVGs)
// ============================================

function initGSAPBreathingFor(svgEl) {
    if (!svgEl) return null;
    
    const circles = svgEl.querySelectorAll('circle');
    if (!circles.length) return null;
    
    // Add class for CSS transform setup
    circles.forEach(c => c.classList.add('breath-circle'));
    
    // Create GSAP tweens for each circle
    const tweens = [];
    circles.forEach(c => {
        const duration = gsap.utils.random(2, 5);
        const delay = gsap.utils.random(0, 2);
        const maxScale = gsap.utils.random(1.08, 1.25);
        
        const t = gsap.to(c, {
            scale: maxScale,
            duration: duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: delay,
            paused: true
        });
        
        tweens.push(t);
    });
    
    return {
        play: () => tweens.forEach(tt => tt.play()),
        pause: () => tweens.forEach(tt => tt.pause()),
        kill: () => tweens.forEach(tt => tt.kill())
    };
}

function setupAllSvgBreathing() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping breathing animation');
        return;
    }
    
    // Find all inline hero SVGs
    const targets = document.querySelectorAll('.hero-svg');
    const controllers = new Map();
    
    // Setup IntersectionObserver to pause/play animations when offscreen
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const ctrl = controllers.get(el);
            if (!ctrl) return;
            
            if (entry.isIntersecting) {
                ctrl.play();
            } else {
                ctrl.pause();
            }
        });
    }, { threshold: 0.1 });
    
    // Initialize breathing for each SVG
    targets.forEach(svg => {
        const ctrl = initGSAPBreathingFor(svg);
        if (ctrl) {
            controllers.set(svg, ctrl);
            io.observe(svg);
        }
    });
    
    console.log(`✓ GSAP breathing animation initialized for ${controllers.size} SVG(s)`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupAllSvgBreathing);

// ============================================
// VIEWPORT OBSERVER FOR PERFORMANCE
// ============================================

function initViewportObserver() {
    const heroSections = document.querySelectorAll('.hero-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('paused');
            } else {
                entry.target.classList.add('paused');
            }
        });
    }, observerOptions);
    
    heroSections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('✓ Viewport observer initialized for performance optimization');
}
