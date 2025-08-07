const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.clear-cart');

let cart = [];

cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <p>${item.title}</p>
          <p>$${item.price.toFixed(2)}</p>
          <a href="#" onclick="removeFromCart('${item.id}')">remove</a>
        </div>
        <div class="quantity">
          <button onclick="changeQty('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  });
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  cart = cart.map(item => {
    if (item.id === id) {
      item.quantity = Math.max(1, item.quantity + delta);
    }
    return item;
  });
  updateCart();
}

clearCartBtn.addEventListener('click', () => {
  cart = [];
  updateCart();
});

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCart();
}

async function loadProducts() {
  const res = await fetch('products.json');
  const data = await res.json();
  const productsContainer = document.querySelector('.products');

  data.items.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button class="add-to-cart">Add to Cart</button>
    `;
    div.querySelector('button').addEventListener('click', () => addToCart(product));
    productsContainer.appendChild(div);
  });
}

loadProducts();
