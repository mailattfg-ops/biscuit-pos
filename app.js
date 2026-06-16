document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Header scroll class
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Simulator Screen Switcher Helper
  const appScreens = document.querySelectorAll('.app-screen');
  const appNavItems = document.querySelectorAll('.app-nav-item');

  function forceSwitchScreen(screenId) {
    appScreens.forEach(screen => {
      screen.style.display = 'none';
    });
    const activeScreen = document.getElementById(`screen-${screenId}`);
    if (activeScreen) {
      activeScreen.style.display = 'flex';
    }
    
    // Update bottom nav active highlight for the matching tabs
    appNavItems.forEach(item => {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Interactive controls inside simulator (manual tap backups)
  appNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const screenId = item.getAttribute('data-screen');
      if (screenId) {
        forceSwitchScreen(screenId);
      }
    });
  });

  // Home Screen quick banner click shortcuts
  const bannerMenuManagement = document.getElementById('banner-menu-management');
  if (bannerMenuManagement) {
    bannerMenuManagement.addEventListener('click', () => {
      forceSwitchScreen('menu');
    });
  }

  // Menu Screen back arrow click shortcut
  const menuBackBtn = document.querySelector('#screen-menu .app-back-arrow');
  if (menuBackBtn) {
    menuBackBtn.addEventListener('click', () => {
      forceSwitchScreen('home');
    });
  }

  // Live simulator actions (toggles, billing filters, payments)
  const privacySwitch = document.querySelector('.app-switch');
  if (privacySwitch) {
    privacySwitch.addEventListener('click', () => {
      privacySwitch.classList.toggle('active');
      const label = privacySwitch.previousElementSibling;
      if (privacySwitch.classList.contains('active')) {
        if (label) label.textContent = 'Privacy ON';
      } else {
        if (label) label.textContent = 'Privacy OFF';
      }
    });
  }

  const recordPaymentBtn = document.querySelector('.app-btn-sm.pay');
  const orderStatusBadge = document.querySelector('.order-status-badge');
  const orderPaidStatus = document.querySelector('.order-paid-status');
  if (recordPaymentBtn && orderStatusBadge && orderPaidStatus) {
    recordPaymentBtn.addEventListener('click', () => {
      if (orderStatusBadge.textContent === 'Pending') {
        orderStatusBadge.textContent = 'Paid';
        orderStatusBadge.style.backgroundColor = '#34a853';
        orderPaidStatus.textContent = 'Paid ₹15.00 / ₹15.00';
        orderPaidStatus.style.color = '#34a853';
        recordPaymentBtn.textContent = 'Refund';
        recordPaymentBtn.style.backgroundColor = '#dc3545';
      } else {
        orderStatusBadge.textContent = 'Pending';
        orderStatusBadge.style.backgroundColor = '#dc3545';
        orderPaidStatus.textContent = 'Paid ₹0.00 / ₹15.00';
        orderPaidStatus.style.color = '#ff7a00';
        recordPaymentBtn.textContent = 'Record Payment';
        recordPaymentBtn.style.backgroundColor = '#34a853';
      }
    });
  }

  // ==========================================
  // APPLE-STYLE SCROLL INTERACTION LOGIC
  // ==========================================
  const scrollContainer = document.querySelector('.scroll-story-container');
  const heroText = document.querySelector('.hero-text-content');
  const simulatorWrapper = document.querySelector('.simulator-wrapper');
  const heroStickyGrid = document.querySelector('.hero-sticky-grid');
  
  // Callouts
  const calloutHome = document.getElementById('callout-home');
  const calloutBills = document.getElementById('callout-bills');
  const calloutOrders = document.getElementById('callout-orders');
  const calloutMenu = document.getElementById('callout-menu');
  const calloutSettings = document.getElementById('callout-settings');

  function handleScrollAnimation() {
    if (!scrollContainer || !heroText || !simulatorWrapper || !heroStickyGrid) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const totalHeight = containerRect.height - window.innerHeight;
    
    // Calculate scroll progress (0 to 1) within the story container
    let progress = -containerRect.top / totalHeight;
    progress = Math.max(0, Math.min(1, progress));

    const isDesktop = window.innerWidth > 1024;

    if (isDesktop) {
      // 1. Fade/Scale Hero Text (from 0% to 25% scroll)
      if (progress <= 0.25) {
        const textOpacity = 1 - (progress / 0.25);
        const textScale = 1 - (progress * 0.1);
        heroText.style.opacity = textOpacity;
        heroText.style.transform = `scale(${textScale})`;
        heroText.style.pointerEvents = 'auto';
      } else {
        heroText.style.opacity = '0';
        heroText.style.pointerEvents = 'none';
      }

      // 2. Centering Translation Calculation (Static math based on grid layout width)
      const gridRect = heroStickyGrid.getBoundingClientRect();
      const distanceX = -0.25 * gridRect.width;

      // 3. Animate Phone Wrapper to Center & Scale (Scale ranges from 0.85 starting -> 1.0 centering)
      if (progress <= 0.3) {
        const transProgress = Math.max(0, Math.min(1, (progress - 0.12) / 0.18));
        const currentTranslateX = distanceX * transProgress;
        const currentScale = 0.85 + (transProgress * 0.15);

        simulatorWrapper.style.transform = `translate3d(${currentTranslateX}px, 0, 0) scale(${currentScale})`;
      } else {
        // Keep the phone centered at native scale; it will scroll away naturally as the container unpins
        simulatorWrapper.style.transform = `translate3d(${distanceX}px, 0, 0) scale(1.0)`;
        simulatorWrapper.style.opacity = '1';
      }

      // 4. Cycle 5 screens automatically and toggle floats callouts
      // Screen 1: Home (Scroll 30% - 44%)
      if (progress > 0.3 && progress <= 0.44) {
        forceSwitchScreen('home');
        calloutHome.classList.add('active');
      } else {
        calloutHome.classList.remove('active');
      }

      // Screen 2: Bills & Tables (Scroll 44% - 58%)
      if (progress > 0.44 && progress <= 0.58) {
        forceSwitchScreen('bills');
        calloutBills.classList.add('active');
      } else {
        calloutBills.classList.remove('active');
      }

      // Screen 3: Orders (Scroll 58% - 72%)
      if (progress > 0.58 && progress <= 0.72) {
        forceSwitchScreen('orders');
        calloutOrders.classList.add('active');
      } else {
        calloutOrders.classList.remove('active');
      }

      // Screen 4: Menu Management (Scroll 72% - 84%)
      if (progress > 0.72 && progress <= 0.84) {
        forceSwitchScreen('menu');
        calloutMenu.classList.add('active');
      } else {
        calloutMenu.classList.remove('active');
      }

      // Screen 5: Settings (Scroll 84% - 94%)
      if (progress > 0.84 && progress <= 0.94) {
        forceSwitchScreen('settings');
        calloutSettings.classList.add('active');
      } else {
        calloutSettings.classList.remove('active');
      }

    } else {
      // Mobile Viewport Settings (No translates, scale stays crisp 1.0)
      heroText.style.opacity = '1';
      heroText.style.transform = 'none';
      simulatorWrapper.style.transform = 'scale(0.9)';
      simulatorWrapper.style.opacity = '1';

      // Simple mobile scroll distribution (5 screen stages)
      if (progress <= 0.2) {
        forceSwitchScreen('home');
      } else if (progress > 0.2 && progress <= 0.4) {
        forceSwitchScreen('bills');
      } else if (progress > 0.4 && progress <= 0.6) {
        forceSwitchScreen('orders');
      } else if (progress > 0.6 && progress <= 0.8) {
        forceSwitchScreen('menu');
      } else {
        forceSwitchScreen('settings');
      }
    }
  }

  // Bind Scroll and Resize events
  window.addEventListener('scroll', handleScrollAnimation);
  window.addEventListener('resize', handleScrollAnimation);
  
  // Trigger initial paint state
  handleScrollAnimation();

  // Scroll observer for auxiliary sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .info-content, .info-img-card, .download-cta').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});
