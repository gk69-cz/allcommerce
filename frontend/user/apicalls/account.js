

window.onload = function () {
  const userData = sessionStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const userId = parsedData.user.id
  console.log(userId);
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
        document.getElementById('name').value = data.user.name;
        document.getElementById('email').value = data.user.email;
        document.getElementById('phone_number').value = data.user.phone_number;


        // Call function to populate orders
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    })
    .catch(error => {
      // Handle any errors
      console.error("Error fetching orders:", error);
    });
};

function pass (){
    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone_number = document.getElementById('phone_number').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;
        const role = document.getElementById('role').value;

        if (password !== confirm_password) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone_number, password, role }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Signup successful');
                window.location.href = 'login.html';
                console.log(result);
            } else {
                alert(result.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again.');
        }
    });

}