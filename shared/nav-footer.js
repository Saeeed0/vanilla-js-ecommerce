// Fetch Component Code From It's Path
function loadComponent(selector, file) {
  return fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    });
}

// استدعاء في كل صفحة
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#nav", "/shared/navbar/navbar.html").then(() => {
      
      let user = localStorage.getItem("loggedInUser");
      if(user){
          document.getElementById("loginBtn").style.display = "none";
          document.getElementById("registerBtn").style.display = "none";

      }
      else{
          document.getElementById("logoutBtn").style.display = "none";
          document.getElementById("profile").style.display = "none";
      }
    });
    loadComponent("#footer", "/shared/footer/footer.html");
    
});


function navLogOut(){
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loginInput");
  localStorage.removeItem("rememberLogin");
}