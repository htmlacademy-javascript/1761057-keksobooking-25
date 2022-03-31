import './popup.js';
import {setFormSubmit} from './form.js';
import {getData} from './api.js';
import {similarHotels} from './map.js';

getData((data) => {
  data.slice(0, 10).forEach((hotel) => {
    similarHotels(hotel);
  });
});

setFormSubmit();
