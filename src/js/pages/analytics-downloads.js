// consts
const Types = {
  ARTICLE: 'article',
  BANNER_AD: 'banner-ad',
  BOOK: 'book',
  EDUCATION: 'education',
  EVENT: 'event',
  MEDIA: 'media',
  ORGANIZATION: 'organization',
  PERSON: 'person',
  PROJECT: 'project',
};

// data
const data = {
  env: {
    local: 'http://localhost:3232',
    prod: '/api',
  },
  api: {
    content: [
      {
        type: Types.ARTICLE,
        method: 'GET',
        url: '/content/get-articles',
      },
      {
        type: Types.BOOK,
        method: 'GET',
        url: '/content/get-books',
      },
      {
        type: Types.EDUCATION,
        method: 'GET',
        url: '/content/get-academia',
      },
      {
        type: Types.EVENT,
        method: 'GET',
        url: '/content/get-events',
      },
      {
        type: Types.MEDIA,
        method: 'GET',
        url: '/content/get-media',
      },
      {
        type: Types.ORGANIZATION,
        method: 'GET',
        url: '/content/get-organizations',
      },
      {
        type: Types.PERSON,
        method: 'GET',
        url: '/content/get-people',
      },
      {
        type: Types.PROJECT,
        method: 'GET',
        url: '/content/get-projects',
      },
    ],
    createdAt: {
      method: 'POST',
      url: '/content/created-at',
    },
    stats: {
      getBanners: {
        method: 'GET',
        url: '/stats/get-banners',
      },
      getForwardLinks: {
        method: 'GET',
        url: '/stats/get-forward-links',
      },
    },
  },
};

// vars
let isLocal;

// dom elements
let academiaDataButton;
let articlesDataButton;
let booksDataButton;
let eventsDataButton;
let mediaDataButton;
let orgsDataButton;
let peopleDataButton;
let projectsDataButton;

let piecesCreatedAtForm;
let piecesCreatedAtButton;

let fetchBannersDataButton;
let fetchLinksDataButton;


// public api
export function init() {
  const template = document.getElementsByClassName('analytics-downloads-template');

  // quick exit if wrong page
  if (!template.length) {
    return;
  }

  // check if localhost
  const templateElement = template[0];
  isLocal = templateElement.dataset.isLocal === 'true';

  // setup
  getDOMElements();
  addEventListeners();
}


// private methods
function getDOMElements() {
  // content pieces data
  academiaDataButton = document.getElementById('academiaDataButton');
  articlesDataButton = document.getElementById('articlesDataButton');
  booksDataButton = document.getElementById('booksDataButton');
  eventsDataButton = document.getElementById('eventsDataButton');
  mediaDataButton = document.getElementById('mediaDataButton');
  orgsDataButton = document.getElementById('orgsDataButton');
  peopleDataButton = document.getElementById('peopleDataButton');
  projectsDataButton = document.getElementById('projectsDataButton');

  // pieces added at month
  piecesCreatedAtForm = document.getElementById('piecesCreatedAtForm');
  piecesCreatedAtButton = document.getElementById('piecesCreatedAtButton');

  // stats
  fetchBannersDataButton = document.getElementById('fetchBannersDataButton');
  fetchLinksDataButton = document.getElementById('fetchLinksDataButton');
}

function addEventListeners() {
  // content pieces data
  academiaDataButton.onclick = event => fetchDataForType(event, Types.EDUCATION);
  articlesDataButton.onclick = event => fetchDataForType(event, Types.ARTICLE);
  booksDataButton.onclick = event => fetchDataForType(event, Types.BOOK);
  eventsDataButton.onclick = event => fetchDataForType(event, Types.EVENT);
  mediaDataButton.onclick = event => fetchDataForType(event, Types.MEDIA);
  orgsDataButton.onclick = event => fetchDataForType(event, Types.ORGANIZATION);
  peopleDataButton.onclick = event => fetchDataForType(event, Types.PERSON);
  projectsDataButton.onclick = event => fetchDataForType(event, Types.PROJECT);

  // pieces added at month
  piecesCreatedAtForm.onsubmit = fetchContentPiecesCreatedAt;

  // stats
  fetchBannersDataButton.onclick = fetchBannersData;
  fetchLinksDataButton.onclick = fetchForwardLinksData;
}

function fetchDataForType(event, type) {
  event.target.dataset.isPending = true;

  const xhr = new XMLHttpRequest();

  xhr.onerror = () => {
    xhrError(xhr);
    event.target.dataset.isPending = false;
  };

  xhr.onload = () => {
    event.target.dataset.isPending = false;
    if (xhr.status !== 200) {
      console.warn('unable to load:', xhr.statusText);
      return;
    }
    promptToSave(xhr.response, `${generateFileName(type)}.tsv`);
  };

  const xhrParams = getXHRParams(type);
  xhr.open(xhrParams.method, xhrParams.url);

  xhr.send();
}

function fetchContentPiecesCreatedAt(event) {
  piecesCreatedAtButton.dataset.isPending = true;

  event.preventDefault();
  event.stopPropagation();

  // form values
  const year = piecesCreatedAtForm.createdAtYear.value;
  const month = piecesCreatedAtForm.createdAtMonth.value;

  const xhr = new XMLHttpRequest();

  xhr.onerror = () => {
    xhrError(xhr);
    piecesCreatedAtButton.dataset.isPending = false;
  };

  xhr.onload = () => {
    piecesCreatedAtButton.dataset.isPending = false;
    if (xhr.status !== 200) {
      console.warn('unable to load:', xhr.statusText);
      return;
    }
    const fileName = generateFileName(`during-${year}-${(month + 1).toString().padStart(2, '0')}`);
    promptToSave(xhr.response, `${fileName}.tsv`);
  };

  // open request
  const method = data.api.createdAt.method;
  const url = `${data.env.local}${data.api.createdAt.url}`;
  xhr.open(method, url);

  // set `Content-Type` header
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

  // send data
  xhr.send(JSON.stringify({ year, month }));
}

function fetchBannersData() {
  fetchBannersDataButton.dataset.isPending = true;

  const xhr = new XMLHttpRequest();

  xhr.onerror = () => {
    xhrError(xhr);
    fetchBannersDataButton.dataset.isPending = false;
  };

  xhr.onload = () => {
    fetchBannersDataButton.dataset.isPending = false;
    if (xhr.status !== 200) {
      console.warn('unable to load:', xhr.statusText);
      return;
    }
    promptToSave(xhr.response, `${generateFileName('banners')}.tsv`);
  };

  const method = data.api.stats.getBanners.method;
  const url = `${data.env.local}${data.api.stats.getBanners.url}`;
  xhr.open(method, url);

  xhr.send();
}

function fetchForwardLinksData() {
  fetchLinksDataButton.dataset.isPending = true;

  const xhr = new XMLHttpRequest();

  xhr.onerror = () => {
    xhrError(xhr);
    fetchLinksDataButton.dataset.isPending = false;
  };

  xhr.onload = () => {
    fetchLinksDataButton.dataset.isPending = false;
    if (xhr.status !== 200) {
      console.warn('unable to load:', xhr.statusText);
      return;
    }
    promptToSave(xhr.response, `${generateFileName('forward-links')}.tsv`);
  };

  const method = data.api.stats.getForwardLinks.method;
  const url = `${data.env.local}${data.api.stats.getForwardLinks.url}`;
  xhr.open(method, url);

  xhr.send();
}


// utils
function generateFileName(type) {
  const now = new Date();
  const filename = `aem-${type}-${now.getFullYear()}`
    + `${(now.getMonth() + 1).toString().padStart(2, '0')}`
    + `${now.getDate().toString().padStart(2, '0')}`
    + '-'
    + `${now.getHours().toString().padStart(2, '0')}`
    + `${now.getMinutes().toString().padStart(2, '0')}`;
  return filename;
}

function getXHRParams(type) {
  const typeData = data.api.content.find(element => element.type === type);
  const baseUrl = (isLocal) ? data.env.local : data.env.prod;

  return {
    url: `${baseUrl}${typeData.url}`,
    method: typeData.method,
  };
}

function promptToSave(response, fileName) {
  const blob = new Blob([response], { type: 'application/text' });

  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}

function xhrError(xhr) {
  console.warn('error loading:', xhr.statusText);
}
