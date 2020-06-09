// models
const breakpointModel = require('../models/breakpoints-model');

// dom elements
let openMenuButton = undefined;
let closeMenuButton = undefined;
let overlay = undefined;
let menu = undefined;

// vars
let isVisible = false;


// public api
export function init() {
  getDOMElements();
  addEventListeners();
}


// method definitions
function addEventListeners() {
  openMenuButton.addEventListener('click', showMenu);
  closeMenuButton.addEventListener('click', hideMenu);
  overlay.addEventListener('click', hideMenu);

  window.addEventListener('resize', onWindowResized);
}

function getDOMElements() {
  closeMenuButton = document.getElementById('closeMobileMenuButton');
  openMenuButton = document.getElementById('openMobileMenuButton');
  menu = document.getElementById('mobileMenu');
  overlay = document.getElementById('overlay');
}

function hideMenu() {
  menu.classList.remove('visible');
  overlay.classList.remove('visible');

  // allow scrolling
  document.body.style.overflowY = 'auto';
  document.body.style.overflowX = 'hidden';

  isVisible = false;
}

function showMenu() {
  menu.classList.add('visible');
  overlay.classList.add('visible');

  // disallow scrolling
  document.body.style.overflowY = 'hidden';
  document.body.style.overflowX = 'hidden';

  isVisible = true;
}

function onWindowResized() {
  if (!breakpointModel.isMobile() && isVisible) {
    hideMenu();
  }
}
