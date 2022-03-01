// Функция, возвращающая случайное целое число из переданного диапазона включительно
const getRandomInt = (min, max) => {
  if (min < 0 || max < 0) {return -1;}
  if (min > max) {[min, max] = [max, min];}
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getRandomInt(20, 30);

// Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно
const getRandomFloat = (min, max, floor) => {
  if (min < 0 || max < 0) {return -1;}
  if (min > max) {[min, max] = [max, min];}
  return (Math.random() * (max - min) + min).toFixed(floor);
};

getRandomFloat(30, 20, 2);

// v - текущий элемент; i - индекс элемента; (v, i) => i - присваивает порядковый номер текущего элемента значению этого элемента;
const userNumber = Array.from({length: 10}, (v, i) => i + 1);

const getUniqueImageId = () => {
  const imageId = userNumber.splice(getRandomInt(userNumber), 1); // Удаляет один элемент по индексу рандомного числа
  return imageId < 10 ? `0${imageId}` : `${imageId}`; // `${}` - интерполяция
};

// Объект author
const author = () => ({
  avatar: getUniqueImageId (),
});

// Объект location
const coordinates = () => ({
  lat: getRandomFloat (35.65000, 35.70000, 5),
  lng: getRandomFloat (139.70000, 139.80000, 5),
});

// Объект offer
const TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const TIMES = ['12:00', '13:00', '14:00'];
const COMFORT = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const SNAPSHOTS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];

const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

const createRandomUniqArray = (array) => {
  const arr = Array.from(array);
  const arrayNew = new Array(getRandomInt(1, arr.length));
  for (let i = 0; i < arrayNew.length; i++ ){
    arrayNew[i]=arr.splice(getRandomInt(0, arr.length - 1), 1).join();
  }
  return arrayNew;
};

const offer = () => ({
  title: 'Выгодное Кексопредложение',
  address: coordinates (),
  price: getRandomInt(100, 3000),
  type: getRandomArrayElement(TYPES),
  rooms: getRandomInt(1, 5),
  guests: getRandomInt(1, 20),
  checkin: getRandomArrayElement(TIMES),
  checkout: getRandomArrayElement(TIMES),
  features: createRandomUniqArray(COMFORT),
  description: 'Кексономера со всеми удобствами для котов',
  photos: createRandomUniqArray(SNAPSHOTS),
});

// Массив из раннее описанных объектов
const hotel = () => ({
  author: author (),
  coordinates: coordinates (),
  offer: offer (),
});

// Массив из 10 сгенерированных JS-объектов
const hotelsArr = () => Array.from({length: 10}, hotel);

hotelsArr();
