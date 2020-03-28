//bringing our DOM Elements

const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meals");

//Creating a search-meal Function /fetch from MealDB
function searchMeal(x) {
  x.preventDefault();
  //Clear Single Meal
  single_mealEl.innerHTML = "";

  //Get Search Term
  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`) //getting all the search data with Fetch
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p> There no Search Results, Try Again</p>`;
        } else {
          mealEl.innerHTML = data.meals
            .map(
              meal => `
          <div class='meal'>
          <img src='${meal.strMealThumb} 'alt${meal.strMeal}/>
          <div class='meal-info' data-mealID='${meal.idMeal}'>
          <h3>${meal.strMeal}</h3>
         
          </div>
          </div>
          
          `
            )
            .join("");
        }
      });
    //Clear Search text
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// We want to fetch The Meal By Id Through the API
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`) //getting all the search data with Fetch
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//Fetch Random Meals from API
function getRandomMeal(RanMeal) {
  //Clear meals and Headings
  mealEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`) //getting all the data with Fetch
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Add Meal to the DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
  
  <h1>${meal.strMeal}</h1>
  
  <img src='${meal.strMealThumb} 'alt${meal.strMeal} />
  
  <div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}

${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
</div>
<div class='main'>
<p>${meal.strInstructions}</p>

<h2>Ingredients</h2>
<ul>
${ingredients.map(ing => `<li>${ing}</li>`).join("")}
</ul>
</div>

${
  meal.strYoutube
    ? `<p><a href="${meal.strYoutube}" target="_blank">${meal.strYoutube}</a></p>`
    : ""
}
  
  </div>`;
}

//Add EventListeners

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealEl.addEventListener("click", x => {
  const mealInfo = x.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    // console.log(mealID);
    getMealById(mealID);
  }
});
