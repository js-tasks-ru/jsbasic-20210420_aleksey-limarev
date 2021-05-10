function initCarousel() {
  const carousel = document.querySelector('.carousel');

  if (!carousel) {return;}

  const carouselInner = carousel.querySelector('.carousel__inner');
  const slides = [...document.querySelectorAll('.carousel__slide')];
  const maxSlideIndex = slides.length - 1;
  const carouselArrowPrev = carousel.querySelector('.carousel__arrow_left');
  const carouselArrowNext = carousel.querySelector('.carousel__arrow_right');

  slides.forEach((slide, index) => slide.dataset.slideIndex = String(index));
  carouselArrowPrev.style.display = 'none';

  let currentSlide = slides[0];
  let startPosition = null;

  carouselArrowNext.addEventListener('click', slideToNext);
  carouselArrowPrev.addEventListener('click', slideToPrev);

  // prevent drag event for correct mousedown/mouseup sliding
  carouselInner.addEventListener('dragstart', event => event.preventDefault());

  carouselInner.addEventListener('mousedown', setStartPosition);
  carouselInner.addEventListener('mouseup', callCorrectSliding);

  carouselInner.addEventListener('touchstart', setStartPosition);
  carouselInner.addEventListener('touchend', callCorrectSliding);

  function slideTo(index) {
    const slideWidth = carouselInner.offsetWidth;

    currentSlide = slides[index];
    carouselInner.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  function slideToPrev() {
    const prevSlideIndex = parseInt(currentSlide.dataset.slideIndex) - 1;

    if (prevSlideIndex === 0) {
      carouselArrowPrev.style.display = 'none';
    }
    if (carouselArrowNext.style.display === 'none') {
      carouselArrowNext.style.display = '';
    }

    slideTo(prevSlideIndex);
  }

  function slideToNext() {
    const nextSlideIndex = parseInt(currentSlide.dataset.slideIndex) + 1;

    if (nextSlideIndex === maxSlideIndex) {
      carouselArrowNext.style.display = 'none';
    }
    if (carouselArrowPrev.style.display === 'none') {
      carouselArrowPrev.style.display = '';
    }

    slideTo(nextSlideIndex);
  }

  function setStartPosition(event) {
    switch (event.type) {
    case 'mousedown':
      startPosition = event.clientX;
      break;
    case 'touchstart':
      startPosition = event.changedTouches[0].clientX;
      break;
    }
  }

  function callCorrectSliding(event) {
    const curSlideIndex = parseInt(currentSlide.dataset.slideIndex);
    let endPosition = null;

    switch (event.type) {
    case 'mouseup':
      endPosition = event.clientX;
      break;
    case 'touchend':
      endPosition = event.changedTouches[0].clientX;
      break;
    }

    if (endPosition < startPosition && curSlideIndex !== maxSlideIndex) {slideToNext();}
    if (endPosition > startPosition && curSlideIndex !== 0) {slideToPrev();}

    startPosition = null;
  }
}
