import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this._elem = createElement(this._ribbonMenuTemplate(this.categories));
    this._ribbonInner = this._elem.querySelector("[data-role='inner']");
    this._btnLeft = this._elem.querySelector("[data-arrow='left']");
    this._btnRigth = this._elem.querySelector("[data-arrow='right']");
    this._currentActiveCategory = this._elem.querySelector("[data-role='tab']");

    this._currentActiveCategory.classList.add("ribbon__item_active");

    this._btnLeft.addEventListener("click", this._scrollToLeft);
    this._btnRigth.addEventListener("click", this._scrollToRight);

    this._ribbonInner.addEventListener("scroll", this._hideArrow);

    this._elem.querySelectorAll("[data-role='tab']").forEach(tab => {
      tab.addEventListener("click", this._onCategoryLinkClick);
    });
  }

  get elem() {
    return this._elem;
  }

  _ribbonMenuTemplate(categories) {
    return `
      <div class="ribbon">
        <!--Кнопка прокрутки влево-->
        ${this._ribbonMenuArrowTemplate({direction: "left"})}

        <!--Ссылки на категории-->
        <nav class="ribbon__inner" data-role="inner">
          ${categories.map(category => this._ribbonMenuItemTemplate(category)).join("")}
        </nav>

        <!--Кнопка прокрутки вправо-->
        ${this._ribbonMenuArrowTemplate({direction: "right", visibility: true})}
      </div>
    `;
  }

  _ribbonMenuItemTemplate({id, name}) {
    return `
      <a href="#" class="ribbon__item" data-id="${id}" data-role="tab">${name}</a>
    `;
  }

  _ribbonMenuArrowTemplate({direction, visibility = false}) {
    return `
      <button class="ribbon__arrow ribbon__arrow_${direction}${visibility ? " ribbon__arrow_visible" : ""}"
              data-arrow="${direction}">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `;
  }

  _onCategoryLinkClick = (event) => {
    this._currentActiveCategory.classList.remove("ribbon__item_active");
    this._currentActiveCategory = event.currentTarget;
    this._currentActiveCategory.classList.add("ribbon__item_active");

    const ribbonSelect = new CustomEvent("ribbon-select", {
      detail: this._currentActiveCategory.dataset.id,
      bubbles: true,
    });

    this._elem.dispatchEvent(ribbonSelect);
  }

  _scrollToLeft = () => {
    this._ribbonInner.scrollBy(-350, 0);
  }

  _scrollToRight = () => {
    this._ribbonInner.scrollBy(350, 0);
  }

  _hideArrow = () => {
    const scrollRight = this._ribbonInner.scrollWidth - this._ribbonInner.clientWidth - this._ribbonInner.scrollLeft;

    if (this._ribbonInner.scrollLeft === 0) {
      return this._btnLeft.classList.remove("ribbon__arrow_visible");
    }
    if (scrollRight < 1) {
      return this._btnRigth.classList.remove("ribbon__arrow_visible");
    }

    this._btnLeft.classList.add("ribbon__arrow_visible");
    this._btnRigth.classList.add("ribbon__arrow_visible");
  }
}
