const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');

const fs = require('fs');
const { JSDOM } = require('jsdom');



function update_language(userLanguage) {
    userLanguage = userLanguage.split("-")[0]
    console.log("Set Language to:")
    console.log(userLanguage)
    fetchAndStoreLanguages()
        .then(languages => {
            // languages will now contain the actual data after successful fetch
            if (!languages.hasOwnProperty(userLanguage)) {
                userLanguage = "en"
            }
            language = languages[userLanguage];
            for (const key in language) {
                if (typeof(language[key]) != "object") {
                    const elements = document.querySelectorAll(`#${key}`); // Use querySelectorAll to get all elements

                    if (elements.length > 0) {
                        for (const element of elements) {
                            element.textContent = language[key];
                        }
                    } else {
                        console.info(`Element with ID "${key}" not found.`);
                    }
                }
            }
        })
        .catch(error => console.error(error));  // Handle errors from fetchLanguages
}

let document;

// Read the master.html file

fs.readFile('master.html', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Create a new DOM environment
  const dom = new JSDOM(data);

  // Extract document object
  document = dom.window.document;

  // Get the modified HTML
  const modifiedHtml = dom.serialize();

  // Write the modified HTML back to the master.html file
  fs.writeFile('master.html', modifiedHtml, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('master.html file updated successfully.');
  });

  // Call update_language here to ensure it runs after the document is updated
  update_language("en");
});



app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json());

let lastOrder = '';

// Endpoint to receive data from client
app.post('/master', (req, res) => {
    lastOrder = req.body;
    console.log('Received data:', lastOrder);
    add_drink(lastOrder["formatted_name"])
    // Emit an event to indicate that a new order has been received
    res.sendStatus(200);
});

// Endpoint to serve HTML page with last order
app.get('/', (req, res) => {
    // Assuming you have a master.html file in the same directory
    res.sendFile(__dirname + '/master.html');
});

app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// #region Drink Creation

// #region JSON 
let available_ingredients;
let drinks;
let queue_drinks = [];
let current_frame = "drinks"

json_url = 'https://raw.githubusercontent.com/Bumes/Drinks/main/available-ingredients.json?v='
drinks_url = 'https://raw.githubusercontent.com/Bumes/Drinks/main/drinks.json?v='
picture_folder = 'pictures/'

async function fetchAndStoreIngredients() {
    try {
        available_ingredients = await fetchIngredients();
    } catch (error) {
        console.error(error);
    }
}

function fetchIngredients() {
    return fetch(json_url + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

async function fetchAndStoreDrinks() {
    try {
        drinks = await fetchDrinks()
        console.log("Loaded all drinks")
    } catch (error) {
        console.error(error);
    }
}

function fetchDrinks() {
    return fetch(drinks_url + new Date().getTime())
        .then(response => response.json())
}


// #endregion



let missing = new Set()
let saved_html = ""


function sortIngredients(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (parseInt(arr[i][1]) > parseInt(pivot[1])) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [
        ...sortIngredients(left),
        pivot,
        ...sortIngredients(right),
    ];
}

function format(text) {
    return text.toLowerCase().split(" // ")[0].split("// ")[0].split(" //")[0].split("//")[0].replace("double ", "").replace("steamed", "").replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_').replace(/[()]/g, '')
}


drinks_added_flavor_profiles = []
mocktails_added_flavor_profiles = []
shots_added_flavor_profiles = []
coffee_added_flavor_profiles = []

drinks_added_base_spirits = []

function Drink({ category = "Cocktails", name = "No Name given", ingredients = [], options = [], garnishes = [], base_spirit = "Other", flavor_profile = [] }) {
    console.log("Drink:")
    if (category != "Cocktails") console.log(`Category: ${category}`);
    if (name != "No Name given") console.log(`Name: ${name}`);
    if (ingredients != []) console.log(`Ingredients: ${ingredients.join(", ")}`);
    if (options != []) console.log(`Options: ${options.join(", ")}`);
    if (garnishes != []) console.log(`Garnishes: ${garnishes.join(", ")}`);
    if (base_spirit != "") console.log(`Base Spirit: ${base_spirit}`);
    if (flavor_profile != []) console.log(`Flavor Profile: ${flavor_profile.join(", ")}`);

    every_ingredient = true;
    let language_name = ""

    if (ingredients.length > 0) {
        for (let g = 0; g < garnishes.length; g++) {
            garnishes[g] = garnishes[g].split("//")[0]
        }
        for (let i = 0; i < ingredients.length; i++) {
            doreturn = true;
            let ingredient = ingredients[i];
            let chosen_ingredient = ingredient
            current_ingredients = ingredient.split(" -> ")
            let j
            for (j = 0; j < current_ingredients.length; j++) {
                formatted_ingredient = format(current_ingredients[j])
                chosen_ingredient = current_ingredients[j]
                while (formatted_ingredient[0] == "_") {
                    formatted_ingredient = formatted_ingredient.substring(1, formatted_ingredient.length)
                }
                while (formatted_ingredient.slice(-1) == "_") {
                    formatted_ingredient = formatted_ingredient.substring(0, formatted_ingredient.length - 1)
                }
                if (available_ingredients[formatted_ingredient]) {
                    doreturn = false
                    break
                } else if (formatted_ingredient == "") {
                    j = j - 1
                    doreturn = false
                    ingredients[i] = "Missing: " + ingredient.split(" -> ")[0]
                    chosen_ingredient = "Missing: " + ingredient.split(" -> ")[0]
                    break
                }
            }


            if (doreturn) {
                every_ingredient = false
                if (missing[formatted_ingredient] == undefined) {
                    missing[formatted_ingredient] = [String(available_ingredients[formatted_ingredient]).replace("unavailable", "not defined in available-ingredients.json").replace("false", "not at home"), "in 1 recipe"]
                } else {
                    missing[formatted_ingredient][1] = missing[formatted_ingredient][1].replace(/\d+/, match => (parseInt(match) + 1).toString())
                }
                ingredient[i] = current_ingredients[0]
            } else {
                if (chosen_ingredient.search("Missing: ") != -1) {
                    temp = chosen_ingredient.replace("Missing: ", "").replace(/[\d½|\d¼]+(ml|g)? /, '')
                } else {
                    temp = chosen_ingredient.replace(/[\d½|\d¼]+(ml|g)? /, '')
                }
                language_ingredient = temp
                formatted_temp = format(temp)
                if (language["ingredients"].hasOwnProperty(formatted_temp)) {
                    language_ingredient = language["ingredients"][formatted_temp]
                }
                ingredients[i] = chosen_ingredient.replace(temp, language_ingredient)
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
    } else {
        every_ingredient = available_ingredients[format(name)]
        formatted_option = format(name)
        temp = name.replace(/[\d½|\d¼]+(ml|g)? /, '')
        language_name = temp
        if (language["ingredients"].hasOwnProperty(formatted_option)) {
            language_name = language["ingredients"][formatted_option]
        }
        language_name = name.replace(temp, language_name)
    }

    if (!(drinks_added_base_spirits.includes(base_spirit)) & base_spirit !== null) {
        drinks_added_base_spirits.push(base_spirit);
    }
    if (options.length > 0) {
        for (let o = 0; o < options.length; o++) {
            formatted_option = format(options[o])
            if (!available_ingredients[formatted_option]) {
                options.splice(o, 1)
                o--
            } else {
                temp = options[o].replace(/[\d½|\d¼]+(ml|g)? /, '')
                language_option = temp
                if (language["ingredients"].hasOwnProperty(formatted_option)) {
                    language_option = language["ingredients"][formatted_option]
                }
                options[o] = options[o].replace(temp, language_option)
            }
        }
        if (every_ingredient === false && ingredients.length == 0) {
            every_ingredient = options.length > 0
        }
    }

    ingredients = sortIngredients(ingredients);

    for (let g = 0; g < garnishes.length; g++) {
        formatted_garnish = format(garnishes[g])
        /*if (formatted_garnish.search("_or_") != -1) {
            formatted_garnishes = formatted_garnish.split("_or_")
            for (let f = 0; f < formatted_garnishes.length; f++) {
                if (available_ingredients.hasOwnProperty(formatted_garnishes[f])) {
                    if (!available_ingredients[formatted_garnishes[f]]) {
                        //if (!available_ingredients[garnishes[g].toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_')] && (garnishes[g].split(' ').length<2)){
                        console.log(garnishes[g] + " is missing for Garnish")
                    }
                }
                garnishes.splice(g, 0, garnishes[g].split(" or ")[f])
            }
        }
        else{*/
        if (available_ingredients.hasOwnProperty(formatted_garnish)) {
            if (!available_ingredients[formatted_garnish]) {
                //if (!available_ingredients[garnishes[g].toLowerCase().replace(/[\d½|\d¼]+(ml|g)? /, '').replace(/ /g, '_')] && (garnishes[g].split(' ').length<2)){
                // console.log(garnishes[g] + " is missing for Garnish")
                garnishes.splice(g, 1)
                g--
            }
        }
        //}
    }

    const drinks_menu = document.getElementById("drinks_menu");

    // Create a drink container
    const drinkDiv = document.createElement("div");
    drinkDiv.classList.add("drink");

    const horizontal = global.innerHeight < global.innerWidth ? "-horizontal" : "-portrait";


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
                grid-template-columns: 1fr 1fr;
                column-gap: 5px;
            }
        </style>

        <h1 class="image-header${!every_ingredient ? '-missing' : ''}">${language_name == "" ? name : language_name}</h2>

        <div class="image-area${horizontal}">

            <div class="image-container">
                <img src="${picture_folder}${name.toLowerCase().replace(/ *\([^)]*\)/g, "").trim().replace(/\s+$/g, "").split(' ').join('-').split("'").join('') + ".png"}" alt="${name + " Picture"}">
            </div>

            ${flavor_profile.length > 0 || ingredients.length > 0 || options.length > 0 ? `
            <div class="flavors_and_ingredients${horizontal}">
                ${flavor_profile.length != 0 ? `
                <div class="flavors${horizontal}">
                    <p1 id="flavors_text"></p1>
                    <ul>
                        ${flavor_profile.map(flavor => {
        let formatted_flavor = format(flavor);
        let temp = flavor.replace(/[\d½|\d¼]+(ml|g)? /, '');
        let language_flavor = temp;
        if (language["flavor_profile"].hasOwnProperty(formatted_flavor)) {
            language_flavor = language["flavor_profile"][formatted_flavor];
        }
        flavor = flavor.replace(temp, language_flavor);
        return `<li>${flavor.trim()}</li>`;
    }).join('')}
                    </ul>

                </div>` : ''}

                ${ingredients.length > 0 ? `
                <div class="ingredients${horizontal}">
                    <p1 id=ingredients_text></p1>
                    <ul>
                        ${ingredients.map(ingredient => `
                            <li class="${missing.hasOwnProperty(format(ingredient)) ? 'missing-ingredient' : ''}">
                                ${ingredient.trim()}
                            </li>`).join('')}
                    </ul>
                </div>`
                : ''}

                ${options.length > 0 ? `
                <div class="options${horizontal}">
                    <p1 id=options_text></p1>
                    <ul>
                    ${options.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
                    </ul>

                </div>` : ''}

                ${garnishes.length > 0 ? `
                <div class="garnishes${horizontal}">
                    <p1 id=garnishes_text></p1>
                    <ul>
                    ${garnishes.map(garnish => `<li>${garnish.trim()}</li>`).join('')}
                    </ul>

                </div>` : ''}
            </div>` : ''}
    `;

    // Add the drink to the correct menu 
    // if (horizontal == "-horizontal") {
    if (saved_html == "") {
        saved_html = drinkDiv
    } else {
        // Create a wrapper div to hold both saved_html and drinkDiv
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = 'flex'; // Use flex layout to display them side by side

        // Set flex property on saved_html to take up more space (adjust as needed)
        saved_html.style.flex = '2';
        drinkDiv.style.flex = '2';

        // Append both saved_html and drinkDiv to the wrapper
        wrapperDiv.appendChild(saved_html);
        wrapperDiv.appendChild(drinkDiv);

        drinks_menu.appendChild(wrapperDiv);

        // Clear saved_html
        saved_html = "";
    }
    /*} else {
        console.log("vertical")
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = 'flex'; // Use flex layout to display them side by side

        drinkDiv.style.flex = '1';

        // Append both saved_html and drinkDiv to the wrapper
        wrapperDiv.appendChild(drinkDiv);
        drinks_menu.appendChild(wrapperDiv);
    }*/
    if (saved_html == "") {
        console.log("SUCCESFULLY CREATED ROW")
    } else {
        console.log("SUCCESFULLY CREATED ELEMENT")
    }
}

function add_odd_element() {

    // Check if saved_html is not empty after all iterations
    if (saved_html !== "") {

        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.display = 'flex'; // Use flex layout to display them side by side
        wrapperDiv.style.width = '50%'; // Use flex layout to display them side by side

        // Set flex property on saved_html to take up more space (adjust as needed)
        saved_html.style.flex = '1';

        // Append both saved_html and drinkDiv to the wrapper
        wrapperDiv.appendChild(saved_html);

        drinks_menu = document.getElementById("drinks_menu");
        drinks_menu.appendChild(wrapperDiv);
        saved_html = ""
    }
}

function delete_all() {
    var header_elements = document.querySelectorAll('.image-header');
    header_elements.forEach(function (element) {
        element.remove();
    });
    var drink_area_elements = document.querySelectorAll('.drink');
    drink_area_elements.forEach(function (element) {
        element.remove();
    });
    var vertical_elements = document.querySelectorAll('.image-area');
    vertical_elements.forEach(function (element) {
        element.remove();
    });
    var horizontal_elements = document.querySelectorAll('.image-area-horizontal');
    horizontal_elements.forEach(function (element) {
        element.remove();
    });
}

function add_drink(formatted_name) {
    for (const cocktail of drinks.Cocktails) {
        if (format(cocktail.name) == formatted_name) {
            console.log("Adding " + cocktail.name + " as a Drink")
            queue_drinks.push(cocktail)
            create_all()
            break
        }
    }
}

function fetchLanguages() {
    return fetch("https://raw.githubusercontent.com/Bumes/Drinks/main/language.json?v=" + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

async function fetchAndStoreLanguages() {
    try {
        languages = await fetchLanguages()
        return languages
    } catch (error) {
        console.error(error);
    }
}

let language;

async function load() {
    await fetchAndStoreIngredients(); 
    await fetchAndStoreDrinks();
    update_language("en");
}

load()

function create_all() {
    queue_drinks.forEach(drink => {
        Drink(drink);
        console.log();
    });
    add_odd_element();
    console.log()
    console.log()
    console.log()

    console.log("TODO:")
    queue_drinks.forEach(drink => {
        console.log(drink.name);
    });
    console.log()
    console.log()
    console.log()
}

// create_all()

// #endregion
