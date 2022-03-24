import {hotelsArr} from './data.js';
import {similarCards} from './popup.js';

const data = {lat: 35.6895, lng: 139.69171};
const address = document.querySelector('#address');

const map = L.map('map-canvas')
  .on('load', () => {
    address.value = `${data['lat']}, ${data['lng']}`;
  })
  .setView({
    lat: 35.6895,
    lng: 139.69171,
  }, 12.45);

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
  {
    lat: 35.6895,
    lng: 139.69171,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
).addTo(map);

marker.on('moveend', (evt) => {
  const points = evt.target.getLatLng();
  address.value = `${points['lat'].toFixed(5)}, ${points['lng'].toFixed(5)}`;
});

const adPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

hotelsArr.forEach((hotel) => {
  const {
    coordinates: {
      lat,
      lng
    }
  } = hotel;
  const adPin = L.marker({
    lat,
    lng,
  },
  {
    draggable: true,
    icon: adPinIcon,
  });

  adPin
    .addTo(map)
    .bindPopup(similarCards(hotel));
});


