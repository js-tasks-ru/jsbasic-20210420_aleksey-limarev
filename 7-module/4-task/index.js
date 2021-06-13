import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._stepsCount = steps;
    this._value = value;
    this._elem = createElement(this._sliderTemplate());
    this._thumb = this._elem.querySelector("[data-role='thumb']");
    this._progressBar = this._elem.querySelector("[data-role='progress-bar']");
    this._indicator = this._elem.querySelector("[data-role='indicator']");
    this._steps = this._elem.querySelectorAll("[data-role='step']");
    this._currentStep = this._steps[this._value];

    this._updateSlider(this._value);

    this._elem.addEventListener("click", this._onSliderClick);
    this._thumb.addEventListener("pointerdown", this._onSliderThumbPointerdown);
  }

  get elem() {
    return this._elem;
  }

  get value() {
    return this._value;
  }

  _sliderTemplate() {
    return `
      <div class="slider">

        <div class="slider__thumb" data-role="thumb">
          <span class="slider__value" data-role="indicator"></span>
        </div>

        <div class="slider__progress" data-role="progress-bar"></div>

        <div class="slider__steps">
          ${this._sliderStepsTemplate()}
        </div>
      </div>
    `;
  }


  _sliderStepsTemplate() {
    return Array(this._stepsCount).fill("").map((step, index) => {

      return `<span data-role="step" data-step-value='${index}'></span>`;

    }).join('');
  }


  _onSliderClick = (event) => {
    if (event.target.dataset.role === "thumb") {return;}

    this._value = this._getStep(event);

    this._generateSliderChangeEvent();

    this._updateSlider(this._value);
  }


  _onSliderThumbPointerdown = () => {
    document.addEventListener("pointermove", this._onDocumentPointerMove);

    this._elem.classList.add("slider_dragging");
    this._currentStep.classList.remove("slider__step-active");

    const startValue = this._value;

    document.addEventListener("pointerup", () => {
      document.removeEventListener("pointermove", this._onDocumentPointerMove);

      this._elem.classList.remove("slider_dragging");
      this._updateSlider(this._value);

      if (startValue !== this._value) {
        this._generateSliderChangeEvent();
      }
    }, {once: true});

  }


  _onDocumentPointerMove = (event) => {
    let leftPosition = ((event.clientX - this._elem.getBoundingClientRect().left) / this._elem.offsetWidth) * 100;

    if (leftPosition < 0) {leftPosition = 0;}
    if (leftPosition > 100) {leftPosition = 100;}

    const value = Math.round((leftPosition / 100) * (this._stepsCount - 1));

    this._value = value;
    this._indicator.textContent = value.toString();
    this._thumb.style.left = `${leftPosition}%`;
    this._progressBar.style.width = `${leftPosition}%`;
  }


  _getStep = (event) => {
    if (event.target.dataset.role === "step") {
      return parseInt(event.target.dataset.stepValue);
    }

    return Math.round((event.offsetX / this._elem.offsetWidth) * (this._stepsCount - 1));
  }


  _updateSlider(value) {
    if (value < 0 || value >= this._stepsCount) {return;}

    this._currentStep.classList.remove("slider__step-active");
    this._currentStep = this._steps[value];
    this._currentStep.classList.add("slider__step-active");

    const position = (100 / (this._stepsCount - 1)) * value;

    this._value = value;
    this._indicator.textContent = value;
    this._thumb.style.left = `${position}%`;
    this._progressBar.style.width = `${position}%`;
  }


  _generateSliderChangeEvent = () => {
    const sliderChange = new CustomEvent('slider-change', {
      detail: this._value,
      bubbles: true
    });

    this._elem.dispatchEvent(sliderChange);
  }
}
