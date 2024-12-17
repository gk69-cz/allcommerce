function addProduct() {
    // Get the values from input fields (you can modify the IDs as per your form)
    const productName = document.getElementById('pro-name').value || '';  // Default empty string if not provided
    const productDescription = document.getElementById('pro-description').value || '';  // Default empty string if not provided
    const productPrice = parseFloat(document.getElementById('pro-price').value) || 0.00;  // Default to 0.00 if not provided
    const productDiscountedPrice = parseFloat(document.getElementById('pro-dis-price').value) || null;  // Default to null if not provided
    const productStock = parseInt(document.getElementById('prostock').value) || 0;  // Default to 0 if not provided
    const productCategoryId = document.getElementById('entry_type').value || '';  // Default empty string if no category is selected

    const productImageUrl = document.getElementById('pro-image_url').value || '';  // Default empty string if not provided
  

    // Validate input values
    if (!productName || !productPrice || !productStock || !productCategoryId) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create the product object
    const productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        discounted_price: productDiscountedPrice,
        stock: productStock,
        category_id: productCategoryId,
        image_url: productImageUrl
    };

    // Send POST request to the backend API
    fetch('http://127.0.0.1:5000/api/add-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)  // Send the product data as JSON
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.status === 'success') {
                alert('Product added successfully!');
                // Optionally, reset form fields or redirect to another page
            } else {
                alert('Failed to add product: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the product.');
        });
}
// Function to fetch categories from the API and populate the dropdown
async function fetchCategories() {
    try {
        // Example API endpoint to fetch categories (replace with your actual API endpoint)
        const response = await fetch('http://127.0.0.1:5000/api/get-all-categories');

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        // Parse the JSON response
        const data = await response.json();

        // Get the select element for entry_type (Category dropdown)
        const categorySelect = document.getElementById('entry_type');

        // Check if categories exist in the response
        if (data && data.categories && Array.isArray(data.categories)) {
            // Clear any existing options
            categorySelect.innerHTML = '<option value="" disabled="" selected="">Select Category</option>';

            // Add each category to the dropdown
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;  // Set the category_id as the value
                option.textContent = category.category_name;  // Set the category_name as the display text
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}


window.onload = function () {
    fetchCategories();
}


