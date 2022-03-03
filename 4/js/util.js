// Функция, возвращающая случайное целое число из переданного диапазона включительно
const getRandomInt = (min, max) => {
  if (min < 0 || max < 0) {return -1;}
  if (min > max) {[min, max] = [max, min];}
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно
const getRandomFloat = (min, max, floor) => {
  if (min < 0 || max < 0) {return -1;}
  if (min > max) {[min, max] = [max, min];}
  return (Math.random() * (max - min) + min).toFixed(floor);
};

// Функция, возвращающая один случайный элемент из переданного массива
const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

// Функция, возвращающая массив случайной длины из переданного массива без повторений элементов
const createRandomUniqueArr = (array) => {
  const arr = Array.from(array);
  const arrayNew = new Array(getRandomInt(1, arr.length));
  for (let i = 0; i < arrayNew.length; i++) {
    arrayNew[i]=arr.splice(getRandomInt(0, arr.length - 1), 1).join();
  }
  return arrayNew;
};

export {getRandomInt, getRandomFloat, getRandomArrayElement, createRandomUniqueArr};
