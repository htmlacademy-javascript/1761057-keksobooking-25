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

const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

//Функция для отображения удобств в номере
const getRandomFeatures = (array, list) => {
  list.forEach((featureListItem) => {
    const isNeed = array.some(
      (someComfort) => featureListItem.classList.contains(`popup__feature--${someComfort}`),
    );
    if (!isNeed) {featureListItem.remove();}
  });
};

// Функция для фото
const fragment = document.createDocumentFragment();

const getRandomPhotos = (array, container, element) => {
  if (!array) {
    container.remove();
  } else {
    array.forEach((arrayItem) => {
      const photoFragment = element.cloneNode(true);
      photoFragment.src = arrayItem;
      fragment.appendChild(photoFragment);
    });
  }
  return fragment;
};

// Функция проверки на недостающие данные
const checkDataMissing = (data, element) => {
  if (data && !data.includes('undefined')) {
    if (data.indexOf('.png') >= 0) {
      element.src = data;
    } else {
      element.textContent = data;
    }
  } else {
    element.remove();
  }
};

const similarCards = ({author, offer}) => {

  const cardElement = cardTemplate.cloneNode(true);
  const photosContainer = cardElement.querySelector('.popup__photos');
  const photoItem = cardElement.querySelector('.popup__photo');

  checkDataMissing(offer.title, cardElement.querySelector('.popup__title'));
  checkDataMissing(offer.address, cardElement.querySelector('.popup__text--address'));
  checkDataMissing(`${offer.price} ₽/ночь`, cardElement.querySelector('.popup__text--price'));
  checkDataMissing(getValue(TYPES_TRANSLATE, offer.type), cardElement.querySelector('.popup__type'));
  checkDataMissing(`${offer.rooms} комнаты для ${offer.guests} гостей`, cardElement.querySelector('.popup__text--capacity'));
  checkDataMissing(`Заезд после ${offer.checkin}, выезд до ${offer.checkout}`, cardElement.querySelector('.popup__text--time'));

  if (!offer.features) {
    cardElement.querySelector('.popup__feature').remove();
  } else {
    getRandomFeatures(offer.features, cardElement.querySelectorAll('.popup__feature'));
  }

  checkDataMissing(offer.description, cardElement.querySelector('.popup__description'));
  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(getRandomPhotos(offer.photos, photosContainer, photoItem));
  checkDataMissing(author.avatar, cardElement.querySelector('.popup__avatar'));

  return cardElement;
};

export {similarCards};
