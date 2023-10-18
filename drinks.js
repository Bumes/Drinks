function Drink(name, picture, ingredients, garnish) {
    const menu = document.getElementById("menu");

    // Create a drink container
    const drinkDiv = document.createElement("div");
    drinkDiv.classList.add("drink");

    const horizontal = window.innerHeight < window.innerWidth ? "-horizontal" : "-portrait";
    console.log("image-area"+horizontal)

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


Drink("Mojito", "mojito.jpg", ["60ml White Rum", "15ml Simple Syrup", "1/2 Lime", "Fresh Mint Leaves", "Sparkling Water"], "Mint Leaves");
Drink("Cuba Libre", "cuba-libre.png", ["60ml Brown Rum", "30ml Lime Juice", "CocaCola"], "Lime");
Drink("Martini", "martini.jpg", ["2oz Gin or Vodka", "0.5oz Dry Vermouth"], "Lemon Twist or Olives");
  