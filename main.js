// Fetch Component Code From It's Path
function loadComponent(selector, file) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    });
}

// استدعاء في كل صفحة
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#nav", "shared/navbar/navbar.html");
  loadComponent("#footer", "shared/footer/footer.html");

});




// Endpoints:
// http://localhost:3000/products
// http://localhost:3000/carts
// http://localhost:3000/users
// http://localhost:3000/categories
