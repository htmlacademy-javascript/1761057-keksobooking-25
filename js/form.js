import {setDefaultMarker, removeMapPin, onMarkersUpdate} from './map.js';
import {checkNounEnding} from './util.js';
import {makeRequest} from './api.js';

const MAX_PRICE = 100000;
const SLIDER_STEP = 1;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const ROOM_SERVICE = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const MIN_HOUSE_PRICE = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const formElements = document.querySelectorAll('fieldset, .map__filter, .ad-form__slider');

const setDisabledState = () => {
  formElements.forEach((item) => (item.disabled = !item.disabled));
};

const setActiveState = () => {
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  setDisabledState();
};

const setInactiveState = () => {
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');
  setDisabledState();
};

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__item--invalid',
  successClass: 'ad-form__item--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

const guest = adForm.querySelector('#capacity');
const roomNumber = adForm.querySelector('#room_number');

const validateRoomNumber = (value) => roomNumber.value.length && ROOM_SERVICE[roomNumber.value].includes(value);
const getServiceErrorMessage = () => (roomNumber.value === '100') ? 'Не для гостей' : `Для ${ROOM_SERVICE[roomNumber.value]} ${checkNounEnding(roomNumber.value)}` ;

pristine.addValidator(guest, validateRoomNumber, getServiceErrorMessage);
pristine.addValidator(roomNumber, validateRoomNumber);

roomNumber.addEventListener('change', () => {
  pristine.validate();
});

const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');

timeIn.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});

timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});

// Тип жилья - цена
const sliderElement = adForm.querySelector('.ad-form__slider');
const price = adForm.querySelector('#price');
const typeHousing = adForm.querySelector('#type');

const getMinPriceSlider = () => {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: Number(price.placeholder),
      max: MAX_PRICE,
    },
    start: Number(price.placeholder)
  });
};

const onMinPriceValidate = () => {
  price.placeholder = MIN_HOUSE_PRICE[typeHousing.value];
  getMinPriceSlider();
  pristine.validate();
};

typeHousing.addEventListener('change', onMinPriceValidate);

const checkMinPrice = () => Number(price.value) >= Number(price.placeholder);
const getPriceErrorMessage = () => `Минимальная цена ${price.placeholder} рублей`;
pristine.addValidator(price, checkMinPrice, getPriceErrorMessage);

noUiSlider.create(sliderElement, {
  range: {
    min: MIN_HOUSE_PRICE[typeHousing.value],
    max: MAX_PRICE,
  },
  start: Number(price.placeholder),
  step: SLIDER_STEP,
  connect: 'lower',
  format: {
    to: (value) => (Number.isInteger(value)) ? value.toFixed(0) : value.toFixed(0),
    from: (value) => parseFloat(value),
  },
});

sliderElement.noUiSlider.on('slide', () => {
  price.value = sliderElement.noUiSlider.get();
});

price.addEventListener('input', () => {
  sliderElement.noUiSlider.set(price.value);
});

const defaultPreviewSrc = 'img/muffin-grey.svg';
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const avatarChooser = adForm.querySelector('.ad-form__field input[type=file]');

const photoPreview = adForm.querySelector('.ad-form__photo');
const photoChooser = adForm.querySelector('.ad-form__upload input[type=file]');

const checkFile = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

avatarChooser.addEventListener('change', () => {
  const file = avatarChooser.files[0];
  if (checkFile) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

photoChooser.addEventListener('change', () => {
  const file = photoChooser.files[0];
  if (checkFile) {
    const userPhoto = `<img src="${URL.createObjectURL(file)}" width="70" height="70">`;
    photoPreview.innerHTML = userPhoto;
  }
});

const resetAllImages = () => {
  avatarPreview.src = defaultPreviewSrc;
  photoPreview.innerHTML = '';
};

const resetForm = adForm.querySelector('.ad-form__reset');

const onFormClear = (evt) => {
  evt.preventDefault();
  mapFilters.reset();
  adForm.reset();
  pristine.reset();
  resetAllImages();
  getMinPriceSlider();
  price.placeholder = MIN_HOUSE_PRICE[typeHousing.value];
  setDefaultMarker();
  removeMapPin();
  onMarkersUpdate();
};

resetForm.addEventListener('click', onFormClear);

const messageEventHandler = (message) => {
  const onMessageEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      message.classList.add('hidden');
      document.removeEventListener('keydown', onMessageEscKeydown);
    }
  };

  document.addEventListener('keydown', onMessageEscKeydown);

  message.addEventListener('click', () => {
    message.classList.add('hidden');
    document.removeEventListener('keydown', onMessageEscKeydown);
  });
};

const adFormSubmit = document.querySelector('.ad-form__submit');

const blockSubmitButton = () => {
  adFormSubmit.disabled = true;
};

const unblockSubmitButton = () => {
  adFormSubmit.disabled = false;
};

const messageSuccessTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

const getSuccessMessage = (evt) => {
  const messageSuccess = messageSuccessTemplate.cloneNode(true);
  document.body.appendChild(messageSuccess);
  messageEventHandler(messageSuccess);
  onFormClear(evt);
  unblockSubmitButton();
};

const messageErrorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

const getErrorMessage = () => {
  const messageError = messageErrorTemplate.cloneNode(true);
  document.body.appendChild(messageError);
  messageEventHandler(messageError);
  unblockSubmitButton();
};

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    const formData = new FormData(evt.target);
    blockSubmitButton();
    makeRequest(
      () => getSuccessMessage(evt),
      () => getErrorMessage(),
      'POST',
      formData);
  }
});

export {setActiveState, setInactiveState, getErrorMessage};
