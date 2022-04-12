import {returnSimilarCard} from './popup.js';
import {debounce} from './util.js';
import {makeRequest} from './api.js';
import {filterData} from './filter.js';
import {getErrorMessage, setActiveState, setDisabledState} from './form.js';

const MAIN_COORDINATES = {lat: 35.68950, lng: 139.69171};
const MAIN_ZOOM = 12.45;
const DEBOUNCE_VALUE = 500;
const MAX_OFFERS = 10;
const ERROR_MESSAGE_GET = 'Ошибка загрузки объявлений';

const filterMapForm = document.querySelector('.map__filters');
const address = document.querySelector('#address');

const map = L.map('map-canvas');

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const marker = L.marker(
  MAIN_COORDINATES,
  {
    draggable: true,
    icon: mainPinIcon,
  },
).addTo(map);

const markerGroup = L.layerGroup().addTo(map);
const removeMapPin = () => {
  markerGroup.clearLayers();
};

const setDefaultMarker = () => {
  const newLatLng = new L.LatLng(MAIN_COORDINATES.lat, MAIN_COORDINATES.lng);
  marker.setLatLng(newLatLng);
  address.value = `${newLatLng['lat']}, ${newLatLng['lng']}`;
};

marker.on('mousemove', (evt) => {
  const points = evt.target.getLatLng();
  address.value = `${points['lat'].toFixed(5)}, ${points['lng'].toFixed(5)}`;
});

const adPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const getSimilarHotels = (hotels) => {
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
      .bindPopup(returnSimilarCard(hotel));
  });
};

let offers = [];
const onMarkersUpdate = (debounce(() => {
  removeMapPin();
  getSimilarHotels(filterData(offers));
}, DEBOUNCE_VALUE));

const onSuccess = (data) => {
  setActiveState();
  offers = data.slice();
  getSimilarHotels(offers.slice(0, MAX_OFFERS));

  filterMapForm.addEventListener('change', onMarkersUpdate);
};

const onError = () => {
  const adForm = document.querySelector('.ad-form');
  adForm.classList.remove('ad-form--disabled');
  setDisabledState();
  getErrorMessage(ERROR_MESSAGE_GET);
};

map.on('load', () => {
  address.value = `${MAIN_COORDINATES['lat'].toFixed(5)}, ${MAIN_COORDINATES['lng'].toFixed(5)}`;
  makeRequest(onSuccess, onError, 'GET');
})
  .setView(MAIN_COORDINATES, MAIN_ZOOM);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

export {setDefaultMarker, removeMapPin, onMarkersUpdate};
