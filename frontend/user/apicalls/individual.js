window.addEventListener('DOMContentLoaded', async function () {

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id'); // Get the value of the 'id' parameter

  if (!productId) {
    alert('Product ID is missing in the URL');
    return; // Exit if no productId is provided in the URL
  }

  try {
    // Fetch the product data from the API using the productId
    const response = await fetch(`http://127.0.0.1:5000/api/product/${productId}`);

    // Check if the response is OK
    if (response.ok) {
      const data = await response.json();

      // Handle the product data
      if (data.status === 'success') {
        const product = data.product;

        // Update the product details in the DOM
        document.getElementById('main-image').src = product.image_url;
        document.getElementById('thumbnail1').src = product.image_url;
        document.getElementById('thumbnail2').src = product.image_url;
        document.getElementById('thumbnail3').src = product.image_url;
        document.getElementById('thumbnail4').src = product.image_url;

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;

        // Rating and Reviews
        const ratingStars = '⭐'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
        document.getElementById('product-rating').textContent = ratingStars;
        document.getElementById('reviews-count').textContent = `(${product.reviews_count} Reviews)`;

        // Availability status
        document.getElementById('product-status').textContent = product.stock > 0 ? 'In Stock' : 'Out of Stock';

        // You can also add more logic to enable/disable buttons based on stock
        document.getElementById('buy-now').disabled = product.stock <= 0;

        // Dynamically create "Add to Cart" button
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart-button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.disabled = product.stock <= 0; // Disable if out of stock


      } else {
        alert(data.message || 'Product not found');
      }
    } else {
      alert('Failed to load product data');
    }
  } catch (error) {
    console.error('Error fetching product data:', error);

  }
});

// Function to add item to cart
async function addToCart(userId, productId, quantity) {
  // Prepare the data to be sent
  const data = {
    user_id: userId,
    product_id: productId,
    quantity: quantity
  };

  try {
    // Send POST request using fetch API
    const response = await fetch('http://127.0.0.1:5000/api/cart', {
      method: 'POST',                 // HTTP method
      headers: {
        'Content-Type': 'application/json', // Sending data as JSON
      },
      body: JSON.stringify(data)      // Stringify the data object to send in the body
    });

    // Parse the JSON response
    const result = await response.json();

    // Check if the request was successful
    if (response.ok) {
      console.log('Product added to cart:', result);
      alert(result.message);  // You can show a message to the user
    } else {
      console.error('Error adding to cart:', result.message);
      alert(result.message);  // Show the error message
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error during request:', error);
    alert('An error occurred while adding the product to the cart.');
  }
}


function Cart(){
// This would be dynamic, based on the logged-in user
  const quantity = document.getElementById('quantity-input').value; // Get quantity from input field
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  console.log('hello')
  const userData = sessionStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.user.id
  // Call the function to add the product to the cart
  addToCart(userId, productId, quantity);
};
