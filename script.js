
// BULLETPROOF COMPONENT SELECTION SYSTEM - FINAL FIX
console.log('🚀 Loading BULLETPROOF editing system with persistent component references...');

// Enhanced global state with persistent component tracking
window.EditingSystem = {
    selectedComponent: null,
    selectedComponentData: null, // Store component data separately
    editPanel: null,
    isEditPanelOpen: false,
    editingInitialized: false,
    componentRegistry: new Map(),
    // Add backup reference system
    lastSelectedComponent: null,
    componentSelectionTime: null
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded - initializing BULLETPROOF systems...');
    
    initializeNavigation();
    initializeAnimations();
    initializeEditingSystem();
    
    console.log('✅ All systems initialized successfully');
});

function initializeNavigation() {
    console.log('🧭 Initializing navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    console.log('✅ Navigation initialized');
}

function initializeAnimations() {
    console.log('🎨 Initializing animations...');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.section, .project-card, .education-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = '85%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.transition = 'width 2s ease';
        skillObserver.observe(bar);
    });
    
    console.log('✅ Animations initialized');
}



function setupEnhancedGlobalEventHandlers() {
    console.log('🌐 Setting up enhanced global event handlers...');
    
    // Global click handler with enhanced protection
    document.addEventListener('click', function(e) {
        // Don't close if clicking inside the edit panel
        if (window.EditingSystem.editPanel && window.EditingSystem.editPanel.contains(e.target)) {
            console.log('🛡️ Click inside edit panel - maintaining selection');
            return;
        }
        
        // Don't close if clicking on an editable component
        if (e.target.closest('[data-component]')) {
            console.log('🛡️ Click on editable component - maintaining selection');
            return;
        }
        
        // Only close if we're clicking outside everything and panel is open
        if (window.EditingSystem.isEditPanelOpen) {
            console.log('🔒 Closing edit panel due to outside click');
            closeEditPanelSafely();
        }
    });
    
    // Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.EditingSystem.isEditPanelOpen) {
            console.log('🔒 Closing edit panel due to Escape key');
            closeEditPanelSafely();
        }
    });
    
    console.log('✅ Enhanced global event handlers setup complete');
}


function setupSingleComponentWithPersistence(component) {
    console.log(`🔧 Setting up single component with persistence: ${component.dataset.component}`);
    
    // Generate unique ID
    const componentId = `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    component.setAttribute('data-edit-id', componentId);
    
    // Store comprehensive data in registry
    const componentData = {
        element: component,
        type: component.dataset.component,
        originalHTML: component.outerHTML,
        id: componentId,
        timestamp: Date.now()
    };
    
    window.EditingSystem.componentRegistry.set(componentId, componentData);
    
    // Setup visual indicators
    component.style.cursor = 'pointer';
    component.title = `Click to edit: ${component.dataset.component}`;
    
    // Add event listeners with persistence
    component.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(`🎯 Component clicked: ${this.dataset.component} (ID: ${componentId})`);
        selectComponentForEditingWithPersistence(this, componentId, componentData);
    });
    
    component.addEventListener('mouseenter', function() {
        if (window.EditingSystem.selectedComponent !== this) {
            this.classList.add('hover-editable');
        }
    });
    
    component.addEventListener('mouseleave', function() {
        this.classList.remove('hover-editable');
    });
    
    console.log(`✅ Single component setup with persistence complete: ${component.dataset.component}`);
}

function formatComponentName(componentName) {
    return componentName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function showStatus(message, type) {
    const statusDiv = document.querySelector('.edit-panel-status');
    if (statusDiv) {
        statusDiv.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
    }
    console.log(`📊 Status: ${message} (${type})`);
}

function showNotification(message, type) {
    console.log(`📢 Notification: ${message} (${type})`);
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add close listener
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Form submission handler
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('form')) {
        e.preventDefault();
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        e.target.reset();
    }
});

console.log('🎉 BULLETPROOF EDITING SYSTEM WITH PERSISTENCE LOADED SUCCESSFULLY!');
console.log('💡 Debug commands: debugEditingSystemFull(), testComponentSelectionPersistence()');
console.log('🤖 Backend: GROQ AI for component modifications');
console.log('🔒 Persistence: Multiple reference system with recovery mechanisms');
