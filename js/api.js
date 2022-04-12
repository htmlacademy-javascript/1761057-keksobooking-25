const URL = {
  'GET': 'https://25.javascript.pages.academy/keksobooking/data',
  'POST': 'https://25.javascript.pages.academy/keksobooking',
};

const makeRequest = (onSuccess, onError, method, body) => {
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
    })
    .catch(() => {
      onError();
    });
};

export {makeRequest};
