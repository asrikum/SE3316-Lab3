// Get the search button and input elements from the DOM
const searchButton = document.getElementById("submit");
const searchTermInput = document.getElementById("searchTerm");
const categorySelect = document.getElementById('category');
const herocontent = document.getElementById('results');
const displayvol = document.getElementById('displayvolume');
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

