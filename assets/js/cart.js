(function () {
  const CART_KEY = "st4u_cart";

  function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEls = document.querySelectorAll("#cart-count");

    countEls.forEach((el) => {
      el.textContent = totalQty;
    });
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((product) => product.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        quantity: 1
      });
    }

    saveCart(cart);
    alert(item.name + " added to cart");
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== id);
    saveCart(cart);
    renderCartPage();
  }

  function changeQuantity(id, change) {
    const cart = getCart();
    const item = cart.find((product) => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart(cart);
    renderCartPage();
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCartPage();
  }

  function formatPrice(price) {
    return "R" + Number(price).toFixed(2);
  }

  function renderCartPage() {
    const cartContainer = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");

    if (!cartContainer || !cartSummary) return;

    const cart = getCart();

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="cart-page-card empty-cart-message">
          <h3>Your cart is empty</h3>
          <p>Add some wines from the pricelist to continue.</p>
          <a href="winepricelist.html" class="btn-get-started">Go to Pricelist</a>
        </div>
      `;

      cartSummary.innerHTML = `
        <div class="cart-page-card cart-summary-box">
          <h3>Cart Summary</h3>
          <div class="cart-total-line">
            <span>Items</span>
            <span>0</span>
          </div>
          <div class="cart-total-line">
            <span>Total</span>
            <span>R0.00</span>
          </div>
        </div>
      `;
      return;
    }

    let itemsHtml = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      itemsHtml += `
        <div class="cart-page-card cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)} each</div>
            <div class="cart-qty-controls">
              <button type="button" onclick="CartActions.changeQuantity('${item.id}', -1)">-</button>
              <span><strong>Qty:</strong> ${item.quantity}</span>
              <button type="button" onclick="CartActions.changeQuantity('${item.id}', 1)">+</button>
              <span><strong>Subtotal:</strong> ${formatPrice(itemTotal)}</span>
            </div>
          </div>
          <button type="button" class="cart-remove-btn" onclick="CartActions.removeFromCart('${item.id}')">Remove</button>
        </div>
      `;
    });

    cartContainer.innerHTML = itemsHtml;

    cartSummary.innerHTML = `
      <div class="cart-page-card cart-summary-box">
        <h3>Cart Summary</h3>
        <div class="cart-total-line">
          <span>Total Items</span>
          <span>${totalItems}</span>
        </div>
        <div class="cart-total-line">
          <span>Estimated Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        <div class="mt-4 d-flex flex-column gap-3">
          <a href="contact.html" class="btn-get-started text-center">Proceed to Enquiry</a>
          <button type="button" class="btn-get-started" onclick="CartActions.clearCart()">Clear Cart</button>
        </div>
      </div>
    `;
  }

  function initAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const item = {
          id: this.dataset.id,
          name: this.dataset.name,
          price: this.dataset.price,
          image: this.dataset.image
        };

        addToCart(item);
      });
    });
  }

  window.CartActions = {
    removeFromCart,
    changeQuantity,
    clearCart
  };

  document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    initAddToCartButtons();
    renderCartPage();
  });
})();