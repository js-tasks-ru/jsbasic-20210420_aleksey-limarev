/* eslint-disable camelcase */
import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this._slides = slides;
    this._maxSlideIndex = this._slides.length - 1;
    this._carouselImagesPath = "/assets/images/";
    this._slideImagesPath = "/assets/images/carousel/";
    this._elem = createElement(this._carouselRootTemplate());
    this._carouselInner = this._elem.querySelector("[data-role='inner']");
    this._currentSlide = this._elem.querySelector("[data-role='slide']");
    this._currentSlideIndex = parseInt(this._currentSlide.dataset.slideIndex);
    this._arrowPrev = this._elem.querySelector("[data-arrow='prev']");
    this._arrowNext = this._elem.querySelector("[data-arrow='next']");
    this._startPosition = null;

    this._arrowPrev.addEventListener('click', this.slideToPrev);
    this._arrowNext.addEventListener('click', this.slideToNext);

    // prevent drag event for correct mousedown/mouseup sliding
    this._carouselInner.addEventListener('dragstart', event => event.preventDefault());

    this._carouselInner.addEventListener('mousedown', this._setStartPosition);
    this._carouselInner.addEventListener('mouseup', this._callSlideMethod);

    this._carouselInner.addEventListener('touchstart', this._setStartPosition);
    this._carouselInner.addEventListener('touchend', this._callSlideMethod);

    this._elem.querySelectorAll("[data-action='add']").forEach(btn => {
      btn.addEventListener("click", this._onSlideButtonClick);
    });
  }

  get elem() {
    return this._elem;
  }

  get slides() {
    return this._slides;
  }

  _carouselRootTemplate() {
    return `
      <div class="carousel">
        ${ this._carouselArrowsTemplate() }
        ${ this._carouselInnerTemplate(this._slides) }
      </div>
    `;
  }

  _carouselInnerTemplate(slides) {
    return `
      <div class="carousel__inner" data-role="inner">
        ${ slides.map((slide, index) => this._carouselSlideTemplate(slide, index)).join("")}
      </div>
    `;
  }

  _carouselSlideTemplate({name, price, image, id}, index) {
    return `
      <div class="carousel__slide" data-id="${id}" data-role="slide" data-slide-index="${index}">
        <img src="${this._slideImagesPath + image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${price.toFixed(2)}</span>
          <div class="carousel__title">${name}</div>
          <button type="button" class="carousel__button" data-action="add">
            <img src="${this._carouselImagesPath}icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
  }

  _carouselArrowsTemplate() {
    return `
      <div class="carousel__arrow carousel__arrow_left" data-arrow="prev" style="display: none">
        <img src="${this._carouselImagesPath}icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_right" data-arrow="next">
        <img src="${this._carouselImagesPath}icons/angle-icon.svg" alt="icon">
      </div>
    `;
  }

  _slideTo(index) {
    const slideWidth = this._carouselInner.offsetWidth;

    this._currentSlide = this._elem.querySelector(`[data-slide-index="${index}"]`);
    this._currentSlideIndex = index;
    this._carouselInner.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  slideToPrev = () => {
    const prevSlideIndex = this._currentSlideIndex - 1;

    if (prevSlideIndex === 0) {
      this._arrowPrev.style.display = 'none';
    }
    if (this._arrowNext.style.display === 'none') {
      this._arrowNext.style.display = '';
    }

    this._slideTo(prevSlideIndex);
  }

  slideToNext = () => {
    const nextSlideIndex = this._currentSlideIndex + 1;

    if (nextSlideIndex === this._maxSlideIndex) {
      this._arrowNext.style.display = 'none';
    }
    if (this._arrowPrev.style.display === 'none') {
      this._arrowPrev.style.display = '';
    }

    this._slideTo(nextSlideIndex);
  }

  _setStartPosition = (event) => {
    switch (event.type) {
    case 'mousedown':
      this._startPosition = event.clientX;
      break;
    case 'touchstart':
      this._startPosition = event.changedTouches[0].clientX;
      break;
    }
  }

  _callSlideMethod = (event) => {
    const curSlideIndex = this._currentSlideIndex;
    let endPosition = null;

    switch (event.type) {
    case 'mouseup':
      endPosition = event.clientX;
      break;
    case 'touchend':
      endPosition = event.changedTouches[0].clientX;
      break;
    }

    if (endPosition < this._startPosition && curSlideIndex !== this._maxSlideIndex) {this.slideToNext();}
    if (endPosition > this._startPosition && curSlideIndex !== 0) {this.slideToPrev();}

    this._startPosition = null;
  }

  _onSlideButtonClick = () => {
    const slide = this._slides[this._currentSlideIndex];

    const slideEvent = new CustomEvent("product-add", {
      detail: slide.id,
      bubbles: true,
    });

    this._elem.dispatchEvent(slideEvent);
  }
}
