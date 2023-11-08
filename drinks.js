
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

missing = new Set()

function Drink(category, name, ingredients=[], garnish="") {
    if (ingredients.length != 0){
        garnish = garnish.split("//")[0]
        for (let i = 0; i < ingredients.length; i++) {
            doreturn = true;
            let ingredient = ingredients[i];
            current_ingredients = ingredient.split(" -> ")
            let j
            for (j=0; j < current_ingredients.length; j++) {
                formatted_ingredient = current_ingredients[j].toLowerCase().split(" // ")[0].split("// ")[0].split(" //")[0].split("//")[0].replace("double ", "").replace("steamed", "").replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_').replace(/[()]/g, '')
                if (available_ingredients[formatted_ingredient]) {
                    doreturn = false
                    break
                } else if (formatted_ingredient == ""){
                    j = j-1
                    ingredients[i] = "Missing: " + current_ingredients[j]
                    doreturn = false
                    break
                }
            }


// categories: sweet, sour, tart, fruity, fresh, boozy
// Missing with what

/* 
blended rum -> white rum <-> brown rum
*** Gin -> Gin
egg white -> egg
lemon/lime juice -> lemon/lime
Pineapple leave -> pineapple
vodka citron -> vodka + lemon
x Dashes -> 
x tsp ->
*/
            
            if (doreturn){
                // wrong
                text=ingredient.replace(/^\d*½?\s*\w+\s*/, '').replace(/[()]/g, '') + " (" + formatted_ingredient + ") is " + String(available_ingredients[formatted_ingredient]).replace("unavailable", "not defined in available-ingredients.json").replace("false", "not at home")
                if (!missing.has(text)) {
                    missing.add(text)
                }
                return; 
            } else {
                ingredients[i] = ingredients[i].split("//")[0].replace("  ", " ").split(" -> ")[j]
            }
        }
    }

    if (!available_ingredients[garnish.toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_')] && (garnish.split(' ').length<2)){
        if (garnish != ""){
            console.log(garnish + " is missing for Garnish")
            garnish = "";
        }
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
                <img src="pictures/${name.toLowerCase().replace(" ", "-")+".png"}" alt="${name + " Picture"}">
            </div>

            ${ingredients.length != 0 ? `
            <div class="ingredients${horizontal}">
                <p1>Ingredients:</p1>
                <ul>
                ${ingredients.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
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

function Cocktail(name, ingredients, garnish) {
    Drink(0, name, ingredients, garnish)
}

function Coffee(name, ingredients, garnish) {
    Drink(1, name, ingredients, garnish)
}



async function start() {
    await fetchAndStoreIngredients();

    Cocktail("Edelstoff")
    Cocktail("Secco")
    Cocktail("Mimosa", ["Secco", "Orange Juice"])
    Cocktail("Mojito", ["60ml White Rum", "15g Brown Sugar", "½ Lime -> 15ml Lime Juice", "Mint -> ", "Sparkling Water"], "Mint");
    Cocktail("Cuba Libre", ["60ml Brown Rum -> 60ml White Rum", "½ Lime -> 15ml Lime Juice", "Coca Cola -> Soda Stream Cola"], "Lime");
    Cocktail("Aperol Spritz", ["60ml Secco", "30ml Aperol", "Sparkling Water"], "Orange")
    Cocktail("Hugo", ["60ml Secco", "¼ Lime -> 10ml Lime Juice", "15ml Elderflower sirup", "Sparkling Water"], "Mint")
    Cocktail("Martini",["60ml Gin", "15ml Dry Vermouth -> 15ml Sweet Vermouth -> 15ml Lillet"], "Lemon Twist or Olives");
    Cocktail("Vodka Martini", ["60ml Vodka", "15ml Dry Vermouth -> 15ml Sweet Vermouth -> 15ml Lillet"], "Lemon Twist or Olives");
    Cocktail("Espresso Martini", ["Double Espresso", "30ml Coffee Liqueur", "15ml Vodka"], "Coffee Beans")
    
    Cocktail("Negroni", ["30ml Gin", "30ml Sweet Vermouth", "30ml Campari -> 30ml Aperol"], "Orange")
    Cocktail("Margarita", ["50ml Silver Tequila", "30ml Triple Sec", "30ml Lime Juice"], "Orange")
    Cocktail("Daiquiri", ["60ml White Rum -> 60ml Brown Rum", "30ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar"], "Lime")
    Cocktail("Penicillin", ["60ml Whiskey // (Scotch)", "30ml Lemon Juice -> 30ml Lime Juice", "30ml Honey Sirup -> 15ml Honey -> 30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "Ginger"], "candied ginger")
    Cocktail("Moscow Mule", ["60ml Vodka", "90ml Ginger Beer -> 90ml Ginger Ale", "½ Lime -> 15ml Lime Juice"], "Lime")
    Cocktail("Pisco Sour", ["60ml Pisco", "30ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "(1 Egg White)"], "(Angostura Bitters)")
    Cocktail("Paloma", ["60ml Blanco Tequila", "30ml Lime Juice", "Grapefruit Soda", "Salt"], "Lime")
    Cocktail("French 75", ["30ml Gin", "½ Lemon -> ½ Lime -> 15ml Lemon Juice -> 15ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "90ml Secco"], "Lemon")
    Cocktail("The Last Word", ["30ml Gin", "30ml Chartreuse", "30ml Lime Juice"])
    Cocktail("Mai Tai", ["60ml Blended Rum -> 60ml Brown Rum -> 60ml White Rum", "30ml Lime Juice", "30ml Orgeat Sirup", "15ml Orange Liqueur", "Mint -> "], "Mint")
    Cocktail("Gimlet", ["60ml London Dry Gin -> 60ml Gin", "30ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar"], "Lime")
    Cocktail("Clover Club", ["50ml Gin", "30ml Lemon Juice -> 30ml Lime Juice", "30ml Raspberry Sirup", "1 Egg White"])
    Cocktail("Amaretto Sour", ["50ml Amaretto", "30ml Lemon Juice -> 30ml Lime Juice", "15ml Simple Sirup -> 15g White Sugar -> 15g Brown Sugar", "1 Egg White"], "Cocktail Cherry and Angostura Bitters")
    Cocktail("Jungle Bird", ["50ml Brown Rum -> 50ml White Rum", "20ml Campari -> 20ml Aperol", "15ml Lime Juice", "15ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "50ml Pineapple Juice"])
    Cocktail("Gin Fizz", ["50ml Gin", "60ml Lemon Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "Sparkling Water"], "Lemon")
    Cocktail("Piña Colada", ["60ml White Rum", "60ml Coconut Cream", "60ml Pineapple Juice"], "Pineapple Leave")
    Cocktail("Corpse Reviver", ["30ml Gin", "30ml Triple Sec", "30ml Lemon Juice -> 30ml Lime Juice", "30ml Lillet -> 30ml Sweet Vermouth", "Absinthe"], "Lemon")
    Cocktail("Zombie", ["30ml White Rum", "30ml Brown Rum", "30ml Apricot Brandy", "15ml Falernum Liqueur", "30ml Lime Juice", "30ml Pineapple Juice", "10ml Grenadine"], "Pineapple and cocktail cherry")
    Cocktail("Bee's Knees", ["60ml Gin", "30ml Lemon Juice -> 30ml Lime Juice", "30ml Honey Sirup -> 15ml Honey -> 30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar"], "Lemon")
    Cocktail("Gin Basil Smash", ["60ml Gin", "30ml Lemon Juice -> 30ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "Basil"], "Basil")
    Cocktail("Vesper", ["60ml Gin", "30ml Vodka", "15ml Lillet -> 15ml Sweet Vermouth -> 15ml Dry Vermouth"], "Lemon and Orange")
    Cocktail("Cosmopolitan", ["50ml Vodka Citron -> 50ml Vodka // (with citron)", "30ml Cointreau", "30ml Lime Juice", "60ml Cranberry Juice"], "Lemon")
    Cocktail("Bramble", ["60ml Gin", "30ml Lemon Juice", "15ml Simple Sirup -> 15g White Sugar -> 15g Brown Sugar", "15ml Crème de mûre"], "Lemon and blackberries")
    Cocktail("Old Cuban", ["50ml Brown Rum -> 50ml Blended Rum -> 50ml White Rum", "30ml Lime Juice", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "60ml Secco", "Mint", "2 Dashes Angostura Bitters"], "Mint")
    Cocktail("Caipirinha", ["60ml Pitu", "1 Lime", "10g White Sugar -> 10ml Simple Sirup -> 10g Brown Sugar"])
    Cocktail("Southside", ["60ml Gin", "30ml Simple Sirup -> 30g White Sugar -> 30g Brown Sugar", "30ml Lime Juice", "Mint"], "Mint")
    Cocktail("2sian", ["30ml Coffee Sirup", "30ml Vodka", "15ml Cream -> 15ml Milk"])
    
    Coffee("Espresso", ["Double Espresso", "(Brown Sugar)"], "Amaretti")
    Coffee("Espresso Macchiato", ["Double Espresso", "Steamed Milk", "(Brown Sugar)"], "Amaretti")
    Coffee("Cappuccino", ["Double Espresso", "Milk // (Hot)", "Steamed Milk", "(Brown Sugar)"])
    Coffee("Latte Macchiato", ["Double Espresso", "Steamed Milk", "(Brown Sugar)"])
    Coffee("Chococino", ["Double Espresso", "Chocolate Powder", "Steamed Milk"])
    Coffee("Hot Chocolate", ["Chocolate Powder", "(Steamed) Milk"], "Chocolate Powder")
    Coffee("Dalgona Coffee", ["Double Espresso", "Brown Sugar", "Milk"])

    console.log(missing)
}

start()


/*if (!available_ingredients[formatted_ingredient]){
                doreturn = true
                if (formatted_ingredient == "lime" && available_ingredients["lime_juice"]) { 
                    ingredients[i] = ingredient.replace("½", ".5").replace("¼", ".25").replace("Lime", "")*30+"ml Lime Juice"; 
                    doreturn = false
                }
                else if (formatted_ingredient == "lemon") {
                    if (available_ingredients["Lemon Juice"]){
                        ingredients[i] = ingredient.replace("½", ".5").replace("¼", ".25").replace("Lemon", "")*30+"ml Lemon Juice"; 
                        doreturn = false
                    } else if (available_ingredients["lime"]){
                        ingredients[i] = ingredient.replace("Lemon", "Lime")
                        doreturn = false
                    } else if (available_ingredients["lime_juice"]) { 
                        ingredients[i] = ingredient.replace("½", ".5").replace("¼", ".25").replace("Lime", "")*30+"ml Lime Juice"; 
                        doreturn = false
                    }
                }
                else if ((formatted_ingredient == "simple_sirup" || formatted_ingredient == "brown_sugar") && available_ingredients["white_sugar"]) {
                    ingredients[i] = ingredient.replace("ml", "g").replace("Simple Sirup", "White Sugar").replace("Brown", "White");
                    doreturn = false;
                }
                else if (formatted_ingredient == "scotch" && available_ingredients["whiskey"]) {
                    ingredients[i] = ingredient.replace("Scotch", "Whiskey")
                    doreturn = false;
                }
                else if (formatted_ingredient == "honey_sirup") {
                    if (available_ingredients["honey"]) {
                        ingredients[i] = ingredient.split("ml")[0]/2 + "ml Honey";
                        doreturn = false;
                    } else if (available_ingredients["simple_sirup"]) {
                        ingredients[i] = ingredient.replace("Honey Sirup", "Simple Sirup");
                        doreturn = false;
                    } else if (available_ingredients["white_sugar"]) {
                        ingredients[i] = ingredient.replace("ml", "g").replace("Honey Sirup", "White Sugar");
                        doreturn = false;
                    }
                }
                else if (formatted_ingredient == "blanco_tequila" && available_ingredients["silver_tequila"]){
                    ingredients[i] = ingredient.replace("Blanco Tequila", "Silver Tequila");
                    doreturn = false;
                }
                else if ((formatted_ingredient == "sweet_vermouth" || formatted_ingredient == "dry_vermouth") && available_ingredients["lillet"]) {
                    ingredient = ingredient.split(" ")[0] + " Lillet"
                    doreturn = false;
                }
                else if (formatted_ingredient == "mint"){
                    ingredients[i] = "NO MINT LEAVES"
                    doreturn = false
                }
                else if (formatted_ingredient == "coca_cola" && available_ingredients["soda_stream_cola"]){
                    ingredients[i] = ingredient.replace("Coca Cola", "Cola (SodaStream)")
                    doreturn = false
                }*/