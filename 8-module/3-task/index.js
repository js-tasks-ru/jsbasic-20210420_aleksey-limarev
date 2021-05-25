export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this._totalCount = 0;
    this._totalPrice = 0;
  }

  addProduct(product) {
    if (this._getCartItemById(product.id)) {
      return this.updateProductCount(product.id, 1);
    }

    const newCartItem = {product, count: 1};

    this.cartItems.push(newCartItem);
    this._totalCount += newCartItem.count;
    this._totalPrice += newCartItem.product.price;

    this.onProductUpdate(newCartItem);
  }

  updateProductCount(productId, amount) {
    const cartItem = this._getCartItemById(productId);

    cartItem.count += amount;
    this._totalCount += amount;
    this._totalPrice += cartItem.product.price * amount;

    if (cartItem.count === 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    }

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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }

  _getCartItemById(productId) {
    return this.cartItems.find(({product: {id}}) => id === productId);
  }
}

