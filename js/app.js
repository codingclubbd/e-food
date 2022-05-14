function $(selector) {
  return document.querySelector(selector);
}

const nav = $('#nav');
const toggler = $('.toggler');
const display = $('.food_display');
const overlay = $('.overlay');
const modal = $('.modal');
const modalContent = $('.modal_content');
const closeBtn = $('.close');

overlay.onclick = close;
closeBtn.onclick = close;

function close() {
  modal.style.display = 'none';
}
close();

function modalOpen() {
  modal.style.display = 'block';
}

toggler.onclick = function () {
  nav.classList.toggle('show');
};

window.onload = getCategories;
let categories;

async function getCategories() {
  const response = await fetch('./../resources/categories.json');

  const data = await response.json();
  categories = data.categories;
  displayCategories();
}

function displayCategories() {
  display.innerHTML = '';
  categories.forEach(
    ({ idCategory, strCategory, strCategoryDescription, strCategoryThumb }) => {
      const div = document.createElement('div');
      div.className = 'category_card';
      div.innerHTML = `
        <div class="category_image">
          <img
            src="${strCategoryThumb}"
            alt=""
          />
        </div>
        <h3>${strCategory}</h3>
        <div class="bottom">
          <button id="seeBtn" onclick="getCategory('${strCategory}')">See Category</button>
          <button onclick="getDetails(${idCategory})">Get Details</button>
        </div>`;

      display.appendChild(div);
    }
  );
}

function getDetails(id) {
  modalOpen();
  const selectedCategory = categories.find(cat => cat.idCategory === id + '');
  modalContent.innerHTML = `
  <div className="category_details">
     <img style="width:100%" src="${selectedCategory.strCategoryThumb}" />
     <h2>Category: ${selectedCategory.strCategory}</h2>
    <p style="margin-top:20px"><b>Description</b>: ${selectedCategory?.strCategoryDescription?.slice(
      0,
      500
    )}</p>
  `;
}

async function getCategory(catName) {
  console.log(catName);
  const response = await fetch('./../resources/foods.json');
  const { meals } = await response.json();
  const filteredFoods = meals.filter(food => food.category === catName);
  display.innerHTML = '';
  filteredFoods.forEach(
    ({ idMeal, category, strMeal, strMealThumb, price }) => {
      const div = document.createElement('div');
      div.className = 'category_card';
      div.innerHTML = `
        <div class="category_image">
          <img
          style="width:350px"
            src="${strMealThumb}"
            alt=""
          />
        </div>
        <h3>Price: ${price} TK.</h3>
        <p style="margin:5px 15px">Name: ${strMeal.slice(0, 20)}</p>
        <div class="bottom">
          <button id="seeBtn" onclick="addToCart('${idMeal}')">Add to card</button>
        </div>`;

      display.appendChild(div);
    }
  );
}

function getCartFromLocalStorage() {
  let cart = {};
  const data = localStorage.getItem('cart');
  if (data) {
    cart = JSON.parse(data);
  }
  return cart;
}

function addToCart(id) {
  const cart = getCartFromLocalStorage();
  const itemsArray = Object.keys(cart);
  const isExist = itemsArray.find(item => item === id);

  if (isExist) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
  }
  const totalItems = document.querySelector('.total_items');
  totalItems.innerHTML = itemsArray.length;

  localStorage.setItem('cart', JSON.stringify(cart));
}
