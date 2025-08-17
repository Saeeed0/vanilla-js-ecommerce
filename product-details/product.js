let userID;
let searcheEmailFlag = true;
let registerFlag = false;

let usersReq = new XMLHttpRequest();
usersReq.open("GET", "http://localhost:3000/users", false);
usersReq.onreadystatechange = function () {
  if (this.readyState === 4 && this.status == 200) {
    let jsData = JSON.parse(this.responseText);
    let user;
    const userInfo = JSON.parse(localStorage.getItem("loggedInUser"));
    const userName = userInfo.username;

    if (userName) {
      user = jsData.find(function (p) {
        return p.username === userName;
      });
      if (user) {
        userID = user.id;
        searcheEmailFlag = false;
      } else {
        searcheEmailFlag = true;
      }
    }
    if (searcheEmailFlag) {
      let email = window.localStorage.getItem("loginInput");
      user = jsData.find(function (p) {
        return p.email === email;
      });

      if (user) {
        userID = user.id;
        registerFlag = false;
      } else {
        registerFlag = true;
      }
    }
    if (registerFlag) {
      window.location.href = `../register/register.html`;
    }
  }
};
usersReq.send();

let req = new XMLHttpRequest();
let product = document.getElementsByClassName("product-details");
productDetails = product[0];
req.open("GET", "http://localhost:3000/products");

req.onreadystatechange = function () {
  if (req.readyState === 4 && req.status === 200) {
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");

    console.log(productId);

    jsData = JSON.parse(req.responseText);
    var product = jsData.find(function (p) {
      return p.id === productId;
    });

    if (product) {
      let productTitle = document.getElementById("productName");
      let text = document.createTextNode(product.title);
      productTitle.appendChild(text);
      productDetails.appendChild(productTitle);

      let productImage = document.createElement("img");
      productImage.src = product.image;
      productDetails.appendChild(productImage);

      let productPrice = document.createElement("div");
      productPrice.classList.add("product-price");
      text = document.createTextNode(product.price);
      let text2 = document.createTextNode(" $");
      productPrice.appendChild(text);
      productPrice.appendChild(text2);
      productDetails.appendChild(productPrice);

      let productDiscription = document.createElement("div");
      productDiscription.classList.add("product-discription");
      text = document.createTextNode(product.description);
      productDiscription.appendChild(text);
      productDetails.appendChild(productDiscription);

      let beyBtn = document.createElement("button");
      beyBtn.id = "buy-btn";
      beyBtn.classList.add("buy-btn");
      beyBtn.textContent = "Add To Cart";
      productDetails.appendChild(beyBtn);

      beyBtn.addEventListener("click", function () {
        let xhrGet = new XMLHttpRequest();
        xhrGet.open("GET", `http://localhost:3000/carts/${userID}`, false);
        xhrGet.onreadystatechange = function () {
          if (xhrGet.status === 200 && xhrGet.readyState == 4) {
            let cart = JSON.parse(xhrGet.responseText);

            let params = new URLSearchParams(window.location.search);
            let PID = params.get("id");
            let existingProduct = cart.products.find((p) => p.productId == PID);

            if (existingProduct) {
              existingProduct.quantity += 1;
              cart.date = new Date();
            } else {
              cart.date = new Date();
              cart.products.push({
                productId: PID,
                quantity: 1,
              });
            }
            let xhrPatch = new XMLHttpRequest();
            xhrPatch.open(
              "PATCH",
              `http://localhost:3000/carts/${userID}`,
              false
            );
            xhrPatch.setRequestHeader("Content-Type", "application/json");
            xhrPatch.onload = function () {
              if (xhrPatch.status === 200) {
                console.log(xhrPatch.responseText);
              }
            };
            xhrPatch.send(
              JSON.stringify({ date: cart.date, products: cart.products })
            );
          }
        };
        xhrGet.send();
        window.location.href = `../cart/cart.html?id=${userID}`;
      });
    } else {
      let errorMsg = document.createElement("p");
      let textMsg = "Not Found In Database";
      errorMsg.innerText = textMsg;
      productDetails.appendChild(errorMsg);
    }
  }
};
req.send();
