// Fetch categories from API
fetch('http://127.0.0.1:5000/api/get-all-categories')
    .then(response => response.json())
    .then(data => {
        if (data && data.categories && Array.isArray(data.categories)) {
            // Select the parent container for the category buttons
            const importExportContainer = document.querySelector(".import-export");

            data.categories.forEach(category => {
           
                // Create a new button for each category
                const categoryButton = document.createElement("button");
                categoryButton.className = "dropdown-btn";
                categoryButton.textContent = category.category_name; // Set button text
                categoryButton.dataset.categoryId = category.category_id; // Store category ID in data attribute

                // Add dynamic onclick handler
                categoryButton.onclick = () => handleCategoryClick(category);

                // Append the button to the container
                importExportContainer.appendChild(categoryButton);
            });
        } else {
            console.error("No categories found in the API response.");
        }
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });

// Function to handle category button clicks
function handleCategoryClick(category) {
    console.log(category);
    // Clear existing products from the product container
    const productContainer = document.getElementById('product-list');
    // const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";  // Clear previous products

    // Fetch products based on selected category
    fetch(`http://127.0.0.1:5000/api/products/category/${category.category_id}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.products && Array.isArray(data.products)) {
                // Loop through the products and create product items
                data.products.forEach(product => {
                    // Create product item element
                    const productItem = document.createElement("div");
                    productItem.classList.add("box");

                    // Add product details (image, name, price, and featured status)
                    productItem.innerHTML = `
                        <a href="individualProduct.html?id=${product.id}">
                            <div class="img-box">
                                <img src="${product.image_url}" alt="${product.name}">
                            </div>
                            <div class="detail-box">
                                <h6>${product.name}</h6>
                                <h6>
                                    Price <span>$${parseFloat(product.price).toFixed(2)}</span>
                                </h6>
                            </div>
                            <div class="new">
                                <span>${product.is_featured ? 'Featured' : 'New'}</span>
                            </div>
                        </a>
                    `;
                    // Append the product item to the product container
                    productContainer.appendChild(productItem);
                });
            } else {
                console.error("No products found for the selected category.");
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}


