import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this._totalCount = 0;
    this._totalPrice = 0;
    this._modal = new Modal();
    this._cartItemElements = [];
    this._orderForm = this.renderOrderForm();

    this.addEventListeners();
  }

  addProduct(product) {
    if (this._getCartItemById(product.id)) {
      return this.updateProductCount(product.id, 1);
    }

    const newCartItem = {product, count: 1};

    this.cartItems.push(newCartItem);
    this._totalCount += newCartItem.count;
    this._totalPrice += newCartItem.product.price;
    this._addCartItemElement(newCartItem);

    this.onProductUpdate(newCartItem);
  }

  updateProductCount(productId, amount) {
    const cartItem = this._getCartItemById(productId);

    cartItem.count += amount;
    this._totalCount += amount;
    this._totalPrice += cartItem.product.price * amount;

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return !this.cartItems.length;
  }

  getTotalCount() {
    return this._totalCount;
  }

  getTotalPrice() {
    return this._totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus" data-role="btn-minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count" data-role="count-indicator">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus" data-role="btn-plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price" data-role="price-indicator">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price" data-role="total-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this._modal.setTitle("Your order");

    this._updateModal();

    this._modal.open();
  }

  onProductUpdate(cartItem) {
    if (cartItem.count === 0) {
      this._removeFromCart(cartItem);
    } else {
      this._updateCartElement(cartItem);
    }

    if (this.getTotalPrice() === 0) {
      this._modal.close();
    }

    this._updateTotalPriceIndicator();
    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const submitBtn = this._orderForm.querySelector("[type='submit']");
    const formData = new FormData(this._orderForm);

    submitBtn.classList.add("is-loading");

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData,
    })
      .then((response) => this._onRequestSuccess(response, submitBtn))
      .catch(error => {throw error;});
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
    this._orderForm.onsubmit = (event) => this.onSubmit(event);
  }

  _getCartItemById(productId) {
    return this.cartItems.find(({product: {id}}) => id === productId);
  }

  _getCartItemElementById(productId) {
    return this._cartItemElements.find(({dataset: {productId: id}}) => id === productId);
  }

  _addCartItemElement({product, count}) {
    this._cartItemElements.push(this.renderProduct(product, count));
  }

  _updateModal() {
    this._modal.setBody("");
    const wrapper = document.createElement("div");

    this._cartItemElements.forEach(cartItemElement => {
      this._prepareCartItemElement(cartItemElement);
      wrapper.append(cartItemElement);
    });

    wrapper.append(this._orderForm);

    this._modal.setBody(wrapper);
  }

  _prepareCartItemElement = (cartItemElement) => {
    const thisId = cartItemElement.dataset.productId;
    const buttons = cartItemElement.querySelectorAll("[data-role*='btn']");

    buttons.forEach(button => {
      button.addEventListener("click", (event) => {
        switch (event.currentTarget.dataset.role) {
        case "btn-plus":
          this.updateProductCount(thisId, 1);
          break;
        case "btn-minus":
          this.updateProductCount(thisId, -1);
          break;
        }
      });
    });
  }

  _updateTotalPriceIndicator() {
    const totalPriceIndicator = this._orderForm.querySelector("[data-role='total-price']");
    totalPriceIndicator.innerHTML = `€${this._totalPrice.toFixed(2)}`;
  }

  _updateCartElement(cartItem) {
    const cartItemElement = this._getCartItemElementById(cartItem.product.id);

    const countIndicator = cartItemElement.querySelector("[data-role='count-indicator']");
    const priceIndicator = cartItemElement.querySelector("[data-role='price-indicator']");
    const {product, count} = cartItem;

    countIndicator.innerHTML = cartItem.count.toString();
    priceIndicator.innerHTML = `€${(product.price * count).toFixed(2)}`;
  }

  _removeFromCart(cartItem) {
    const cartItemElement = this._getCartItemElementById(cartItem.product.id);

    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    this._cartItemElements.splice(this._cartItemElements.indexOf(cartItemElement), 1);
    cartItemElement.remove();
  }

  _onRequestSuccess(response, submitBtn) {
    submitBtn.classList.remove("is-loading");

    this._modal.setTitle("Success!");
    this._modal.setBody(`
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>
    `);

    this.cartItems = [];
    this._cartItemElements = [];
    this._totalCount = 0;
    this._totalPrice = 0;

    this.cartIcon.update(this);
  }
}

