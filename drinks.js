
const avaible_ingredients= {
    "beer": true,

    "vodka": true,
    "gin": true,
    "white_rum": true,
    "brown_rum": true,

    "lillet": true,
    "aperol": true,
    "dry_vermouth": false,
    "secco": true,

    "sparkling_water": true,
    "wild_berry": true,
    "ginger_ale": true,
    "ginger_beer": false,
    "coca_cola": true,
    
    "lime": true,
    "lime_juice": true,
    "mint_leaves": true,
    "orange": false,
    "brown_sugar": true
};

/*function processJSON(data) {
    const available_ingredients = data;
}

fetch('available-ingredients.json')
    .then(response => response.json())
    .then(processJSON) // Call the function with the JSON data
    .catch(error => {
        console.error('Error reading the JSON file:', error);
    }
);*/

function Drink(name, picture, ingredients, garnish) {
    
    for (ingredient of ingredients) {
        formatted_ingredient = ingredient.toLowerCase().replace(/[\d½]+(ml|g)? /, '').replace(/ /g, '_')
        if (!avaible_ingredients[formatted_ingredient]){
            console.log(formatted_ingredient + ": " + avaible_ingredients[formatted_ingredient])
            return;
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


Drink("Mojito", "mojito.jpg", ["60ml White Rum", "15g Brown Sugar", "½ Lime", "Mint Leaves", "Sparkling Water"], "Mint Leaves");
Drink("Cuba Libre", "cuba-libre.png", ["60ml Brown Rum", "½ Lime", "Coca Cola"], "Lime");
Drink("Aperol Spritz", "aperol-spritz.png", ["60ml Secco", "30ml Aperol", "Sparkling Water"], "Orange")
Drink("Martini", "martini.jpg", ["60ml Gin", "15ml Dry Vermouth"], "Lemon Twist or Olives");
Drink("Vodka Martini", "martini.jpg", ["60ml Vodka", "15ml Dry Vermouth"], "Lemon Twist or Olives");
  