import {similarHotels, markerGroup} from './map.js';
import {debounce} from './util.js';
import {request} from './api.js';
import {getErrorMessage, unblockSubmitButton} from './form.js';

const MAX_COUNT = 10;
const SELECT_NAME = 8;
const filterForm = document.querySelector('.map__filters');
let offers = [];
const filterMask = {
  type: 'any',
  rooms: 'any',
  price: 'any',
  guests: 'any',
  features: [],
};

const PRICE = {
  'low': {min: 0, max: 10000},
  'middle': {min: 10000, max: 50000},
  'high': {min: 50000, max: 100000}
};

// Ищем все checkbox'ы и создаём пустой массив
const mapFeatures = document.querySelector('#housing-features');
const featuresCheckbox = mapFeatures.querySelectorAll('input[type=\'checkbox\']');
let checkboxValues = [];

// Проверяем каждый выбранный чекбокс и заносим в массив
const grabCheckboxValues = () => {
  checkboxValues = [];
  featuresCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxValues.push(checkbox.value);
    }
  });

  return checkboxValues;
};

// Фильтрация всей формы на карте
const filtersArray = (array, filter) => array.filter((item) => {
  for (const key in filter) {
    if (key === 'price') {
      if (filter[key] !== 'any') {
        if (!(item.offer.price >= PRICE[filter[key]].min && item.offer.price < PRICE[filter[key]].max)) {
          return false;
        }
      }
    } else if (key === 'features') {
      if (filter[key].length !== 0) {
        if (item.offer.features !== undefined) {
          const filterInclude = grabCheckboxValues().every((element) => item.offer.features.includes(element));
          if (!filterInclude) {return false;}
        } else {
          return false;
        }
      }
    } else {
      if (item.offer[key] === undefined || item.offer[key] !== filter[key] && filter[key] !== 'any') {
        return false;
      }
    }
  }
  return true;
});

// Отрисовка маркеров, подходящих под фильтрацию
const markerUpdate = (debounce(() => {
  markerGroup.clearLayers();
  const filteringResult = filtersArray(offers, filterMask);
  similarHotels(filteringResult.slice(0, MAX_COUNT));
}, 500));

// Копия массива, навешивание обработчиков события и подстановка в маску
const onSuccess = (data) => {
  offers = data.slice();
  similarHotels(offers.slice(0, MAX_COUNT));

  filterForm.addEventListener('change', (evt) => {
    evt.preventDefault();
    if (evt.target.tagName.toLowerCase() === 'select') {
      filterMask[evt.target.id.slice(SELECT_NAME)] = (isNaN(evt.target.value)) ? evt.target.value : Number(evt.target.value);
    } else {
      filterMask.features = grabCheckboxValues();
    }

    markerUpdate();
  });
};

request(onSuccess, getErrorMessage, 'GET', unblockSubmitButton);
