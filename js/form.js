/*

const formDeclaration = document.querySelector('.ad-form');
const formElements = document.querySelectorAll('fieldset');
const formslider = document.querySelector('.ad-form__slider');
const mapFilters = document.querySelector('.map__filters');
const mapFilter = document.querySelectorAll('.map__filter');
const mapFeatures = document.querySelector('.map__features');

const formDisabled = (elements, slider) => {
  elements.forEach((element) => {
    element.disabled = true;
    slider.disabled = true;
  });
};

function formNotDisabled(elements, slider) {
  elements.forEach((element) => {
    element.disabled = false;
    slider.disabled = false;
  });
}

// Функция добавления класса и атрибута в неактивном состоянии для формы объявления
const addFormClass = (form) => {
  if (!form.classList.contains('ad-form--disabled')) {
    form.classList.add('ad-form--disabled');
    formDisabled(formElements, formslider);
  } else {
    form.classList.remove('ad-form--disabled');
    formNotDisabled(formElements, formslider);
  }
};

addFormClass(formDeclaration);

// Функция добавления класса и атрибута в неактивном состоянии для фильтрации объявления
const addMapFormClass = (form) => {
  if (!form.classList.contains('ad-form--disabled')) {
    form.classList.add('ad-form--disabled');
    formDisabled(mapFilter, mapFeatures);
  } else {
    form.classList.remove('ad-form--disabled');
    formNotDisabled(mapFilter, mapFeatures);
  }
};

addMapFormClass(mapFilters);

*/
