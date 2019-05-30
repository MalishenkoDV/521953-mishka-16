var navHeader = document.querySelector('.header__nav');
var btnBurger = document.querySelector('.header__btn-burger');

navHeader.classList.remove('header__nav--nojs');
navHeader.classList.add('header__nav--closed');
btnBurger.addEventListener('click', function() {
  if (navHeader.classList.contains('header__nav--closed')) {
    navHeader.classList.remove('header__nav--closed');
    navHeader.classList.add('header__nav--opened');
  } else {
    navHeader.classList.add('header__nav--closed');
    navHeader.classList.remove('header__nav--opened');
  }
});
