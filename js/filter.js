import {similarHotels, markerGroup} from './map.js';
import {debounce} from './util.js';
import {request} from './api.js';
import {getErrorMessage} from './form.js';

const MAX_COUNT = 10;
const SELECT_NAME = 8;
const filterForm = document.querySelector('.map__filters');
const DEFAULT_VALUE = 'any';

const filterMask = {
  type: DEFAULT_VALUE,
  rooms: DEFAULT_VALUE,
  price: DEFAULT_VALUE,
  guests: DEFAULT_VALUE,
  features: [],
};

const PRICE = {
  'low': {min: 0, max: 10000},
  'middle': {min: 10000, max: 50000},
  'high': {min: 50000, max: Infinity}
};

// Ищем все checkbox'ы и создаём пустой массив
const mapFeatures = document.querySelector('#housing-features');
const featuresCheckbox = mapFeatures.querySelectorAll('input[type=checkbox]');
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

const filtersArray = (array, filter) => {
  let i = 0;
  const offer = [];

  while(i < array.length && offer.length < MAX_COUNT) {
    let result = true;
    for (const key in filter) {
      if (key === 'price') {
        if (filter[key] !== DEFAULT_VALUE) {
          if (!(array[i].offer.price >= PRICE[filter[key]].min && array[i].offer.price < PRICE[filter[key]].max)) {
            result = false;
          }
        }
      } else if (key === 'features') {
        if (filter[key].length !== 0 && typeof array[i].offer.features !== undefined) {
          if (typeof array[i].offer.features !== undefined) {
            const filterInclude = grabCheckboxValues().every((element) => array[i].offer.features.includes(element));
            if (!filterInclude) {result = false;}
          } else {
            result = false;
          }
        }
      } else {
        if (typeof array[i].offer[key] === undefined || array[i].offer[key] !== filter[key] && filter[key] !== DEFAULT_VALUE) {
          result = false;
        }
      }
    }
    if (result) {
      offer.push(array[i]);
    }

    i++;
  }
  return offer;
};

// Фильтрация всей формы на карте
/*const filtersArray = (array, filter) => array.filter((item) => {
  console.log(item);
  for (const key in filter) {
    console.log(key);


    /*switch(key) {
      case 'price':
        //console.log('key 1');
        if (filter[key] !== DEFAULT_VALUE) {
          if (!(item.offer.price >= PRICE[filter[key]].min && item.offer.price < PRICE[filter[key]].max)) {
            return false;
          }
        }
        break;

      case 'features':
        //console.log('key 2');
        if (filter[key].length !== 0) {
          if (item.offer.features !== undefined) {
            const filterInclude = grabCheckboxValues().every((element) => item.offer.features.includes(element));
            if (!filterInclude) {return false;}
          } else {
            return false;
          }
        }
        break;

      default:
        //console.log('key 3');
        if (item.offer[key] === undefined || item.offer[key] !== filter[key] && filter[key] !== DEFAULT_VALUE) {
          return false;
        }
        break;
    }

    return true;
  }


    if (key === 'price') {
      if (filter[key] !== DEFAULT_VALUE) {
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
      if (item.offer[key] === undefined || item.offer[key] !== filter[key] && filter[key] !== DEFAULT_VALUE) {
        return false;
      }
    }
  }
  return true;
});*/

// Отрисовка маркеров, подходящих под фильтрацию
let offers = [];
const markerUpdate = (debounce(() => {
  markerGroup.clearLayers();
  const filteringResult = filtersArray(offers, filterMask);
  similarHotels(filteringResult);
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

request(onSuccess, getErrorMessage, 'GET');
