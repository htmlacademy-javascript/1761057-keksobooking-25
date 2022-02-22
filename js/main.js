// Функция № 1 (https://stackoverflow.com/questions/62981108/how-does-math-floormath-random-max-min-1-min-work-in-javascript)

const returnRandomInteger = (min, max) => {
  if (min < max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else {
    return Math.floor(Math.random() * (min - max + 1) + max);
  }
};


returnRandomInteger(20, 30);


// Функция № 2 (https://www.codegrepper.com/code-examples/javascript/Math.random%28%29+toFixed%282%29)

const returnRandomFloat = (min, max, floor) => {
  if (min < max) {
    return (Math.random() * (max - min) + min).toFixed(floor);
  } else {
    return (Math.random() * (min - max) + max).toFixed(floor);
  }
};

returnRandomFloat(30, 20, 2);

