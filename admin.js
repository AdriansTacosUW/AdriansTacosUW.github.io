const API_BASE_URL = 'http://localhost:5000'; // Change this when deploying

// Load all orders and display them
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
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Items:</strong> ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
        <p><strong>Status:</strong> <span class="${order.isCompleted ? 'completed' : 'pending'}">
          ${order.isCompleted ? 'Completed ✅' : 'Pending ⏳'}
        </span></p>
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

// Update order status (Mark as Completed or Pending)
async function updateOrderStatus(orderId, isCompleted) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted }),
    });

    if (!response.ok) throw new Error('Failed to update order status');

    loadOrders(); // Refresh the orders list
  } catch (error) {
    console.error(error);
    alert('Error updating order status');
  }
}

// Clear all orders
async function clearAllOrders() {
  const confirmDelete = confirm("Are you sure you want to delete all orders?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to clear orders');

    alert("All orders cleared successfully!");
    loadOrders(); // Refresh the orders list
  } catch (error) {
    console.error(error);
    alert("Error clearing orders");
  }
}

// Initialize the page by loading orders
document.addEventListener('DOMContentLoaded', loadOrders);
