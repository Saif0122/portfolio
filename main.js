// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.htmlElement = document.documentElement;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'dark' 
                ? 'bi bi-moon-fill' 
                : 'bi bi-sun-fill';
        }
    }
    
    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeElements();
        this.initSkillBars();
        this.handleScrollToTop();
        this.initParallax();
    }
    
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger skill bar animations
                    if (entry.target.closest('#skills')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all reveal elements
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
            observer.observe(el);
        });
    }
    
    initSkillBars() {
        this.skillBarsAnimated = false;
    }
    
    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        setTimeout(() => {
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--progress-width', width + '%');
                bar.style.width = width + '%';
                bar.classList.add('animate');
            });
        }, 300);
        
        this.skillBarsAnimated = true;
    }
    
    initParallax() {
        // Simple parallax effect for hero elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-element');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    handleScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (!scrollToTopBtn) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navbar Scroll Effect
class NavbarEffects {
    constructor() {
        this.init();
    }
    
    init() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                navbar.style.background = 'rgba(13, 17, 23, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'var(--bg-glass)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Enhanced Form Handling with Validation
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(contactForm)) {
                this.handleFormSubmit(contactForm);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearValidation(input));
        });
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (isValid) {
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
    
    showFieldSuccess(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    
    clearValidation(field) {
        field.classList.remove('is-invalid', 'is-valid');
    }
    
    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
            submitBtn.className = 'btn btn-success btn-lg';
            
            // Reset form
            form.reset();
            form.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Show success message
            this.showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
        } catch (error) {
            // Error state
            submitBtn.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Try Again';
            submitBtn.className = 'btn btn-danger btn-lg';
            
            this.showFormMessage('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.className = 'btn btn-primary btn-lg';
            submitBtn.disabled = false;
        }, 3000);
    }
    
    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-success, .form-error');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-${type}`;
        messageDiv.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
        `;
        
        const form = document.querySelector('.contact-form');
        form.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutUp 0.5s ease';
                setTimeout(() => messageDiv.remove(), 500);
            }
        }, 5000);
    }
}

// Enhanced 3D Interactions
class ThreeDInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.addCubeInteraction();
        this.addMouseParallax();
        this.addTiltEffect();
    }
    
    addCubeInteraction() {
        const cubes = document.querySelectorAll('.cube-container');
        
        cubes.forEach(cube => {
            cube.addEventListener('mouseenter', () => {
                cube.style.animationPlayState = 'paused';
            });
            
            cube.addEventListener('mouseleave', () => {
                cube.style.animationPlayState = 'running';
            });
            
            cube.addEventListener('click', () => {
                cube.style.transform = 'rotateY(90deg) rotateX(90deg) scale(1.1)';
                setTimeout(() => {
                    cube.style.transform = '';
                }, 500);
            });
        });
    }
    
    addMouseParallax() {
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxElements.forEach((shape, index) => {
                const speed = (index + 1) * 20;
                const x = (mouseX * speed) - (speed / 2);
                const y = (mouseY * speed) - (speed / 2);
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    addTiltEffect() {
        const tiltCards = document.querySelectorAll('.tilt-card, .profile-image-container');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }
}

// Blog Management System
class BlogManager {
    constructor() {
        this.posts = this.loadPosts();
        this.init();
    }
    
    init() {
        if (window.location.pathname.includes('blog.html')) {
            this.initBlogPage();
        }
    }
    
    initBlogPage() {
        this.renderPosts();
        this.renderCategories();
        this.renderRecentPosts();
        this.setupNewPostForm();
    }
    
    loadPosts() {
        const saved = localStorage.getItem('blogPosts');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default posts
        return [
            {
                id: 1,
                title: 'Getting Started with Web Design',
                content: 'Web design is an exciting field that combines creativity with technical skills. In this post, I share my journey of learning the fundamentals of HTML, CSS, and responsive design principles.',
                category: 'Web Design',
                date: new Date('2025-01-15').toISOString(),
                featured: true
            },
            {
                id: 2,
                title: 'CSS Animations for Beginners',
                content: 'Learn how to create smooth, engaging animations using pure CSS. From simple transitions to complex keyframe animations, discover the power of CSS animations.',
                category: 'CSS',
                date: new Date('2025-01-10').toISOString(),
                featured: false
            },
            {
                id: 3,
                title: 'Building Responsive Layouts',
                content: 'Responsive design is crucial in today\'s multi-device world. Here\'s what I\'ve learned about creating layouts that work beautifully on all screen sizes.',
                category: 'Tutorial',
                date: new Date('2025-01-05').toISOString(),
                featured: false
            }
        ];
    }
    
    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }
    
    addPost(title, content, category) {
        const newPost = {
            id: Date.now(),
            title,
            content,
            category,
            date: new Date().toISOString(),
            featured: false
        };
        
        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();
        this.renderCategories();
        this.renderRecentPosts();
    }
    
    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== id);
        this.savePosts();
        this.renderPosts();
        this.renderCategories();
        this.renderRecentPosts();
    }
    
    editPost(id, title, content, category) {
        const post = this.posts.find(p => p.id === id);
        if (post) {
            post.title = title;
            post.content = content;
            post.category = category;
            this.savePosts();
            this.renderPosts();
            this.renderCategories();
            this.renderRecentPosts();
        }
    }
    
    renderPosts() {
        const container = document.getElementById('blogPosts');
        if (!container) return;
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-journal-x display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">No posts yet</h4>
                    <p class="text-muted">Create your first blog post using the form above!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.posts.map((post, index) => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const isFirst = index === 0;
            const cardClass = isFirst ? 'blog-post featured-post' : 'blog-post';
            
            return `
                <article class="${cardClass} reveal-up delay-${index + 1}" data-post-id="${post.id}">
                    <div class="blog-post-actions">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="blogManager.startEdit(${post.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="blogManager.confirmDelete(${post.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    
                    ${isFirst ? `
                        <div class="post-image">
                            <img src="https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop" 
                                 alt="${post.title}" class="img-fluid rounded-4">
                            <div class="post-category">Featured</div>
                        </div>
                    ` : ''}
                    
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="badge bg-primary me-2">${post.category}</span>
                            <small class="text-muted">${date}</small>
                        </div>
                        <h3 class="post-title mt-3">
                            <a href="#" class="text-decoration-none">${post.title}</a>
                        </h3>
                        <p class="post-excerpt">${post.content}</p>
                    </div>
                </article>
            `;
        }).join('');
        
        // Re-observe new elements for animations
        setTimeout(() => {
            document.querySelectorAll('.reveal-up:not(.revealed)').forEach(el => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                        }
                    });
                });
                observer.observe(el);
            });
        }, 100);
    }
    
    renderCategories() {
        const container = document.getElementById('categoriesList');
        if (!container) return;
        
        const categories = {};
        this.posts.forEach(post => {
            categories[post.category] = (categories[post.category] || 0) + 1;
        });
        
        container.innerHTML = Object.entries(categories).map(([category, count]) => `
            <li>
                <a href="#" class="text-decoration-none">
                    ${category} <span class="badge bg-secondary">${count}</span>
                </a>
            </li>
        `).join('');
    }
    
    renderRecentPosts() {
        const container = document.getElementById('recentPosts');
        if (!container) return;
        
        const recentPosts = this.posts.slice(0, 3);
        
        container.innerHTML = recentPosts.map(post => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            return `
                <div class="recent-post">
                    <h6><a href="#" class="text-decoration-none">${post.title}</a></h6>
                    <small class="text-muted">${date}</small>
                </div>
            `;
        }).join('');
    }
    
    setupNewPostForm() {
        const form = document.getElementById('newPostForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const category = document.getElementById('postCategory').value;
            
            if (title && content && category) {
                this.addPost(title, content, category);
                form.reset();
                
                // Collapse the form
                const collapse = bootstrap.Collapse.getInstance(document.getElementById('addPostForm'));
                if (collapse) {
                    collapse.hide();
                }
                
                // Show success message
                this.showNotification('Post published successfully!', 'success');
            }
        });
    }
    
    startEdit(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;
        
        const title = prompt('Edit title:', post.title);
        if (title === null) return;
        
        const content = prompt('Edit content:', post.content);
        if (content === null) return;
        
        const category = prompt('Edit category:', post.category);
        if (category === null) return;
        
        this.editPost(id, title, content, category);
        this.showNotification('Post updated successfully!', 'success');
    }
    
    confirmDelete(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.deletePost(id);
            this.showNotification('Post deleted successfully!', 'success');
        }
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        notification.style.cssText = `
            top: 100px; 
            right: 20px; 
            z-index: 9999; 
            min-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Preload critical images
        this.preloadImages();
        
        // Optimize animations based on device capability
        this.optimizeAnimations();
        
        // Initialize tooltips
        this.initTooltips();
    }
    
    preloadImages() {
        const criticalImages = [
            'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
            'https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency < 4 || window.innerWidth < 768) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
        
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
    }
    
    initTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize all modules
    new ThemeManager();
    new ScrollAnimations();
    new SmoothScrolling();
    new NavbarEffects();
    new FormHandler();
    new ThreeDInteractions();
    new PerformanceMonitor();
    
    // Initialize blog manager globally
    window.blogManager = new BlogManager();
    
    // Add CSS animations for notification slides
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-20px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 SAIFULISLAM Portfolio loaded successfully!');
});

// Custom Cursor Implementation
function initCustomCursor() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor following
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .social-icon, .skill-card, .project-card, .contact-info, .showcase-item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
        
        element.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        element.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// Additional utility functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Smooth scroll to element
    scrollToElement(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Export utils for global access
window.portfolioUtils = utils;

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


//  Auto Update Year

  document.getElementById("year").textContent = new Date().getFullYear();



// Handle navigation active states with ScrollSpy enhancement
window.addEventListener('scroll', utils.debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}, 100));