const MAX_OFFERS = 10;
const DEFAULT_VALUE = 'any';

const priceMap = {
  'low': {min: 0, max: 10000},
  'middle': {min: 10000, max: 50000},
  'high': {min: 50000, max: Infinity}
};

const filtersMap = Array.from(document.querySelector('.map__filters').children);

const filterRules = {
  'housing-type': (data, filter) => filter.value === data.offer.type,
  'housing-price': (data, filter) => data.offer.price >= priceMap[filter.value].min && data.offer.price < priceMap[filter.value].max,
  'housing-rooms': (data, filter) => filter.value === data.offer.rooms.toString(),
  'housing-guests': (data, filter) => filter.value === data.offer.guests.toString(),
  'housing-features': (data, filter) => {
    const checkList = Array.from(filter.querySelectorAll('input[type="checkbox"]:checked'));
    if (checkList.length === 0) {
      return true;
    }

    if (data.offer.features && data.offer.features.length > 0) {
      return checkList.every((checkbox) =>
        data.offer.features.some((feature) => feature === checkbox.value));
    }
  }
};

const filterData = (data) => {
  const filterOffers = [];
  let i = 0;
  let result;

  while (i < data.length && filterOffers.length < MAX_OFFERS) {
    result = filtersMap.every((filter) => (filter.value === DEFAULT_VALUE) ? true : filterRules[filter.id](data[i], filter));

    if (result) {
      filterOffers.push(data[i]);
    }

    i++;
  }

  return filterOffers;
};

export {filterData};
