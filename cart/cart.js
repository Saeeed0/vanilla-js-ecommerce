let userID;
let productArray;
let theCart;

let totalPrice = 0;
let userCart
let cartTotalPrice = document.getElementById("total-price")

let params = new URLSearchParams(window.location.search)
userID = params.get("id");


let cartsReq = new XMLHttpRequest();
cartsReq.open("GET", "http://localhost:3000/carts", false);

cartsReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
        jsData = JSON.parse(this.responseText);

        userCart = jsData.find(function (p) {
            return p.userId == userID;
        })
        productArray = userCart.products;
    }
}
cartsReq.send();


let productsReq = new XMLHttpRequest();
productsReq.open("GET", "http://localhost:3000/products", false);

productsReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
        jsData = JSON.parse(this.responseText);
        let productContainer = document.getElementById("productContainer");

        for (let i = 0; i < productArray.length; i++) {
            let product = jsData.find(function (p) {
                return p.id == productArray[i].productId;
            })

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item")
            let productImage = document.createElement("img")
            productImage.src = product.image;

            let itemDetails = document.createElement("div");
            itemDetails.classList.add("item-details")
            let productName = document.createElement("h3");
            productName.classList.add("product-name")
            productName.innerText = product.title
            itemDetails.appendChild(productName);

            let price = document.createElement("p");
            price.classList.add("price")
            price.innerText = product.price + " $"

            itemDetails.appendChild(price);

            let removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-btn");

            removeBtn.innerText = "X"

            removeBtn.addEventListener("click", function () {
                let xhrGet = new XMLHttpRequest();
                xhrGet.open("GET", `http://localhost:3000/carts/${userID}`, true);

                xhrGet.onreadystatechange = function () {
                    if (xhrGet.readyState === 4 && xhrGet.status === 200) {
                        let cart = JSON.parse(xhrGet.responseText);

                        cart.products = cart.products.filter(p => p.productId !== product.id);

                        let xhrPatch = new XMLHttpRequest();
                        xhrPatch.open("PATCH", `http://localhost:3000/carts/${userID}`, true);
                        xhrPatch.setRequestHeader("Content-Type", "application/json");

                        xhrPatch.onreadystatechange = function () {
                            if (xhrPatch.readyState === 4 && xhrPatch.status === 200) {
                                console.log("✅ Product deleted:", xhrPatch.responseText);
                            }
                        };

                        xhrPatch.send(JSON.stringify({ products: cart.products }));
                    }
                };

                xhrGet.send();
            })

            let quantityContainer = document.createElement("div");
            quantityContainer.classList.add("quantity")
            let minusBtn = document.createElement("button");
            minusBtn.classList.add("minus")
            minusBtn.innerText = "-"

            minusBtn.addEventListener("click", function () {
                inputQuantity.value--;
                if (inputQuantity.value == 1) {
                    minusBtn.style.pointerEvents = "none"
                    minusBtn.style.opacity = "0.5"
                }
                totalPrice -= Number(product.price);
                cartTotalPrice.innerText = totalPrice;
                let newPrice = product.price * inputQuantity.value
                price.innerText = newPrice + " $";


                let xhrGet = new XMLHttpRequest();
                xhrGet.open("GET", `http://localhost:3000/carts/${userID}`, false)
                xhrGet.onreadystatechange = function () {
                    if (xhrGet.status === 200 && xhrGet.readyState === 4) {
                        let cart = JSON.parse(xhrGet.responseText);

                        let PID = product.id;
                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$")
                        console.log(PID);

                        let existingProduct = cart.products.find(p => p.productId === PID);

                        if (existingProduct) {
                            existingProduct.quantity -= 1;
                            cart.date = new Date();
                        }
                        else {
                            cart.date = new Date();
                            cart.products.push({
                                productId: PID,
                                quantity: 1
                            });
                        }

                        let xhrPut = new XMLHttpRequest();
                        xhrPut.open("PATCH", `http://localhost:3000/carts/${userID}`);
                        xhrPut.setRequestHeader("Content-Type", "application/json");
                        xhrPut.onload = function () {
                            if (xhrPut.status === 200) {
                                console.log("✅ Updated:", xhrPut.responseText);
                            }
                        };
                        xhrPut.send(JSON.stringify(cart));
                    }
                };
                xhrGet.send();
            })

            let inputQuantity = document.createElement("input")
            inputQuantity.classList.add("input");
            inputQuantity.type = "number";
            inputQuantity.value = productArray[i].quantity;
            inputQuantity.min = 1;

            totalPrice += (product.price) * (inputQuantity.value);
            cartTotalPrice.innerText = totalPrice;

            let plusBtn = document.createElement("button");
            plusBtn.classList.add("plus")
            plusBtn.innerText = "+"

            if (inputQuantity.value == 1) {
                minusBtn.style.pointerEvents = "none"
                minusBtn.style.opacity = "0.5"
            }

            let newPrice = product.price * inputQuantity.value
            price.innerText = newPrice + " $";

            
            plusBtn.addEventListener("click", function () {
                inputQuantity.value++;
                minusBtn.style.pointerEvents = "auto";
                minusBtn.style.opacity = "1";
                totalPrice += Number(product.price);
                cartTotalPrice.innerText = totalPrice;
                newPrice = product.price * inputQuantity.value
                price.innerText = newPrice + " $";


                let xhrGet = new XMLHttpRequest();
                xhrGet.open("GET", `http://localhost:3000/carts/${userID}`, false)
                xhrGet.onreadystatechange = function () {
                    if (xhrGet.status === 200 && xhrGet.readyState === 4) {
                        let cart = JSON.parse(xhrGet.responseText);

                        let PID = product.id;
                        let existingProduct = cart.products.find(p => p.productId === PID);

                        if (existingProduct) {
                            existingProduct.quantity += 1;
                            cart.date = new Date();
                        }
                        else {
                            cart.date = new Date();
                            cart.products.push({
                                productId: PID,
                                quantity: 1
                            });
                        }

                        let xhrPut = new XMLHttpRequest();
                        xhrPut.open("PATCH", `http://localhost:3000/carts/${userID}`);
                        xhrPut.setRequestHeader("Content-Type", "application/json");
                        xhrPut.onload = function () {
                            if (xhrPut.status === 200) {
                                console.log("✅ Updated:", xhrPut.responseText);
                            }
                        };
                        xhrPut.send(JSON.stringify(cart));
                    }
                };
                xhrGet.send();

            })

            quantityContainer.appendChild(minusBtn);
            quantityContainer.appendChild(inputQuantity);
            quantityContainer.appendChild(plusBtn);

            itemDetails.appendChild(quantityContainer);

            cartItem.appendChild(productImage);
            cartItem.appendChild(itemDetails);
            cartItem.appendChild(removeBtn);
            productContainer.appendChild(cartItem);

        }

    }
}
productsReq.send();

cartTotalPrice.innerText = totalPrice;

let checkoutBtn = document.getElementById("checkout-btn")
checkoutBtn.addEventListener("click",function(){
    window.location.href = `../checkout/checkout.html?id=${userID}`
})






