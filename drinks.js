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
            }
            p2 {
                color: white;
            }

            img {
                border: 2px solid #659165;
            }

            .image-container {
                padding-bottom: 20px;
            }
    
            .image-container img {
                max-width: 50%;
                min-width: 50%;
                height: auto;
            }
        </style>

        <h1>${name}</h2>

        <div class="image-container">
            <img src="${picture}" alt="Drink Image">
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


Drink("Mojito", "mojito.jpg", ["1.5oz White Rum", "0.5oz Simple Syrup", "0.75oz Lime Juice", "6-8 Fresh Mint Leaves", "Soda Water"], "Mint Leaves");
Drink("Martini", "martini.jpg", ["2oz Gin or Vodka", "0.5oz Dry Vermouth"], "Lemon Twist or Olives");
  