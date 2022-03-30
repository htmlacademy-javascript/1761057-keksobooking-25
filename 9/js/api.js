const DATA = 'https://25.javascript.pages.academy/keksobooking/data';
const SERVER = 'https://25.javascript.pages.academy/keksobooking';

const getData = (onSuccess) => {
  fetch(DATA)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    });
};

const sendData = (onSuccess, onError, unBlockButton, body) => {
  fetch(
    SERVER,
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
