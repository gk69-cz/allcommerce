const sessionId = 500050; 

fetch('shared/header.html') 
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
    
    // Bind event listeners after the navbar is loaded
    bindNavbarEvents();
  })
  .catch(error => console.error('Error loading navbar:', error));

// Function to load and inject the footer
fetch('shared/footer.html') // Adjust this path based on the actual location of footer.html
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));
  
// Function to bind event listeners to navbar buttons
function bindNavbarEvents() {
  // Ensure the functions are defined and bind them to the buttons after the navbar is loaded
  const wishlistButton = document.querySelector('.wishlist-button');
  if (wishlistButton) {
    wishlistButton.addEventListener('click', navigateToWishlist);
  }

  const cartButton = document.querySelector('.cart-button');
  if (cartButton) {
    cartButton.addEventListener('click', navigateToCart);
  }

  const accountButton = document.querySelector('.account-button');
  if (accountButton) {
    accountButton.addEventListener('click', navigateToAccount);
  }
}

function navigateToWishlist() {
  console.log('test')
    if (!sessionId) {
        // No sessionId, redirect to login screen
        window.location.href = "login.html";
    } else {
        // Append sessionId to the URL
        window.location.href = `/frontend/user/wishlist.html`;
    }
}

function navigateToCart() {
    if (!sessionId) {
        // No sessionId, redirect to login screen
        window.location.href = "login.html";
    } else {
        // Append sessionId to the URL
        window.location.href = `/frontend/user/cart.html?sessionId=${sessionId}`;
    }
}

function navigateToAccount() {
    if (!sessionId) {
        // No sessionId, redirect to login screen
        window.location.href = "login.html";
    } else {
        // Append sessionId to the URL
        window.location.href = `/frontend/user/account.html?sessionId=${sessionId}`;
    }
}
