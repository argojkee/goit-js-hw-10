const AUTH_TOKEN =
  'live_Pxq2gg3grBQ8Rn1EX4dkd0kWRM0yCWMRcRebfAL5lAIm5prarRx9AxVW20ei9Z9f';

const CATS_URL = 'https://api.thecatapi.com/v1';

export function fetchBreeds() {
  return fetch(`${CATS_URL}/breeds?api_key=${AUTH_TOKEN}`).then(response =>
    response.json()
  );
}

export function fetchCatByBreed(breedId) {
  return fetch(
    `${CATS_URL}/images/search?breed_ids=${breedId}&api_key=${AUTH_TOKEN}`
  )
    .then(response => response.json())
    .then(cat => cat[0]);
}



