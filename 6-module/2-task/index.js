import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this._product = product;
    this._images_path = '/assets/images/';
    this._product_images_path = '/assets/images/products/';
    this._elem = new createElement(this._cardTemplate(this._product));

    this._elem.querySelector("[data-action='add']")
              .addEventListener("click", this._onCardButtonClick);
  }

  get product() {
    return this._product;
  }

  get elem() {
    return this._elem;
  }

  _cardTemplate({name, price, category, image, id}) {
    return `
    <div class="card" id="${id}" data-category="${category}">
      <div class="card__top">
        <img src="${this._product_images_path + image}" class="card__image" alt="product">
        <span class="card__price">€${price.toFixed(2)}</span>
      </div>
      <div class="card__body">
        <div class="card__title">${name}</div>
        <button type="button" class="card__button" data-action="add">
          <img src="${this._images_path}icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
    `;
  }

  _onCardButtonClick = () => {
    const cardEvent = new CustomEvent("product-add", {
      detail: this._product.id,
      bubbles: true,
    });

    this._elem.dispatchEvent(cardEvent);
  }
}
