const numDecline = (num) => {
  num = num % 100;
  if (num > 19) {
    num = num % 10;
  }

  if (num === 1) {
    return 'гостя';
  } else {
    return 'гостей';
  }
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {numDecline, debounce};
