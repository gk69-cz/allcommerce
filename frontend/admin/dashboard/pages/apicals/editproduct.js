// Extract the product ID from the URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fetch product details and populate the form
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const data = await response.json();
        if (data.status === 'success') {
            const product = data.product;

            // Populate form fields with product details
            document.getElementById('pro-name').value = product.name;
            document.getElementById('pro-description').value = product.description;
            document.getElementById('pro-price').value = product.price;
            document.getElementById('pro-dis-price').value = product.discounted_price;
            document.getElementById('prostock').value = product.stock;
            document.getElementById('entry_type').value = product.category_id;
            document.getElementById('pro-image_url').value = product.image_url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error fetching product details');
    }
}

// Update product details
async function updateProduct() {
    const productId = getProductIdFromUrl();

    // Collect updated form values
    const updatedProduct = {
        name: document.getElementById('pro-name').value,
        description: document.getElementById('pro-description').value,
        price: parseFloat(document.getElementById('pro-price').value),
        discounted_price: parseFloat(document.getElementById('pro-dis-price').value),
        stock: parseInt(document.getElementById('prostock').value),
        category_id: parseInt(document.getElementById('entry_type').value),
        image_url: document.getElementById('pro-image_url').value,
    };

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/edit-products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        const data = await response.json();
        if (data.status === 'success') {
            alert('Product updated successfully');
            // Optionally, redirect or refresh the page
            // Example redirect
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error updating product');
    }
}

// Load categories into the dropdown
async function loadCategories() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get-all-categories'); // Update endpoint accordingly
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        if (data.status === 'success') {
            const categories = data.categories;

            const dropdown = document.getElementById('entry_type');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.name;
                dropdown.appendChild(option);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error fetching categories');
    }
}

// On page load, initialize the form
document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();

    if (productId) {
        fetchProductDetails(productId); // Populate form with existing product details
    }

    loadCategories(); // Load categories into dropdown
});
