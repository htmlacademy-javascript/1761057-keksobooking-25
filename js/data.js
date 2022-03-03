import {getRandomInt, getRandomFloat, getRandomArrayElement, createRandomUniqueArr} from './util.js';
import {getUniqueImageId} from './unique-id.js';

// Объект author
const author = () => ({
  avatar: getUniqueImageId(),
});

// Объект location
const coordinates = () => ({
  lat: getRandomFloat(35.65000, 35.70000, 5),
  lng: getRandomFloat(139.70000, 139.80000, 5),
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

const offer = () => ({
  title: 'Выгодное Кексопредложение',
  address: `${coordinates().lat}, ${coordinates().lng}`,
  price: getRandomInt(100, 3000),
  type: getRandomArrayElement(TYPES),
  rooms: getRandomInt(1, 5),
  guests: getRandomInt(1, 20),
  checkin: getRandomArrayElement(TIMES),
  checkout: getRandomArrayElement(TIMES),
  features: createRandomUniqueArr(COMFORT),
  description: 'Кексономера со всеми удобствами для котов',
  photos: createRandomUniqueArr(SNAPSHOTS),
});

// Массив из раннее описанных объектов
const hotel = () => ({
  author: author(),
  coordinates: coordinates(),
  offer: offer(),
});

// Массив из 10 сгенерированных JS-объектов
const hotelsArr = () => Array.from({length: 10}, hotel);

export {hotelsArr};
