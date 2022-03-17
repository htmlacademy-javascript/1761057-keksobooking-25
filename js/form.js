const adForm = document.querySelector('.ad-form');
const formElements = document.querySelectorAll('fieldset, .map__filter, .ad-form__slider');
const mapFilters = document.querySelector('.map__filters');

const setDisabledState = () => {
  formElements.forEarch((item) => (item.disabled = !item.disabled));
};

function setActiveState() {
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  setDisabledState();
}

const setInactiveState = () => {
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');
  setDisabledState();
};

// Валидация
// Заголовок
const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__item--invalid',
  successClass: 'ad-form__item--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
  return true;
});

// Количество комнат - количество гостей
const roomService = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const guest = adForm.querySelector('#capacity');
const roomNumber = adForm.querySelector('#room_number');

const roomValidate = (value) => {
  if (roomNumber.value.length && roomService[roomNumber.value].includes(value)) {
    return true;
  } else {
    return false;
  }
};

const getServiceErrorMessage = () => {
  switch (roomNumber.value) {
    case '1':
      return 'Для 1 гостя';
    case '2':
      return 'Для 2 гостей или для 1 гостя';
    case '3':
      return 'Для 3 гостей, для 2 гостей или для 1 гостя';
    case '100':
      return 'Не для гостей';
  }
};

pristine.addValidator(guest, roomValidate, getServiceErrorMessage);

roomNumber.addEventListener('change', (evt) => {
  evt.preventDefault();
  pristine.validate();
});

// Заезд - выезд
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');
const time = adForm.querySelector('.ad-form__element--time select');

time.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});

timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});

// Тип жилья - цена
const lodgingService = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

const typeLodging = adForm.querySelector('#type');
const price = adForm.querySelector('#price');

const checkMinPrice = () => {
  if (Number(price.value) <= Number(price.placeholder)) {
    return false;
  } else {
    return true;
  }
};

const getPriceErrorMessage = () => `Минимальная стоимость ${price.placeholder} рублей`;

pristine.addValidator(price, checkMinPrice, getPriceErrorMessage);
price.addEventListener('change', () => {
  pristine.validate();
});

const typeValidate = (value) => {
  price.placeholder = lodgingService[value];
};

pristine.addValidator(typeLodging, typeValidate);

typeLodging.addEventListener('change', () => {
  pristine.validate();
});

export {setActiveState, setInactiveState};
