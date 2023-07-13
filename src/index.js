import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import SlimSelect from 'slim-select';
import { Report } from 'notiflix/build/notiflix-report-aio';

const catInfoEl = document.querySelector('.cat-info');
const breedSelectEl = document.querySelector('.breed-select');
const errorMessageEl = document.querySelector('.error');
const loadingMEssageEl = document.querySelector('.loader');
const loaderIconEl = document.querySelector('.loader-icon');

fetchBreeds()
  .then(makeMarkupCatsList)
  .catch(() => {
    showTextError();
    errorNotificationAnFirstLoad();
  })
  .finally(() => {
    hideLoaderIcon();
    endLoading();
    showSelect();
  });

function makeMarkupCatsList(cats) {
  let dataSlim = [];

  for (const { id, name } of cats) {
    dataSlim.push({ text: name, id: id });
  }

  const select = new SlimSelect({
    select: document.querySelector('.breed-select'),
    data: dataSlim,
    settings: {
      showSearch: true,
    },
  });

  select.data = dataSlim;

  select.events = {
    beforeClose: () => {
      if (!event.target.classList.contains('ss-option')) {
        return;
      }
      hideTextError();
      startLoading();
      showLoaderIcon();
      clearCatInfoMarkup();

      fetchCatByBreed(event.target.id)
        .then(makeMarkupSelectedCat)
        .catch(() => {
          showTextError();
          errorNotificationToFindCat();
        })
        .finally(() => {
          endLoading();
          hideLoaderIcon();
        });
    },
    search: search => {
      return new Promise(resolve => {
        fetchBreeds().then(data => {
          const options = data
            .filter(cat => {
              return cat.name.toLowerCase().includes(search);
            })
            .map(cat => {
              return {
                text: `${cat.name}`,
                id: `${cat.id}`,
              };
            });

          resolve(options);
        });
      });
    },
  };
}

function makeMarkupSelectedCat(cat) {
  catInfoEl.innerHTML =
    ('beforeend',
    `<img width="500px" src='${cat.url}'><div><h2>${cat.breeds[0].name}</h2><p class='cat-description'>${cat.breeds[0].description}</p><p>${cat.breeds[0].temperament}</p></div>`);
}

function startLoading() {
  loadingMEssageEl.classList.remove('is-hidden');
}

function endLoading() {
  loadingMEssageEl.classList.add('is-hidden');
}

function showTextError() {
  errorMessageEl.classList.remove('is-hidden');
}

function hideTextError() {
  errorMessageEl.classList.add('is-hidden');
}

function clearCatInfoMarkup() {
  catInfoEl.innerHTML = '';
}

function showSelect() {
  breedSelectEl.classList.remove('is-hidden');
}

function errorNotificationAnFirstLoad() {
  Report.failure(
    'Oops!',
    'An error occurred while uploading cats. Please reload the page or try again later',
    'Okay'
  );
}

function errorNotificationToFindCat() {
  Report.failure(
    'Oops!',
    'Unfortunately, we could not find information about this cat. Please reload the page or try again later ',
    'Okay'
  );
}

function hideLoaderIcon() {
  loaderIconEl.classList.add('is-hidden');
}

function showLoaderIcon() {
  loaderIconEl.classList.remove('is-hidden');
}
