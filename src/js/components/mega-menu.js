const breakpointModel = require('../models/breakpoints-model');


// id mapping
const idsDict = {
  headerArticlesNavItem: 'mmArticles',
  headerEventsNavItem: 'mmEvents',
  headerMediaNavItem: 'mmMedia',
  headerPeopleNavItem: 'mmPeople',
  headerOrgsNavItem: 'mmOrgs',
  headerEducationNavItem: 'mmEducation',
  headerSearchNavItem: 'mmSearch',
  headerAboutNavItem: 'mmPages',
};

// dom elements
let navItems;
let hideButtons;
let menuPanel;

// mouse out timer
const duration = 750;
let timer;

let isVisible = false;


// public api
export function init() {
  getDOMElements();
  addEventListeners();
}


// event handlers
function addEventListeners() {
  document.body.addEventListener(
    'click',
    (event) => {
      if (!isVisible) {
        return;
      }
      if (!menuPanel.contains(event.target)) {
        hideMenu();
      }
    }
  );

  window.addEventListener('resize', onWindowResized);

  // nav items mouse over
  for (let i = 0; i < navItems.length; i++) {
    const navItem = navItems[i];
    navItem.addEventListener(
      'mouseover',
      (event) => {
        const element = event.target
        if (element.classList.contains('sans-menu')) {
          hideMenu();
        } else {
          clearTimer();
          showMenu(element.id);
        }
      }
    )
  }

  // panel mouse over and out
  menuPanel.addEventListener(
    'mouseover',
    () => clearTimer()
  );
  menuPanel.addEventListener(
    'mouseout',
    (event) => {
      // TODO: make more solid?
      const yThreshold = 200;
      if (event.pageY > yThreshold) {
        startTimer();
      }
    }
  );

  // hide menu buttons click
  for (let i = 0; i < hideButtons.length; i++) {
    const button = hideButtons[i];
    button.addEventListener(
      'click',
      () => {
        clearTimer();
        hideMenu();
      }
    );
  }
}

function onWindowResized(event) {
  if (breakpointModel.isMobileOrTablet()) {
    hideMenu();
  }
}


// dom methods
function getDOMElements() {
  menuPanel = document.getElementById('megaMenuPanel');
  navItems = document.querySelectorAll('.header-nav .nav-list li a');
  hideButtons = document.querySelectorAll('.mega-menu .hide-mega-menu-button');
}

function getSectionByNavItem(navItemId) {
  return document.getElementById(idsDict[navItemId]);
}


// show/hide methods
function showMenu(navItemId) {
  hideAllSections();

  menuPanel.classList.add('visible');

  const section = getSectionByNavItem(navItemId);
  if (section) {
    section.classList.add('visible');
  }

  isVisible = true;
}

function hideMenu() {
  menuPanel.classList.remove('visible');
  isVisible = false;
}

function hideAllSections() {
  for (var key in idsDict) {
    const section = getSectionByNavItem(key);
    if (section) {
      section.classList.remove('visible');
    }
  }
}


// timer methods
function startTimer() {
  clearTimer();
  timer = setTimeout(
    () => hideMenu(),
    duration
  );
}

function clearTimer() {
  clearTimeout(timer);
  timer = null;
}
