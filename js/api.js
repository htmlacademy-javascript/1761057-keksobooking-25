import {similarHotels} from './map.js';
const getData = () => {
  fetch('https://25.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((data) => {
      data.slice(0, 10).forEach((hotel) => {
        similarHotels(hotel);
      });
    });
};

const sendData = (onSuccess, onError, unBlockButton, body) => {
  fetch(
    'https://25.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
        unBlockButton();
      } else {
        onError();
        unBlockButton();
      }
    })
    .catch(() => {
      onError();
    });
};

export {getData, sendData};
