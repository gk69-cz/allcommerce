window.onload = function () {
    // Call the API to get all orders
    fetch('http://127.0.0.1:5000/api/orders', {
        method: 'GET', // GET request to fetch data
        headers: {
            'Content-Type': 'application/json', // Content-Type header
            // Add other headers if needed (like Authorization)
        }
    })
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            // Handle the response data and populate the table
            if (data.status === "success") {
                console.log(data)
                populateOrdersTable(data); // Call function to populate orders
            } else {
                console.error("Failed to fetch orders:", data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error("Error fetching orders:", error);
        });
};

function populateOrdersTable(data) {
    const ordersTableBody = document.getElementById('orders-table-body');

    // Clear the table body first to prevent duplicate entries
    ordersTableBody.innerHTML = '';

    if (data.status === "success" && data.orders.length > 0) {
        data.orders.forEach((order, index) => {
            const row = document.createElement('tr');

            // Create table cells
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;

            const checkboxCell = document.createElement('td');
            checkboxCell.innerHTML = `<input type="checkbox" class="row-checkbox">`;

            const orderCell = document.createElement('td');
            orderCell.textContent = `#${order.cart_id}`;

            const productCell = document.createElement('td');
            productCell.textContent = order.product_details.name;

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = order.product_details.description;

            const quantityCell = document.createElement('td');
            quantityCell.textContent = order.quantity;

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${order.product_details.price}`;

            const discountedPriceCell = document.createElement('td');
            discountedPriceCell.textContent = `$${order.product_details.discounted_price}`;

            const stockCell = document.createElement('td');
            stockCell.textContent = order.product_details.stock;

            const imageCell = document.createElement('td');
            imageCell.innerHTML = `<img src="${order.product_details.image_url}" alt="${order.product_details.name}" style="width:50px;height:auto;">`;

            // Append cells to the row
            row.appendChild(indexCell);
            row.appendChild(checkboxCell);
            row.appendChild(orderCell);
            row.appendChild(productCell);
            row.appendChild(descriptionCell);
            row.appendChild(quantityCell);
            row.appendChild(priceCell);
            row.appendChild(discountedPriceCell);
            row.appendChild(stockCell);
            row.appendChild(imageCell);

            // Append the row to the table body
            ordersTableBody.appendChild(row);
        });
    } else {
        // Handle case where there are no orders or status is not success
        const row = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 10;
        noDataCell.textContent = "No orders available or failed to fetch data.";
        noDataCell.style.textAlign = 'center';
        row.appendChild(noDataCell);
        ordersTableBody.appendChild(row);
    }
}


// Example editOrder and deleteOrder functions (You can implement them based on your needs)
function editOrder(orderId) {
    console.log("Editing order with ID:", orderId);
    // Implement your edit logic here
}

function deleteOrder(orderId) {
    // Confirm with the user before deleting
    if (confirm('Are you sure you want to delete this order?')) {
        // Make the DELETE request to the API
        fetch(`http://127.0.0.1:5000/api/order/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                // Check if deletion was successful
                if (data.status === 'success') {
                    alert('Order deleted successfully!');
                    location.reload();
                    // Optionally, remove the row from the table
                    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
                    if (row) {
                        row.remove(); // Remove the row from the table
                    }
                } else {
                    alert('Error deleting order: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the order.');
            });
    }
}
