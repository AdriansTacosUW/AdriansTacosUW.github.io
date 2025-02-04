let order = [];
let totalPrice = 0;

const API_BASE_URL = 'http://localhost:5000'; // Replace with your server's base URL when deployed

// Add item to the order
function addToOrder(item, price) {
  const existingItem = order.find((orderItem) => orderItem.name === item);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    order.push({ name: item, price, quantity: 1 });
  }
  
  totalPrice += price;
  updateOrder();
}

// Update the order UI
function updateOrder() {
  const orderList = document.getElementById('order-list');
  const totalPriceElement = document.getElementById('total-price');

  orderList.innerHTML = '';
  order.forEach((orderItem) => {
    const li = document.createElement('li');
    li.textContent = `${orderItem.quantity}x ${orderItem.name} - $${(orderItem.price * orderItem.quantity).toFixed(2)}`;
    orderList.appendChild(li);
  });

  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Submit the order to the server
async function submitOrder() {
  if (order.length === 0) {
    alert('Your order is empty!');
    return;
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: order,
      total: totalPrice,
    }),
  });

  if (response.ok) {
    alert('Order submitted successfully!');
    order = [];
    totalPrice = 0;
    updateOrder();
  } else {
    alert('Failed to submit order.');
  }
}

// Fetch and display existing reviews
async function loadReviews() {
  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = ''; // Clear old reviews

    reviews.forEach((review) => {
      const li = document.createElement('li');
      li.textContent = review.text;
      reviewList.appendChild(li);
    });
  } else {
    alert('Failed to load reviews.');
  }
}

// Submit a new review to the server
async function submitReview(event) {
  event.preventDefault();

  const reviewInput = document.getElementById('review-input');
  const reviewText = reviewInput.value.trim();

  if (reviewText) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: reviewText }),
    });

    if (response.ok) {
      const newReview = await response.json();
      const reviewList = document.getElementById('review-list');
      const li = document.createElement('li');
      li.textContent = newReview.text;
      reviewList.appendChild(li);
      reviewInput.value = ''; // Clear the input field
    } else {
      alert('Failed to submit review.');
    }
  }
}

// Initialize the app
function initialize() {
  loadReviews();
}

document.addEventListener('DOMContentLoaded', initialize);
