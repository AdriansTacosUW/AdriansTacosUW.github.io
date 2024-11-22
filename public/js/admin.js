const API_BASE_URL = 'http://localhost:5000'; // Update for production URL if needed

// Fetch and display all orders
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');

    const orders = await response.json();
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear existing list

    orders.forEach((order) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <p>Items: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
        <p>Status: <strong>${order.isCompleted ? 'Completed' : 'Pending'}</strong></p>
        <button onclick="updateOrderStatus('${order._id}', ${!order.isCompleted})">
          Mark as ${order.isCompleted ? 'Pending' : 'Completed'}
        </button>
      `;
      ordersList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert('Error loading orders');
  }
}

// Update order status
async function updateOrderStatus(orderId, isCompleted) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted }),
    });

    if (!response.ok) throw new Error('Failed to update order status');

    await loadOrders(); // Reload orders after update
  } catch (error) {
    console.error(error);
    alert('Error updating order status');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadOrders);
