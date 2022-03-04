import {getRandomInt} from './util.js';

// v - текущий элемент; i - индекс элемента; (v, i) => i - присваивает порядковый номер текущего элемента значению этого элемента;
const userNumber = Array.from({length: 10}, (v, i) => i + 1);

const getUniqueImageId = () => {
  const imageId = userNumber.splice(getRandomInt(userNumber), 1); // Удаляет один элемент по индексу рандомного числа
  return imageId < 10 ? `0${imageId}` : `${imageId}`; // `${}` - интерполяция
};

export {getUniqueImageId};
