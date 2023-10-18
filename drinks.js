
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
    return fetch('https://raw.githubusercontent.com/Bumes/Drinks/main/available-ingredients.json?v=' + Date().now())
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        });
}

// #endregion



function Drink(name, picture, ingredients, garnish) {
    
    for (let i = 0; i < ingredients.length; i++) {
        let ingredient = ingredients[i];
        formatted_ingredient = ingredient.toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_')
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
                console.log(formatted_ingredient + ": " + available_ingredients[formatted_ingredient])
                return; 
            }
        }
    }

    const menu = document.getElementById("menu");

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

            <div class="ingredients${horizontal}">
                <p1>Ingredients:</p1>
                <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>

                <p1>Garnish:</p1><p2> ${garnish}</p2>
            </div>
        </div>
    `;

    // Add the drink to the menu 
    menu.appendChild(drinkDiv);
}



async function start() {
    await fetchAndStoreIngredients();

    Drink("Mojito", "mojito.jpg", ["60ml White Rum", "15g Brown Sugar", "½ Lime", "Mint", "Sparkling Water"], "Mint Leaves");
    Drink("Cuba Libre", "cuba-libre.png", ["60ml Brown Rum", "½ Lime", "Coca Cola"], "Lime");
    Drink("Aperol Spritz", "aperol-spritz.png", ["60ml Secco", "30ml Aperol", "Sparkling Water"], "Orange")
    Drink("Hugo", "hugo.png", ["60ml Secco", "¼ Lime", "15ml Elderflower sirup", "Sparkling Water"], "Mint")
    Drink("Martini", "martini.jpg", ["60ml Gin", "15ml Dry Vermouth"], "Lemon Twist or Olives");
    Drink("Vodka Martini", "martini.jpg", ["60ml Vodka", "15ml Dry Vermouth"], "Lemon Twist or Olives");
      
}

start()