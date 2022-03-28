import {setDefaultMarker} from './map.js';
import {sendData} from './api.js';

// Количество комнат - количество гостей
const ROOOM_SERVICE = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

// Тип жилья - цена
const MIN_HOUSE_PRICE = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

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

// Количество комнат - количество гостей
const guest = adForm.querySelector('#capacity');
const roomNumber = adForm.querySelector('#room_number');

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
const sliderElement = adForm.querySelector('.ad-form__slider');
const price = adForm.querySelector('#price');
const typeHousing = adForm.querySelector('#type');

const minPriceSlider = () => {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: Number(price.placeholder),
      max: 100000,
    },
    start: Number(price.placeholder)
  });
};

const validateMinPrice = () => {
  price.placeholder = MIN_HOUSE_PRICE[typeHousing.value];
  minPriceSlider();
  pristine.validate();
};

typeHousing.addEventListener('change', validateMinPrice);

const checkMinPrice = () => Number(price.value) >= Number(price.placeholder);
const getPriceErrorMessage = () => `Минимальная цена ${price.placeholder} рублей`;
pristine.addValidator(price, checkMinPrice, getPriceErrorMessage);

// Слайдер с ценой
noUiSlider.create(sliderElement, {
  range: {
    min: MIN_HOUSE_PRICE[typeHousing.value],
    max: 100000,
  },
  start: 5000,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

sliderElement.noUiSlider.on('slide', () => {
  price.value = sliderElement.noUiSlider.get();
});

price.addEventListener('input', () => {
  sliderElement.noUiSlider.set(price.value);
});

// Очистка формы
const resetForm = adForm.querySelector('.ad-form__reset');

const clearingForm = (evt) => {
  evt.preventDefault();
  adForm.reset();
  pristine.reset();
  minPriceSlider();
  price.placeholder = MIN_HOUSE_PRICE[typeHousing.value];
  setDefaultMarker();
};

resetForm.addEventListener('click', clearingForm);

// Обработчик события для сообщения
const messageEventHandler = (message) => {
  const closeSuccessKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      message.classList.add('hidden');
      document.removeEventListener('keydown', closeSuccessKeyDown);
    }
  };

  document.addEventListener('keydown', closeSuccessKeyDown);

  message.addEventListener('click', () => {
    message.classList.add('hidden');
    document.removeEventListener('click', closeSuccessKeyDown);
  });
};

// Сообщение об успешной отправке формы
const adFormSubmit = document.querySelector('.ad-form__submit');
const messageSuccessTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

const getSuccessMessage = (evt) => {
  const messageSuccess = messageSuccessTemplate.cloneNode(true);
  document.body.appendChild(messageSuccess);
  messageEventHandler(messageSuccess);
  clearingForm(evt);
};

// Сообщение о неудачной отправке формы
const messageErrorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

const getErrorMessage = () => {
  const messageError = messageErrorTemplate.cloneNode(true);
  document.body.appendChild(messageError);
  messageEventHandler(messageError);
};

// Блокировка кнопок
const blockSubmitButton = () => {
  adFormSubmit.disabled = true;
};

const unblockSubmitButton = () => {
  adFormSubmit.disabled = false;
};

// Отправка формы
const setFormSubmit = () => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      const formData = new FormData(evt.target);
      blockSubmitButton();
      sendData(
        () => getSuccessMessage(evt),
        () => getErrorMessage(),
        () => unblockSubmitButton(),
        formData);
    }
  });
};

export {setActiveState, setInactiveState, setFormSubmit};
