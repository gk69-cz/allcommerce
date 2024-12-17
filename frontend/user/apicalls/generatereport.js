function getUser() {
    const userData = sessionStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.user.id
    fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
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
            console.log(data.user)
            document.getElementById('user-name').textContent = data.user.name;
            document.getElementById('user-email').textContent = data.user.email;
            document.getElementById('user-phone').textContent = data.user.phone_number;
          } else {
            console.error("Failed to fetch orders:", data.message);
          }
        })
        .catch(error => {
          // Handle any errors
          console.error("Error fetching orders:", error);
        });
}

// Fetch cart items and total amount
function getCartItems() {
    const userData = sessionStorage.getItem("userData");
    const parsedData = JSON.parse(userData);
    const userId = parsedData.user.id
    let totalAmount = 0;
    fetch(`http://127.0.0.1:5000/api/cart/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data)
                
                const productItems = data.cart_items.map(item => {
                    totalAmount += parseFloat(item.subtotal);
                    return `
                        <tr>
                            <td>${item.name}</td>
                          
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>${item.subtotal}</td>
                        </tr>
                    `;
                }).join('');
                document.getElementById('product-items').innerHTML = productItems;
                document.getElementById('total-amount').textContent = totalAmount;
            }
        });
}

// Use userId to fetch both user info and cart items


// Call the fetchBill function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const userId = 1; // Replace with the actual user ID you want to get the bill for
    getUser();
    getCartItems()
});
