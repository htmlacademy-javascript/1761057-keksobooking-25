import {similarCards} from './popup.js';

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

export {similarHotels, setDefaultMarker, markerGroup};
