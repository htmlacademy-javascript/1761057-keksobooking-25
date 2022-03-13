import {hotelsArr} from './data.js';

const cardHotel = document.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const similarCards = hotelsArr(1);

// Функция сопоставления элемента массива с ключом объекта
const TYPES_TRANSLATE = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало',
  hotel: 'Отель'
};

const getValue = (array, type) => {
  for (const [key, value] of Object.entries(array)) {
    if (key === type) { return value; }
  }
};

//Функция для отображения удобств в номере
const featuresContainer = cardTemplate.querySelector('.popup__features');
const featureList = featuresContainer.querySelectorAll('.popup__feature');

const getRandomFeatures = (array, list) => {
  if (!array) {
    featuresContainer.remove();
  } else {
    list.forEach((featureListItem) => {
      const isNeed = array.some(
        (someComfort) => featureListItem.classList.contains(`popup__feature--${someComfort}`),
      );

      if (!isNeed) {featureListItem.remove();}
    });
  }
};

// Функция для фото
const photosContainer = cardTemplate.querySelector('.popup__photos');
const photoItem = photosContainer.querySelector('.popup__photo');

const fragment = document.createDocumentFragment();

const getRandomPhotos = (array) => {
  if (array.length === 0) {
    photosContainer.style.display='none';
  } else {
    array.forEach((arrayItem) => {
      const photoFragment = photoItem.cloneNode(true);
      photoFragment.src = arrayItem;
      fragment.appendChild(photoFragment);
    });
  }
  return fragment;
};

// Функция, проверяющая наличие описания номера
const descriptionContainer = cardTemplate.querySelector('.popup__description');
const getRandomDescription = (text) => {
  if (text === '') {descriptionContainer.style.display='none';}
  return text;
};

// Функция генерации разметки похожих элементов
const getRandomCard = () => {
  const cardHotelFragment = document.createDocumentFragment();

  similarCards.forEach(({author, offer}) => {
    const cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offer.address;
    cardElement.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
    cardElement.querySelector('.popup__type').textContent = getValue(TYPES_TRANSLATE, offer.type);
    cardElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
    cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
    getRandomFeatures(offer.features, featureList);
    cardElement.querySelector('.popup__description').textContent = getRandomDescription(offer.description);
    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(getRandomPhotos(offer.photos));
    cardElement.querySelector('.popup__avatar').src = `img/avatars/user${  author.avatar  }.png`;

    cardHotelFragment.appendChild(cardElement);
  });

  cardHotel.appendChild(cardHotelFragment);
};

export {getRandomCard};
