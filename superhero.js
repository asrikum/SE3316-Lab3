// Get the search button and input elements from the DOM
const searchButton = document.getElementById("submit");
const submitlistButton = document.getElementById("submitlist");
const searchTermInput = document.getElementById("searchTerm");
const categorySelect = document.getElementById('category');
const herocontent = document.getElementById('results');
const displayvol = document.getElementById('displayvolume');
const listName = document.getElementById('listName');
const superhero_ids = document.getElementById('ID');
const listresults = document.getElementById('list_results');
const listreturn = document.getElementById('Return');
const listreturnbutton = document.getElementById('submitreturn');
const fetchSuperhero = async () => {
    try{
const res = await fetch('/api/superheroes')
if(res.ok){
    const superheroes = await res.json();
    return superheroes;
}else{
    console.error('Failed to fetch data');
}
}catch{
    console.error('Error:', error);
}

};

function createSuperheroList(listName, superheroIds) {
    // First, create the list
    if (typeof superheroIds === 'string') {
        console.log('hi');
        superheroIds = superheroIds.split(',').map(id => id.trim()); // Assuming the IDs are separated by commas
    }

    const fetchList = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listName }) // Assuming the server expects an object with a key 'listName'
    };
//input Sanitization before fetching
    fetch('/api/lists', fetchList)
      .then(response => {
        if (!response.ok) {
            listresults.innerHTML='List Exists';
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON response into JavaScript object
      })
      .then(data => {
        listresults.innerHTML='List Created';
        console.log('List created:', data); // Handle the response data
  
        // Now, add superhero IDs to the list
        const fetchIDs = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({superheroIds}) // Assuming the server expects an object with a key 'superhero_ids'
        };
  console.log(JSON.stringify(superheroIds ));
//input Sanitization before fetching
        return fetch(`/api/lists/${listName}`, fetchIDs); // Adjust the endpoint as per your API
      })
      .then(response => {
        if (!response.ok) {  
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Superhero IDs added:', data); // Handle the response data
        // Fetch the updated list
      });
  }
  function getSuperheroList(listreturn) {
    console.log(`Fetching list: ${listreturn}`); // Debug log
    fetch(`/api/lists/${listreturn}`) // Adjust the endpoint as per your API
        .then(response => {
            if (!response.ok) {
                console.error('Fetch error:', response.statusText); // Debug log
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data); // Debug log
            const resultsContainer = document.getElementById('list_results');
            resultsContainer.innerHTML = ''; // Clear previous results

            // Check if data is an array before attempting to use forEach
            if (data.superheroes && Array.isArray(data.superheroes)) {
                data.superheroes.forEach(superhero => {
                    const div = document.createElement('div');
                    
                    // Update these fields to match the actual properties of your superhero objects
                    div.innerHTML = `ID: ${superhero.id}, Name: ${superhero.name}, Gender: ${superhero.gender}, Eye Color: ${superhero.Eye_Color}, Race: ${superhero.race}, Hair: ${superhero.Hair}, Height: ${superhero.Height}, Publisher: ${superhero.Publisher}, Skin: ${superhero.Skin}, Alignment: ${superhero.Alignment}, Weight: ${superhero.Weight}, Powers: ${superhero.powers.join(', ')}`;
                    resultsContainer.appendChild(div);
                });
            } else {
                // Handle non-array data here
                console.error('Data received is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Define the function that will handle the search
function searchSuperheroes(searchTerm, category, displayvolume, searchpower) {
    console.log(`api/superheroes/search?field=${category}&pattern=${searchTerm}&n=${displayvolume}`)
    if(category == 'power'){
        console.log(`api/superheroes/search/power?power=${searchpower}&n=${displayvolume}`);
        fetch(`api/superheroes/search/power?power=${searchpower}&n=${displayvolume}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Clear previous results
            data.forEach(data => {
              const div = document.createElement('div');
              // Update these fields to match the actual properties of your superhero objects
              div.textContent = `Name: ${data}`;
              resultsContainer.appendChild(div);
              
            });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    else{
  fetch(`api/superheroes/search?field=${category}&pattern=${searchTerm}&n=${displayvolume}`)
    .then(response => response.json())
    .then(data => {
      displayResults(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
}

// Define the function that will display the results
function displayResults(superheroes) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results
  superheroes.forEach(hero => {
    const div = document.createElement('div');
    // Update these fields to match the actual properties of your superhero objects
    div.textContent = `Name: ${hero.name}`;
    resultsContainer.appendChild(div);
  });
}



// Add an event listener to the search button
searchButton.addEventListener("click", () => {
  // Get the current value of the input and select elements
  const displayn = displayvol.value.toLowerCase();
  const searchTerm = searchTermInput.value.toLowerCase();
  const searchpower = searchTermInput.value;
  const category = categorySelect.value;
  const displayvolume = parseInt(displayn);

  console.log(searchTerm, category, displayvolume, searchpower); // Log the search term and category for debugging

  // Call the search function with the current search term and category
  searchSuperheroes(searchTerm, category, displayvolume, searchpower);
});
submitlistButton.addEventListener("click", () => {
  const listVal = listName.value;
  const ids = superhero_ids.value.split(',').map(id => parseInt(id.trim(), 10)); // Convert string of IDs into an array of numbers
  createSuperheroList(listVal, ids);
  console.log(ids)
});
listreturnbutton.addEventListener("click", () => {
  const listreturnsi = listreturn.value;
  getSuperheroList(listreturnsi);
});


