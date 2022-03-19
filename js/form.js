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
const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__item--invalid',
  successClass: 'ad-form__item--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

// Количество комнат - количество гостей
const ROOOM_SERVICE = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const guest = adForm.querySelector('#capacity');
const roomNumber = adForm.querySelector('#room_number');

// Проверка на склонение существительных
const numDecline = (num) => {
  num = num % 100;
  if (num > 19) {
    num = num % 10;
  }

  if (num === 1) {
    return 'гостя';
  } else {
    return 'гостей';
  }
};

const validateRoomNumber = (value) => roomNumber.value.length && ROOOM_SERVICE[roomNumber.value].includes(value);
const getServiceErrorMessage = () => (roomNumber.value === '100') ? 'Не для гостей' : `Для ${ROOOM_SERVICE[roomNumber.value]} ${numDecline(roomNumber.value)}` ;

pristine.addValidator(guest, validateRoomNumber, getServiceErrorMessage);
pristine.addValidator(roomNumber, validateRoomNumber);

roomNumber.addEventListener('change', () => {
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
const MIN_HOUSE_PRICE = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

const price = adForm.querySelector('#price');
const typeHousing = adForm.querySelector('#type');

const validateMinPrice = () => {
  price.placeholder = MIN_HOUSE_PRICE[typeHousing.value];
  pristine.validate();
};

typeHousing.addEventListener('change', validateMinPrice);

const checkMinPrice = () => Number(price.value) >= Number(price.placeholder);
const getPriceErrorMessage = () => `Минимальная цена ${price.placeholder} рублей`;
pristine.addValidator(price, checkMinPrice, getPriceErrorMessage);

// Отправка формы
adForm.addEventListener('submit', (evt) => {
  if (!pristine.validate()){
    evt.preventDefault();
  } else {
    return true;
  }
});

export {setActiveState, setInactiveState};
