const filterButtons = document.querySelectorAll('.filter-buttons button');

// Function to handle button click
function handleFilterButtonClick(buttonIndex) {
  filterButtons.forEach((button, index) => {
    if (index === buttonIndex) {
      button.style.backgroundColor = 'black';
      button.style.color = 'white';
    } else {
      button.style.backgroundColor = 'white';
      button.style.color = 'black';
    }
  });
}

// Attach event listeners to each button
filterButtons.forEach((button, index) => {
  button.addEventListener('click', () => handleFilterButtonClick(index));
});

function updateProgress(totalAmount, totalOrders, shippedAmount, shippedCount, pickupsAmount, pickupsCount) {
    // Update total amount and orders
    document.getElementById('totalAmount').textContent = totalAmount;
    document.getElementById('totalOrders').textContent = totalOrders + " Orders";
    
    // Update stats
    document.getElementById('totalShipped').textContent = shippedAmount;
    document.getElementById('shippedCount').textContent = shippedCount + " shipments";
    document.getElementById('totalPickups').textContent = pickupsAmount;
    document.getElementById('pickupCount').textContent = pickupsCount + " pickups";
  
    // Calculate the percentage of the circle based on total value
    let total = parseFloat(totalAmount.replace('$', '').replace('M', '')) * 1000000;
    let shipped = parseFloat(shippedAmount.replace('$', '').replace('M', '')) * 1000000;
    let percentage = (shipped / total) * 100;
  
    // Update the circle's progress dynamically
    const circle = document.querySelector('.circle');
    circle.style.strokeDasharray = percentage + ", 100";
  }
  
  // Example: Call the function with dynamic values
  updateProgress("$2.2M", 242, "$864,600", 95, "$1.34M", 147);
 
 
 
 
  // Load the default page on initial load
 
  
//   page Selection
function loadContent(page) {
    console.log('Redirecting to:', page);

    // Redirect to the provided page
    window.location.href = page;
}

// Add an event listener to the  item
document.getElementById('logout').addEventListener('click', function() {
  console.log('test')
logoutAndRedirect();
});

// Custom function to log out and redirect to login page
function logoutAndRedirect() {
  // Perform any  actions here (e.g., clearing sessionStorage, localStorage, etc.)
  // For example:
  localStorage.removeItem('userToken');  // Example if you're storing a token

  // Redirect to login.html
  window.location.href = 'login.html';
}

//   users page
