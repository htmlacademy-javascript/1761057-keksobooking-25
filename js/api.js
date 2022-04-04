const URL = {
  'GET': 'https://25.javascript.pages.academy/keksobooking/data',
  'POST': 'https://25.javascript.pages.academy/keksobooking'
};


/*const getData = (onSuccess) => {
  fetch('https://25.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    });
};*/

const request = (onSuccess, onError, method, unBlockButton, body) => {
  fetch(
    URL[method],
    {
      method: method,
      body: body
    },
  )
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
      unBlockButton();
    })
    .catch(() => {
      onError();
    });
};

export {request};
