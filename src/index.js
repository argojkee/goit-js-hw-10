import { fetchBreeds, fetchCatByBreed } from './js/cat-api';

const catInfoEl = document.querySelector('.cat-info');
const breedSelectEl = document.querySelector('.breed-select');
const errorMessageEl = document.querySelector('.error');
const loadingMEssageEl = document.querySelector('.loader');

startLoading();
fetchBreeds()
  .then(makeMarkupCatsList)
  .catch(showError)
  .finally(() => {
    endLoading();
    showSelect();
  });

breedSelectEl.addEventListener('input', onSelectedCat);

function makeMarkupCatsList(cats) {
  let markupString = '';

  for (const { id, name } of cats) {
    markupString += `<option value="${id}">${name}</option>`;
  }

  return breedSelectEl.insertAdjacentHTML('beforeend', markupString);
}

function makeMarkupSelectedCat(cat) {
  catInfoEl.innerHTML =
    ('beforeend',
    `<img width="500px" src='${cat.url}'><div><h2>${cat.breeds[0].name}</h2><p class='cat-description'>${cat.breeds[0].description}</p><p>${cat.breeds[0].temperament}</p></div>`);
}

function onSelectedCat() {
  hideError();
  startLoading();
  clearCatInfoMarkup();

  fetchCatByBreed(event.target.value)
    .then(makeMarkupSelectedCat)
    .catch(showError)
    .finally(endLoading);
}

function startLoading() {
  loadingMEssageEl.classList.remove('is-hidden');
}

function endLoading() {
  loadingMEssageEl.classList.add('is-hidden');
}

function showError() {
  errorMessageEl.classList.remove('is-hidden');
}

function hideError() {
  errorMessageEl.classList.add('is-hidden');
}

function clearCatInfoMarkup() {
  catInfoEl.innerHTML = '';
}

function showSelect() {
  breedSelectEl.classList.remove('is-hidden');
}
