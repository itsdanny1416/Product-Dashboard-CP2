// Step 3: Promise-based fetch
function fetchProductsThen() {
  fetch("https://www.course-api.com/javascript-store-products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((product) => {
        console.log(product.fields.name);
      });
    })
    .catch((error) => {
      console.error("Fetch error (then):", error.message);
    });
}

// Step 4: Async/Await fetch
async function fetchProductsAsync() {
  try {
    const response = await fetch(
      "https://www.course-api.com/javascript-store-products"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    handleError(error);
  }
}

// Step 5: Display products
function displayProducts(products) {
  const container = document.querySelector("#product-container");
  container.innerHTML = "";

  // Show only first 5 products
  products.slice(0, 5).forEach((product) => {
    const { name, price, image } = product.fields;

    const card = document.createElement("div");
    card.classList.add("product-card");

    const img = document.createElement("img");
    img.src = image[0].url;
    img.alt = name;

    const title = document.createElement("h3");
    title.textContent = name;

    const cost = document.createElement("p");
    cost.textContent = `$${(price / 100).toFixed(2)}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(cost);

    container.appendChild(card);
  });
}

// Step 6: Error handling
function handleError(error) {
  console.error("An error occurred:", error.message);
}

// Step 7: Call both functions
fetchProductsThen();
fetchProductsAsync();
