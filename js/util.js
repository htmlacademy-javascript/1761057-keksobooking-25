const checkNounEnding = (num) => {
  num = num % 100;
  if (num > 19) {
    num = num % 10;
  }

  return (num === 1) ? 'гостя' : 'гостей';
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {checkNounEnding, debounce};
