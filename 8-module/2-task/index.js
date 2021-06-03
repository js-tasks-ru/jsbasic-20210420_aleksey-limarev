import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';
import products from "./products.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this._elem = createElement(this._productGridTemplate());
    this._elemInner = this._elem.querySelector("[data-role='grid-inner']");

    this._fillProductGrid(this.products);
  }

  get elem() {
    return this._elem;
  }

  _productGridTemplate() {
    return `
      <div class="products-grid">
        <div class="products-grid__inner" data-role="grid-inner"></div>
      </div>
    `;
  }

  _fillProductGrid(products) {
    products.forEach(product => {
      const productCard = new ProductCard(product).elem;

      this._elemInner.append(productCard);
    });
  }


  updateFilter(filters) {
    this.filters = Object.assign(this.filters, filters);

    let filteredProducts = [...this.products];

    if (this.filters.noNuts !== undefined && this.filters.noNuts === true) {
      filteredProducts = filteredProducts.filter(({nuts}) => !nuts);
    }
    if (this.filters.vegeterianOnly !== undefined && this.filters.vegeterianOnly === true) {
      filteredProducts = filteredProducts.filter(({vegeterian}) => vegeterian);
    }
    if (this.filters.maxSpiciness !== undefined) {
      filteredProducts = filteredProducts.filter(({spiciness}) => spiciness <= this.filters.maxSpiciness);
    }
    if (this.filters.category !== undefined && this.filters.category !== '') {
      filteredProducts = filteredProducts.filter(({category}) => category === this.filters.category);
    }

    this._elemInner.innerHTML = "";
    this._fillProductGrid(filteredProducts);
  }
}
