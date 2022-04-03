const URL = {
  'GET': 'https://25.javascript.pages.academy/keksobooking/data',
  'POST': 'https://25.javascript.pages.academy/keksobooking'
};


const getData = (onSuccess) => {
  fetch('https://25.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    });
};

const sendData = (onSuccess, onError, unBlockButton, body) => {
  fetch(
    URL['POST'],
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
