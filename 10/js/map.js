import {returnSimilarCard} from './popup.js';
import {debounce} from './util.js';
import {request} from './api.js';
import {filterData} from './filter.js';
import {getErrorMessage, setActiveState} from './form.js';

const MAIN_COORDINATES = {lat: 35.6895, lng: 139.69171};
const MAIN_ZOOM = 12.45;
const DEBOUNCE_VALUE = 500;
const MAX_OFFERS = 10;
const filterMapForm = document.querySelector('.map__filters');
const address = document.querySelector('#address');

const map = L.map('map-canvas')
  .on('load', () => {
    address.value = `${MAIN_COORDINATES['lat']}, ${MAIN_COORDINATES['lng']}`;
    setActiveState();
  })
  .setView(MAIN_COORDINATES, MAIN_ZOOM);

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

marker.on('moveend', (evt) => {
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

// Отрисовка маркеров, подходящих под фильтрацию
let offers = [];
const updateMarkers = (debounce(() => {
  removeMapPin();
  getSimilarHotels(filterData(offers));
}, DEBOUNCE_VALUE));

const onSuccess = (data) => {
  offers = data.slice();
  getSimilarHotels(offers.slice(0, MAX_OFFERS));

  filterMapForm.addEventListener('change', updateMarkers);
};

const onError = () => {
  getErrorMessage();
};

request(onSuccess, onError, 'GET');

export {setDefaultMarker, removeMapPin, updateMarkers};
