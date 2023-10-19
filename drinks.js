
// #region JSON 

// Load JSON data from a file using fetch
let available_ingredients;

async function fetchAndStoreIngredients() {
    try {
        available_ingredients = await fetchIngredients();
        console.log(available_ingredients)
    } catch (error) {
        console.error(error);
    }
}
  
function fetchIngredients() {
    return fetch('https://raw.githubusercontent.com/Bumes/Drinks/main/available-ingredients.json?v=' + new Date().getTime())
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        });
}

// #endregion



function Drink(category, name, picture, ingredients=[], garnish="") {
    if (ingredients.length != 0){
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i];
            formatted_ingredient = ingredient.toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_').replace(/[()]/g, '')
            if (!available_ingredients[formatted_ingredient]){
                doreturn = true
                if (formatted_ingredient == "lime" && available_ingredients["lime_juice"]) { 
                    ingredients[i] = ingredient.replace("½", ".5").replace("¼", ".25").replace("Lime", "")*30+"ml Lime Juice"; 
                    doreturn = false
                }
                else if (formatted_ingredient == "mint"){
                    ingredients[i] = "NO MINT LEAVES"
                    doreturn = false
                }
                else if (formatted_ingredient == "coca_cola" && available_ingredients["soda_stream_cola"]){
                    ingredients[i] = ingredient.replace("Coca Cola", "Cola (SodaStream)")
                    doreturn = false
                }
                if (doreturn){
                    console.log(ingredient.replace(/^\d*½?\s*\w+\s*/, '').replace(/[()]/g, '') + " is " + String(available_ingredients[formatted_ingredient]).replace("unavailable", "not defined in available-ingredients.json").replace("false", "not at home"))
                    return; 
                }
            }
        }
    }

    if (!available_ingredients[garnish.toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_')] && (garnish.split(' ').length<2)){
        console.log(garnish + " is missing for Garnish")
        garnish = "";
    }

    const drinks_menu = document.getElementById("drinks_menu");
    const coffee_menu = document.getElementById("coffee_menu");

    // Create a drink container
    const drinkDiv = document.createElement("div");
    drinkDiv.classList.add("drink");

    const horizontal = window.innerHeight < window.innerWidth ? "-horizontal" : "-portrait";

    // Populate the drink container
    drinkDiv.innerHTML = `
        <style>
            h2 {
                color: white;
                padding-left: 20px;
            }
            ul {
                color: white;
                font-size: 20px;
            }
            p1 {
                color: white;
                padding-left: 10px;
                font-weight: bold;
                font-size: 24px;
            }
            p2 {
                color: white;
                font-size: 24px;
            }

            img {
                border: 2px solid #659165;
            }

            .image-container {
                padding-bottom: 20px;
            }

            .image-area-horizontal {
                display: grid;
                align-items: center; 
                grid-template-columns: 1fr 1fr 1fr;
                column-gap: 5px;
            }
        </style>

        <h1>${name}</h2>

        <div class="image-area${horizontal}">

            <div class="image-container">
                <img src="pictures/${picture}" alt="Drink Image">
            </div>

            ${ingredients.length != 0 ? `
            <div class="ingredients${horizontal}">
                <p1>Ingredients:</p1>
                <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                
                ${garnish ? `<p1>Garnish: </p1><p2>${garnish}</p2>` : ''}

            </div>` : ''}
        </div>
    `;

    // Add the drink to the drinks-menu 
    if (category == 0){
        drinks_menu.appendChild(drinkDiv);
    } else if (category == 1) {
        coffee_menu.appendChild(drinkDiv);
    }
}

function Cocktail(name, picture, ingredients, garnish) {
    Drink(0, name, picture, ingredients, garnish)
}

function Coffee(name, picture, ingredients, garnish) {
    Drink(1, name, picture, ingredients, garnish)
}

async function start() {
    await fetchAndStoreIngredients();

    Cocktail("Edelstoff", "edelstoff.png")
    Cocktail("Mojito", "mojito.jpg", ["60ml White Rum", "15g Brown Sugar", "½ Lime", "Mint", "Sparkling Water"], "Mint");
    Cocktail("Cuba Libre", "cuba-libre.png", ["60ml Brown Rum", "½ Lime", "Coca Cola"], "Lime");
    Cocktail("Aperol Spritz", "aperol-spritz.png", ["60ml Secco", "30ml Aperol", "Sparkling Water"], "Orange")
    Cocktail("Hugo", "hugo.png", ["60ml Secco", "¼ Lime", "15ml Elderflower sirup", "Sparkling Water"], "Mint")
    Cocktail("Martini", "martini.jpg", ["60ml Gin", "15ml Dry Vermouth"], "Lemon Twist or Olives");
    Cocktail("Vodka Martini", "martini.jpg", ["60ml Vodka", "15ml Dry Vermouth"], "Lemon Twist or Olives");
    
    Coffee("Espresso", "espresso.png", ["30ml Espresso", "(Brown Sugar)"], "Amaretti")
}

start()