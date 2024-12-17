
window.onload = function() {
    // Call the API to get all categories
    fetch('http://127.0.0.1:5000/api/products', {
        method: 'GET', // GET request to fetch data
        headers: {
            'Content-Type': 'application/json', // Content-Type header
            // Add other headers if needed (like Authorization)
        }
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        // Handle the response data and populate the table
        if (data.status === "success") {
            populateProductTable(data.products);
        } else {
            console.error("Failed to fetch products:", data.message);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error fetching categories:", error);
    });
};


function populateProductTable(products) {
    const tableBody = document.querySelector('table tbody'); // Get the table body element

    // Clear any existing rows in the table
    tableBody.innerHTML = '';

    // Loop through the products and add them to the table
    products.forEach((product, index) => {
        const row = document.createElement('tr');  // Create a new table row

        // Create table cells for each product property
        const checkboxCell = document.createElement('td');
        checkboxCell.innerHTML = `<input type="checkbox" class="select-product">`; // Checkbox for each product

        const productIdCell = document.createElement('td');
        productIdCell.textContent = product.product_id;

        const productNameCell = document.createElement('td');
        productNameCell.textContent = product.name;

        const productDescriptionCell = document.createElement('td');
        productDescriptionCell.textContent = product.description;

        const productPriceCell = document.createElement('td');
        productPriceCell.textContent = `$${product.price}`;

        const productDiscountedPriceCell = document.createElement('td');
        productDiscountedPriceCell.textContent = product.discounted_price ? `$${product.discounted_price}` : 'N/A';

        const productStockCell = document.createElement('td');
        productStockCell.textContent = product.stock;

        const productCategoryCell = document.createElement('td');
        productCategoryCell.textContent = product.category_name;

        const productImageCell = document.createElement('td');
        productImageCell.innerHTML = `<img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: auto;">`;

        const productRatingCell = document.createElement('td');
        productRatingCell.textContent = product.rating || 'N/A';

        const productReviewsCountCell = document.createElement('td');
        productReviewsCountCell.textContent = product.reviews_count || 0;
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
        <a href="editproduct.html?id=${product.product_id}">

            <button onclick="editProduct(${product.product_id})" style="border: none; background: none; cursor: pointer;">
                <i class="fas fa-edit" title="Edit" style="color: #007bff; font-size: 1.2em;"></i>
            </button></a>
            <button onclick="deleteProduct(${product.product_id})" style="border: none; background: none; cursor: pointer;">
                <i class="fas fa-trash-alt" title="Delete" style="color: #dc3545; font-size: 1.2em;"></i>
            </button>
        `;
        // Append all cells to the row
        row.appendChild(productIdCell);
        row.appendChild(checkboxCell);
        row.appendChild(productNameCell);
        row.appendChild(productDescriptionCell);
        row.appendChild(productPriceCell);
        row.appendChild(productDiscountedPriceCell);
        row.appendChild(productStockCell);
      
        row.appendChild(productImageCell);
        row.appendChild(actionsCell);  

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

function editProduct(id) {
    const link = document.getElementById('editLink');
    link.href = `editproduct?id=${id}`;
}

// Select/Deselect All products
function selectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.select-product');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}


function deleteProduct(productId) {
    // Confirm with the user before deleting
    if (confirm('Are you sure you want to delete this Product?')) {
        // Make the DELETE request to the API
        fetch(`http://127.0.0.1:5000/api/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            // Check if deletion was successful
            if (data.status === 'success') {
                alert('Product deleted successfully!');
                
                // Optionally, remove the row from the table
               
                location.reload();
            } else {
                alert('Error deleting Product: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the Product.');
        });
    }
}



// Function to filter products by Category
function filterByCategory() {
    console.log("Filtering by Category");
    // Implement your filtering logic here
    // For example, making an API call or sorting products by category
    // You can update the UI based on the filtered results
}

// Function to filter products by Price
function filterByPrice() {
    console.log("Filtering by Price");
    fetch('http://127.0.0.1:5000/api/products/sort-by-price', {
        method: 'GET', // GET request to fetch data
        headers: {
            'Content-Type': 'application/json', // Content-Type header
            // Add other headers if needed (like Authorization)
        }
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        // Handle the response data and populate the table
        if (data.status === "success") {
            populateProductTable(data.products);
        } else {
            console.error("Failed to fetch products:", data.message);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error fetching categories:", error);
    });
   
}

// Function to filter products by Stock
function filterByStock() {
    console.log("Filtering by Stock");
    fetch('http://127.0.0.1:5000/api/products/sort-by-stock', {
        method: 'GET', // GET request to fetch data
        headers: {
            'Content-Type': 'application/json', // Content-Type header
            // Add other headers if needed (like Authorization)
        }
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        // Handle the response data and populate the table
        if (data.status === "success") {
            populateProductTable(data.products);
        } else {
            console.error("Failed to fetch products:", data.message);
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error fetching categories:", error);
    });
}

// Function to filter products by Rating
function filterByRating() {
    console.log("Filtering by Rating");
    // Implement your filtering logic here
    // For example, making an API call or filtering products with high ratings
    // You can update the UI based on the filtered results
}
