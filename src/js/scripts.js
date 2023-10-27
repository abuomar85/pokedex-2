//creating the app using IIFE
let pokemonRepository = (function () {
    // create the pokeomnList
    let pokemonList = [];
  
    let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  
    // get all pokemons
    function getAll() {
      return pokemonList;
    }
    //  add pokemon if it is an object and has a name 
    function add(pokemon) {
      if (typeof pokemon === "object" && "name" in pokemon) {
        return pokemonList.push(pokemon);
      } else {
        return document.write("<p> not an object</p>");
      }
    }
  
    //listen to the events and log the pokemon name when the button is clicked
    function showDetails(button, pokemon) {
      button.addEventListener("click", function () {
        loadDetails(pokemon).then(function () {
          showModal(pokemon);
        });
      });
    }
  
    //add modal using Bootstrap
    function showModal(pokemon) {
      let modalBody = $(".modal-body");
      let modalTitle = $(".modal-title");
      modalTitle.empty();
      modalBody.empty();
      //looping through types and abilities
      pokemonRepository.loadDetails(pokemon).then(function () {
        let pokemonTypes = "";
        pokemon.types.forEach(function (t) {
          pokemonTypes = t.type.name + ", " + pokemonTypes;
        });
  
        let pokemonAbilities = "";
        pokemon.abilities.forEach(function (a) {
          pokemonAbilities = a.ability.name + ", " + pokemonAbilities;
        });
  
        // show the elements inside the modal
        let typesElement = $("<p>" + "types : " + pokemonTypes + "</p>");
        let abilitiesElement = $(
          "<p>" + "abilities : " + pokemonAbilities + "</p>"
        );
        modalBody.append(typesElement);
        modalBody.append(abilitiesElement);
      });
  
      // add the modal elements
      let nameElement = $("<h1>" + pokemon.name + "</h1>");
      let imageElementFront = $('<img class="modal-img" style="width:50%">');
      imageElementFront.attr("src", pokemon.imageUrlFront);
      let imageElementBack = $('<img class="modal-img" style="width:50%">');
      imageElementBack.attr("src", pokemon.imageUrlBack);
      let heighElement = $("<p>" + "height : " + pokemon.height + "</p>");
      let weightElement = $("<p>" + "weight : " + pokemon.weight + "</p>");
      modalTitle.append(nameElement);
      modalBody.append(imageElementFront);
      modalBody.append(imageElementBack);
      modalBody.append(heighElement);
      modalBody.append(weightElement);
    }
  
    // make a list of pokemon inside ul
    function addListItem(pokemon) {
      let pokemonList = document.querySelector(".pokemon-list");
      let listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      pokemonList.appendChild(listItem);
  
      let button = document.createElement("button");
      button.classList.add(
        "pokemon-button",   
        "custom-button"
      );
      button.innerText = pokemon.name; // Set the button text to the Pokemon's name
      listItem.appendChild(button);
  
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", "#exampleModal");
  
      button.addEventListener("click", function () {
        showModal(pokemon);
      });
      showDetails(button, pokemon);
    }
  
    // load the pokemon list from the API
  
    function loadList() {
      return fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);

          });
        })
        .catch(function () {
        });
    }
  
    // load the pokemon details
    function loadDetails(item) {
      let url = item.detailsUrl;
      return fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (details) {
          // add the details to the item
          item.imageUrlFront = details.sprites.front_default;
          item.imageUrlBack = details.sprites.back_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = details.types;
          item.abilities = details.abilities;
        })
        .catch(function () {
          
        });
    }
  
    // filter the pokemons by the name
    const findPokemonByName = (name) => {
      return pokemonList.filter(
        (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
      );
    };
   // allow the user to search for a pokemon 
    function searchPokemon() {
      const searchInput = document.getElementById("searchInput");
      const searchText = searchInput.value.toLowerCase();
      const pokemonList = pokemonRepository.getAll();
      const filteredPokemon = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchText)
      );
  
      // Clear the current list
      const pokemonListContainer = document.querySelector(".pokemon-list");
      pokemonListContainer.innerHTML = "";
  
      // Display the filtered results
      filteredPokemon.forEach((pokemon) => {
        addListItem(pokemon);
      });
    }
  
    // Attach the search function to the input field's change event
    document
      .getElementById("searchInput")
      .addEventListener("input", searchPokemon);
  
    return {
      add: add,
      getAll: getAll,
      findPokemonByName: findPokemonByName,
      addListItem: addListItem,
      showDetails: showDetails,
      loadList: loadList,
      loadDetails: loadDetails,
      showModal: showModal,
      searchPokemon: searchPokemon
    };
  })();
  
  // looping throug the Repository 
  pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
  