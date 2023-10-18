function Drink(name, picture, ingredients, garnish) {
    const menu = document.getElementById("menu");

    // Create a drink container
    const drinkDiv = document.createElement("div");
    drinkDiv.classList.add("drink");

    // Populate the drink container
    drinkDiv.innerHTML = `
        <style>
            h2 {
                color: white;
                padding-left: 20px;
            }
            ul {
                color: white;
            }
            p1 {
                color: white;
                padding-left: 10px;
            }
            p2 {
                color: white;
                padding-left: 10px;
            }

            img {
                border: 2px solid #659165;
            }

            .image-container {
                padding-bottom: 20px;
            }
        </style>

        <h1>${name}</h2>

        <div class="image-container">
            <img src="pictures/${picture}" alt="Drink Image">
        </div>

        <p1>Ingredients:</p1>
        <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>

        <p2>Garnish: ${garnish}</p2>
    `;

    // Add the drink to the menu 
    menu.appendChild(drinkDiv);
}


Drink("Mojito", "mojito.jpg", ["60ml White Rum", "15ml Simple Syrup", "1/2 Lime", "Fresh Mint Leaves", "Sparkling Water"], "Mint Leaves");
Drink("Cuba Libre", "cuba-libre.png", ["60ml Brown Rum", "30ml Lime Juice", "CocaCola"], "Lime");
Drink("Martini", "martini.jpg", ["2oz Gin or Vodka", "0.5oz Dry Vermouth"], "Lemon Twist or Olives");
  