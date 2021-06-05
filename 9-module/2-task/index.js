import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({steps: 5, value: 3});
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
    this.productsGrid = null;

    this._addEventListeners();
  }

  async render() {
    document.querySelector("[data-carousel-holder]").append(this.carousel.elem);
    document.querySelector("[data-ribbon-holder]").append(this.ribbonMenu.elem);
    document.querySelector("[data-slider-holder]").append(this.stepSlider.elem);
    document.querySelector("[data-cart-icon-holder]").append(this.cartIcon.elem);

    const response = await fetch("products.json");
    const products = await response.json();

    this._onProductArrayLoaded(products);
    this._onPageRendered();
  }

  _onProductArrayLoaded(products) {
    const productsGridHolder = document.querySelector("[data-products-grid-holder]");
    productsGridHolder.innerHTML = "";

    this.productsGrid = new ProductsGrid(products);

    productsGridHolder.append(this.productsGrid.elem);
  }

  _onPageRendered() {
    const currentFilters = {
      noNuts: document.querySelector("#nuts-checkbox").checked,
      vegeterianOnly: document.querySelector("#vegeterian-checkbox").checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value,
    };

    this.productsGrid.updateFilter(currentFilters);
  }

  _addEventListeners() {
    document.body.addEventListener("product-add", (event) => {
      const product = this.productsGrid.products.find(product => product.id === event.detail);

      this.cart.addProduct(product);
    });

    document.body.addEventListener("slider-change", (event) => {
      this.productsGrid.updateFilter({maxSpiciness: event.detail});
    });

    document.body.addEventListener("ribbon-select", (event) => {
      this.productsGrid.updateFilter({category: event.detail});
    });

    document.body.addEventListener("change", (event) => {
      switch (event.target.id) {
      case "nuts-checkbox":
        this.productsGrid.updateFilter({noNuts: event.target.checked});
        break;
      case "vegeterian-checkbox":
        this.productsGrid.updateFilter({vegeterianOnly: event.target.checked});
        break;
      }
    });
  }
}
