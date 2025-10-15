/**
 * cp_2.js
 * - Step 3: fetchProductsThen() using .then()/.catch()
 * - Step 4: fetchProductsAsync() using async/await with try/catch
 * - Step 5: displayProducts(products) renders first 5 (name, image, price)
 * - Step 6: handleError(error) reusable error logger
 * - Step 7: Call both functions at the bottom
 * Notes:
 * - Includes robust field access and fallbacks for missing data
 * - Logs each product name in the promise-based path as required
 */

const API_URL = "https://www.course-api.com/javascript-store-products";
const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>
      <rect width='100%' height='100%' fill='#0b0e13'/>
      <g fill='#7aa2ff' font-family='Arial,Helvetica,sans-serif'>
        <text x='50%' y='50%' text-anchor='middle' font-size='24' fill='#7aa2ff'>No Image</text>
      </g>
    </svg>`
  );

/* Utility: set a user-visible status line (non-blocking) */
function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg || "";
}

/* Step 6: Reusable error handler */
function handleError(error) {
  const message = error?.message || String(error);
  console.error("An error occurred:", message);
  setStatus(`An error occurred: ${message}`);
}

/* DOM helpers */
function $(sel, root = document) {
  return root.querySelector(sel);
}
function createEl(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "text") el.textContent = v;
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  return el;
}

/* Step 5: Render the first 5 products */
function displayProducts(products) {
  const container = $("#product-container");
  if (!container) {
    console.warn("#product-container not found in DOM");
    return;
  }

  container.innerHTML = "";

  // Defensive: ensure we have an array
  const list = Array.isArray(products) ? products.slice(0, 5) : [];

  if (list.length === 0) {
    setStatus("No products to display.");
    return;
  }

  list.forEach((product) => {
    const fields = product?.fields ?? {};
    const name = fields.name ?? "Unnamed Product";
    const priceCents = typeof fields.price === "number" ? fields.price : 0;
    const price = `$${(priceCents / 100).toFixed(2)}`;
    const imgUrl =
      Array.isArray(fields.image) && fields.image[0]?.url
        ? fields.image[0].url
        : FALLBACK_IMG;

    const card = createEl("article", "product-card", {
      role: "listitem",
      "aria-label": name,
    });

    const media = createEl("div", "product-media");
    const img = createEl("img", "", { src: imgUrl, alt: name, loading: "lazy" });
    media.appendChild(img);

    const body = createEl("div", "product-body");
    const title = createEl("h3", "product-title", { text: name, title: name });
    const priceEl = createEl("p", "product-price", { text: price });

    body.appendChild(title);
    body.appendChild(priceEl);

    card.appendChild(media);
    card.appendChild(body);

    container.appendChild(card);
  });

  setStatus(`Showing ${Math.min(5, products.length || 0)} product(s).`);
}

/* Optional: lightweight skeletons while loading (no requirement, but nice) */
function showSkeletons(count = 5) {
  const container = $("#product-container");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = createEl("div", "product-card");
    const media = createEl("div", "product-media skeleton");
    const body = createEl("div", "product-body");
    const line1 = createEl("div", "skeleton", { style: "height:18px;border-radius:8px" });
    const line2 = createEl("div", "skeleton", { style: "height:14px;width:40%;border-radius:8px" });
    body.appendChild(line1);
    body.appendChild(line2);
    card.appendChild(media);
    card.appendChild(body);
    container.appendChild(card);
  }
}

/* Step 3: Promise-based fetch (.then/.catch) that logs each product name */
function fetchProductsThen() {
  // Show skeletons for UX
  showSkeletons(5);
  setStatus("Loading products (promise)…");

  return fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Network error (${res.status})`);
      return res.json();
    })
    .then((data) => {
      // Log each product’s name (requirement)
      (Array.isArray(data) ? data : []).forEach((p, i) => {
        const nm = p?.fields?.name ?? `Product ${i + 1}`;
        console.log(nm);
      });
      // Do not render here (this function’s job is logging). The async version renders.
      setStatus("Products loaded (promise).");
      return data;
    })
    .catch((err) => {
      console.error("Fetch error (then):", err?.message || err);
      handleError(err);
    });
}

/* Step 4: Async/Await fetch with try/catch that renders via displayProducts */
async function fetchProductsAsync() {
  try {
    setStatus("Loading products (async)...");
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Network error (${res.status})`);
    const products = await res.json();
    displayProducts(products);
    return products;
  } catch (error) {
    handleError(error);
  }
}

/* Step 7: Call both functions */
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Call the promise-based version, which logs names
  fetchProductsThen();

  // 2) Call the async version, which renders the first 5 products
  await fetchProductsAsync();
});