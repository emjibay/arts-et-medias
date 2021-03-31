const breakpointModel = require('../models/breakpoints-model');


// id mapping
const contentIds = [
  // v2
  'mmDiscover',
  'mmVisit',
  'mmRead',
  'mmLearn',
  // constant
  'mmSearch',
  'mmLangSwitch',
];

// dom elements
let headerNav;
let toggles;
let menuPanel;
let hideButtons;
let firstElement;
let lastElement;

// state vars
let isVisible = false;
let currentContentId = null;

// timer
let animTimer;


// public api
export function init() {
  getDOMElements();
  addEventListeners();
}


// event handlers
function addEventListeners() {
  addBodyClickListener();
  addKeyListeners();
  addWindowResizeListener();
  addTogglesListeners();
  addHideButtonsListener();
}

function addBodyClickListener() {
  if (!document || !document.body) {
    console.warn('Unable to handle clicks on <body>');
    return;
  }

  document.body.addEventListener(
    'click',
    (event) => {
      if (!isVisible) {
        return;
      }

      const isElementInHeaderNav = headerNav.contains(event.target);
      const isElementInMenuPanel = menuPanel.contains(event.target);

      if (!isElementInHeaderNav && !isElementInMenuPanel) {
        hideMenu();
      }
    }
  );
}

function addKeyListeners() {
  document.addEventListener(
    'keydown',
    (event) => {
      if (!isVisible) {
        return;
      }
      const { key, shiftKey } = event;

      if (key === 'Escape') {
        hideMenu()
          .then(
            () => setFocusToCaretButton(currentContentId)
          );
      }

      if (key === 'Tab') {
        if (shiftKey) {
          // tabbing backwards
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // tabbing forward
          if (document.activeElement === lastElement) {
            menuPanel.focus();
          }
        }
      }
    }
  );
}

function addWindowResizeListener() {
  if (!window) {
    console.warn('Unable to handle window resize');
    return;
  }
  window.addEventListener(
    'resize',
    () => {
      if (
        (breakpointModel.isMobileOrTablet() && currentContentId !== 'mmLangSwitch')
        || breakpointModel.isMobile()
      ) {
        hideMenu()
          .then(
            () => setFocusToCaretButton(currentContentId)
          );
      }
    }
  );
}


// dom methods
function getDOMElements() {
  headerNav = document.getElementById('headerNav');
  toggles = document.querySelectorAll('.header-nav .nav-list .nav-item .nav-item-btn');

  menuPanel = document.getElementById('megaMenuPanel');
  hideButtons = document.querySelectorAll('.mega-menu .hide-mega-menu-button');
}


// nav items methods
function addTogglesListeners() {
  if (!toggles || !toggles.length) {
    console.warn('Unable to handle nav items mouse events');
    return;
  }

  for (let i = 0; i < toggles.length; i++) {
    const megaMenuToggle = toggles[i];
    megaMenuToggle.addEventListener(
      'click',
      (event) => {
        const button = event.target;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const clickedContentId = button.dataset.contentId;

        collapseAllNavButtons();
        hideAllSections();
        lastElement = null;

        if (!isExpanded) {
          // a11y
          button.setAttribute('aria-expanded', true);

          // content
          currentContentId = clickedContentId;
          showSection(currentContentId);

          // dom
          setFocusableElements();

          // menu panel
          showMenu()
            .then(
              () => menuPanel.focus()
            );
        } else if (isExpanded && button.dataset.contentId === currentContentId) {
          hideMenu();

        } else {
          console.warn('Unable to toggle mega menu visibility');
        }
      }
    );
  }
}

function collapseAllNavButtons(exception) {
  contentIds.forEach(id => {
    if (exception && id === exception) {
      return;
    }
    const buttonId = `${ id }Button`;
    const button = document.getElementById(buttonId);
    if (button) {
      button.setAttribute('aria-expanded', false);
    }
  });
}

function setFocusToCaretButton(contentId) {
  const caretButton = document.getElementById(`${ contentId }Button`);
  if (caretButton) {
    caretButton.focus();
  } else {
    console.warn(`Unable to get caret button with content id "${ contentId }"`);
  }
}


// menu panel methods
function addHideButtonsListener() {
  if (!hideButtons || !hideButtons.length) {
    console.warn('Unable to handle hide buttons\' click');
    return;
  }

  for (let i = 0; i < hideButtons.length; i++) {
    const button = hideButtons[i];
    button.addEventListener(
      'click',
      () => {
        hideMenu()
          .then(
            () => {
              // set focus back to nav item
              const { contentId } = button.dataset;
              setFocusToCaretButton(contentId);
            }
          );
      }
    );
  }
}

function showMenu() {
  menuPanel.classList.add('visible');

  return new Promise(resolve => {
    startAnimTimer(
      750,
      () => {
        isVisible = true;
        resolve();
      }
    );
  });
}

function hideMenu() {
  menuPanel.classList.remove('visible');
  collapseAllNavButtons();

  return new Promise(resolve => {
    startAnimTimer(
      500,
      () => {
        isVisible = false;
        resolve();
      }
    );
  });
}

function setFocusableElements() {
  const currentSection = document.getElementById(currentContentId);
  const focusable = currentSection.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  firstElement = focusable[0];
  lastElement = focusable[focusable.length - 1];
}


// section methods
function hideAllSections() {
  contentIds.forEach(contentId => {
    const section = document.getElementById(contentId);
    if (section) {
      section.classList.remove('visible');
    } else {
      console.warn(`Unable to get section with id ${ contentId }`);
    }
  });
}

function showSection(contentId) {
  const section = document.getElementById(contentId);
  if (section) {
    section.classList.add('visible');
  } else {
    console.warn(`Unable to show section with id "${ contentId }"`);
  }
}


// timer methods
function startAnimTimer(duration, callback) {
  clearAnimTimer();
  animTimer = setTimeout(callback, duration);
}

function clearAnimTimer() {
  clearTimeout(animTimer);
  animTimer = null;
}
