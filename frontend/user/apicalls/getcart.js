window.onload = function() {
    // Assuming user_id is passed through URL or stored in localStorage
     // Replace with your actual method to get the user_id

    const userData = sessionStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.user.id
    // Fetch cart items for the given user_id
    fetch(`http://127.0.0.1:5000/api/cart/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                displayCartItems(data.cart_items);
            } else {
                console.log(data.message);
                alert("No items found in cart.");
            }
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
            alert('An error occurred while fetching cart items.');
        });
};

// Function to get user_id from URL (e.g., ?user_id=123)
function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user_id'); // Adjust the parameter name if necessary
}

// Function to display the cart items on the page

function displayCartItems(cartItems) {
    const cartContainer = document.getElementById('cart-items-container'); // Ensure this ID exists in your HTML
    const tableBody = cartContainer.querySelector('tbody'); // Get the tbody element where rows will be inserted
    tableBody.innerHTML = ''; // Clear previous rows (if any)

    // Loop through each item in the cart
    cartItems.forEach((item, index) => {
        // Create a new row for each cart item
        const row = document.createElement('tr');
        
        // Create table data for each column
        
        // Index Column
        const indexCell = document.createElement('td');
        indexCell.textContent = index + 1; // Index number of the item
        row.appendChild(indexCell);
    
        // Quantity Column
        const quantityCell = document.createElement('td');
        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = item.quantity; // Display the quantity value as text
        quantityCell.appendChild(quantitySpan);
        row.appendChild(quantityCell);
    
        // Type Column
        const typeCell = document.createElement('td');
        typeCell.textContent = item.name; // Product type (name)
        row.appendChild(typeCell);
    
        // Product Price Column
        const productCell = document.createElement('td');
        productCell.textContent = `$${item.price}`; // Product price
        row.appendChild(productCell);
        
        // Subtotal Column
        const subtotalCell = document.createElement('td');
        subtotalCell.textContent = `$${item.subtotal}`; // Subtotal for the product
        row.appendChild(subtotalCell);
    
    
        // Append the row to the table body
        tableBody.appendChild(row);
    });
    
}
