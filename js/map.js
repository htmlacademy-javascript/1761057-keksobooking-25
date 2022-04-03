import {similarCards} from './popup.js';
import {getData} from './api.js';
import {debounce} from './util.js';

const mainCoordinates = {lat: 35.6895, lng: 139.69171};
const mainZoom = 12.45;
const address = document.querySelector('#address');

const map = L.map('map-canvas')
  .on('load', () => {
    address.value = `${mainCoordinates['lat']}, ${mainCoordinates['lng']}`;
  })
  .setView(mainCoordinates, mainZoom);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const marker = L.marker(
  mainCoordinates,
  {
    draggable: true,
    icon: mainPinIcon,
  },
).addTo(map);

const setDefaultMarker = () => {
  const newLatLng = new L.LatLng(35.6895, 139.69171);
  marker.setLatLng(newLatLng);
  address.value = `${newLatLng['lat']}, ${newLatLng['lng']}`;
};

marker.on('moveend', (evt) => {
  const points = evt.target.getLatLng();
  address.value = `${points['lat'].toFixed(5)}, ${points['lng'].toFixed(5)}`;
});

const markerGroup = L.layerGroup().addTo(map);

const adPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const similarHotels = (hotels) => {
  hotels.forEach((hotel) => {
    const {
      location: {
        lat,
        lng
      }
    } = hotel;
    const adPin = L.marker({
      lat,
      lng,
    },
    {
      icon: adPinIcon,
    });

    adPin
      .addTo(markerGroup)
      .bindPopup(similarCards(hotel));
  });
};

const MAX_COUNT = 10;
const selectTypes = document.querySelectorAll('.map__filter');
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

  selectTypes.forEach((select) => {
    select.addEventListener('change', (evt) => {
      evt.preventDefault();
      if (isNaN(evt.target.value)) {
        filterMask[select.id.slice(8)] = evt.target.value;
      } else {
        filterMask[select.id.slice(8)] = Number(evt.target.value);
      }
      markerUpdate();
    });
  });

  mapFeatures.addEventListener('change', () => {
    filterMask.features = grabCheckboxValues();
    markerUpdate();
  });
};

getData(onSuccess);

export {similarHotels, setDefaultMarker};
