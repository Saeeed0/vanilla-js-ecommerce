function getBestSellers() {
  const bestSellers = document.getElementById("best-sellers");
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      let products = JSON.parse(xhr.responseText);

      // تقسيم المنتجات حسب الـ categoryId
      const categories = products.reduce((acc, product) => {
        if (!acc[product.categoryId]) {
          acc[product.categoryId] = [];
        }
        acc[product.categoryId].push(product);
        return acc;
      }, {});

      // إنشاء DOM لكل فئة
      for (const [categoryId, items] of Object.entries(categories)) {
        bestSellers.innerHTML += `
          <div class="cat-container">
          <div class="container">
              <p>Best Sellers in Category ${categoryId}</p>
              <div class="category category-${categoryId}"></div>
          </div>
          </div>
        `;
        console.log(items);

        const categoryDiv = bestSellers.querySelector(
          `.category-${categoryId}`
        );
        for (const prod of items) {
          categoryDiv.innerHTML += `
            <div class="card">
              <a href="../product-details/product.html?id=${prod.id}">
                <img src="${prod.image}" alt="${prod.title}">
                <p>${prod.title}</p>
                <p><span>Rating: ${prod.rating.rate} </span> <span>Count: ${prod.rating.count}</span></p>
                <p>Price: ${prod.price} $</p>
              </a>
              <p>${prod.description}</p>
            </div> 
          `;
        }
      }
    }
  };
  xhr.open("GET", "http://localhost:3000/products");
  xhr.send();
}
getBestSellers();
