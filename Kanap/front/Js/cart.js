const parsedUrl = new URL(window.location.href);
const productId = parsedUrl.searchParams.get("id");
const url = "http://localhost:3000/api/products/";
const productUrl = url + productId;

const cartItems = document.getElementById("cart__items");
const cartOrder = document.getElementsByTagName("cart__order");
const regexName = /^[a-z][a-z '-.,]{2,40}$|^$/i;



async function detectQuantityChange(classElement) {
  document.querySelectorAll(classElement).forEach((quantityBtn) => {
    quantityBtn.addEventListener("change", async (e) => {
      const id = e.target.closest(".cart__item").dataset.id;
      const color = e.target.closest(".cart__item").dataset.color;
      let newQuantity = quantityBtn.value;
      const newCart = (await getCartInLocalStorage()).map((element) => {
        const newItem = { ...element };
        if (newItem.id === id && newItem.colors === color) {
          newItem.quantity = parseInt(newQuantity);
        }
        return newItem;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      priceAmount(newCart);
      renderTotalArticles(newCart);
    });
  });
}

async function detectDeleteItem(classElement) {
  document.querySelectorAll(classElement).forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async (e) => {
      const itemId = e.target.closest(".cart__item").dataset.id;
      const itemColor = e.target.closest(".cart__item").dataset.color;
      const deleteCart = (await getCartInLocalStorage()).filter((element) => {
        if (element.id !== itemId && element.colors !== itemColor) {
          return true;
        }
      });
      localStorage.setItem("cart", JSON.stringify(deleteCart));
      priceAmount(deleteCart);
      renderTotalArticles(deleteCart);
      renderItems(deleteCart);
    });
  });
}

async function getCartInLocalStorage() {
  const product = await getAllProductsApi();
  const arrayLocalStorage = JSON.parse(localStorage.getItem("cart"));
  return arrayLocalStorage.map((element) => {
    const newElement = { ...element };
    const productIndex = product.findIndex(
      (item) => item._id === newElement.id
    );
    newElement.price = product[productIndex].price;
    newElement.image = product[productIndex].imageUrl;
    newElement.altTxt = product[productIndex].altTxt;
    newElement.name = product[productIndex].name;
    return newElement;
  });
}

function renderItems(items) {
  const cartItems = document.getElementById("cart__items");
  cartItems.innerHTML = '';

  items.forEach((item) => {
    const article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", item.id);
    article.setAttribute("data-color", item.colors);
    article.innerHTML = `
      <div class="cart__item__img">
          <img src="${item.image}" alt="${item.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.colors}</p>
          <p>${item.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>`;

    cartItems.appendChild(article);
  });

  priceAmount(items);
  renderTotalArticles(items);
}

async function getAllProductsApi() {
  try {
    const allProducts = await fetch(url);
    const products = await allProducts.json();
    return products;
  } catch (error) {
    console.error(error.message);
  }
}

function priceAmount(itemsInLocalStorage) {
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.innerHTML = itemsInLocalStorage
    .map((element) => element.quantity * element.price)
    .reduce((prev, next) => {
      return prev + next;
    }, 0);
}

function renderTotalArticles(itemsInLocalStorage) {
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = itemsInLocalStorage
    .map((element) => element.quantity)
    .reduce((prev, next) => {
      return prev + next;
    }, 0);
}

(async () => {
  // Variables

  try {
    const itemsParsed = await getCartInLocalStorage();
    renderItems([...itemsParsed]);
    await detectQuantityChange(".itemQuantity");
    await detectDeleteItem(".deleteItem");
    validateFirstName();
    validateLastName();
    validateAddress();
    validateCity();
    validateEmail();
  } catch (error) {
    console.error(error.message);
  }
})();

// REGEX


async function validateFirstName(){
  const firstName = document.getElementById("firstName");
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  firstName.addEventListener("change", (e) => {
    let firstNameValue = e.target.value;
    console.log(firstNameValue)
    if (regexName.test(firstNameValue) == "") {
      firstNameErrorMsg.innerHTML = "Veuillez remplir ce champ";
    }
    if (regexName.test(firstNameValue) === false) {
      firstNameErrorMsg.innerHTML =
        "Saisie invalide, veuillez remplir ce champ avec uniquement des lettres (minimum 2 et maximum 40)";
      return false;
    } else {
      firstNameErrorMsg.innerHTML = null;
      return true;
    }
  });
  
}
validateFirstName()

function validateLastName(){
const lastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
lastName.addEventListener("change", (e) => {
  let lastNameValue = e.target.value;
  if (regexName.test(lastNameValue) == "") {
    lastNameErrorMsg.innerHTML = "Veuillez remplir ce champ";
  }
  if (regexName.test(lastNameValue) === false || regexName.test(lastNameValue) === "") {
    lastNameErrorMsg.innerHTML =
      "Saisie invalide, veuillez remplir ce champ avec uniquement des lettres (minimum 2 et maximum 40)";
    return false;
  } else {
    lastNameErrorMsg.innerHTML = null;
    return true;
  }
});
}
validateLastName()

function validateAddress() {
const regexAddress = /^([a-zA-z0-9/\\''(),-\s]{2,55})$/i;
const address = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
address.addEventListener("change", (e) => {
  let addressValue = e.target.value;
  if (regexAddress.test(addressValue) === "") {
    addressErrorMsg.innerHTML = "Veuillez remplir ce champ";
    return false
  }
  if (regexAddress.test(addressValue) === false) {
    addressErrorMsg.innerHTML =
      "Saisie invalide, ce champ doit contenir un numéro et une rue/avenue/chemin etc";
    return false;
  } else {
    addressErrorMsg.innerHTML = null;
    return true;
  }
});
}
validateAddress();

function validateCity() {
  const city = document.getElementById("city");
  const cityErrorMsg = document.getElementById("cityErrorMsg");
city.addEventListener("change", (e) => {
  let cityValue = e.target.value;
  if (regexName.test(cityValue) === "") {
    cityErrorMsg.innerHTML = "Veuillez remplir ce champ";
  }
  if (regexName.test(cityValue) == false) {
    cityErrorMsg.innerHTML =
      "Saisie invalide, veuillez remplir ce champ avec uniquement des lettres ";
    return false;
  } else {
    cityErrorMsg.innerHTML = null;
    return true;
  }
});
}
validateCity();

function validateEmail(){
  const email = document.getElementById("email");
  const emailErrorMsg = document.getElementById("emailErrorMsg");
email.addEventListener("change", (e) => {
  let emailValue = e.target.value;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (regexEmail.test(emailValue) === false) {
    emailErrorMsg.innerHTML =
      "Saisie invalide, l'adresse mail doit comporter un @";
    return false;
  } else {
    emailErrorMsg.innerHTML = null;
    return true;
  }
});
}
validateEmail()

async function validateForm() {
  if (validateFirstName() === false ||
      validateLastName() === false ||
      validateAddress() === false ||
      validateCity() === false ||
      validateEmail() === false){
        return alert("Veuillez, compléter le formulaire")
      }
}
validateForm();

async function contactForm() {
  const order = document.getElementById("order");
  const itemsStorage = await getCartInLocalStorage();
  console.log(itemsStorage)
  order.addEventListener("click", (e) => {
    e.preventDefault()
    const productArray = [];
    for (i = 0; i < itemsStorage.length; i++) { console.log(itemsStorage[i].id)
      productArray.push(itemsStorage[i].id)
      
    };
    console.log(productArray)
    const orderData = {
      contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
      
    },
    products : productArray,
    
  }
  console.log(orderData)
    fetch ("http://localhost:3000/api/products/order", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(orderData),
    })
    .then((res) => res.json())
    .then((data) => { console.log(data)
        const orderId = data.orderId;
        
       
        document.location.href = 'confirmation.html?orderId='+ orderId
  })  
})
 }
contactForm()
