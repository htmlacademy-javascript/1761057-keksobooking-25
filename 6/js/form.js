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

export {setActiveState, setInactiveState};
