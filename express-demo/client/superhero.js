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
const categoryorder = document.getElementById('Category Order');
const listorder = document.getElementById('List Order');
const list_objective= document.getElementById('List Objective');
const attributeSelect = document.getElementById('Attributes');
const showpublishers = document.getElementById('submitpublishers');
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
            herocontent.innerHTML='List Exists';
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON response into JavaScript object
      })
      .then(data => {
        herocontent.innerHTML='List Created';
        console.log('List created:', data); // Handle the response data
  
        // Now, add superhero IDs to the list
        const fetchIDs = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({superheroIds}) // Assuming the server expects an object with a key 'superhero_ids'
        };
  console.log(JSON.stringify(superheroIds ));
//input Sanitization before fetching
const encodedlistName = encodeURIComponent(listName);
        return fetch(`/api/lists/${encodedlistName}`, fetchIDs); // Adjust the endpoint as per your API
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
  function getSuperheroList(listreturn, listsorter, attributeorder, list_obj) {
    console.log(list_obj)
    if(list_obj=="GetList"){
    console.log(`Fetching list: ${listreturn}`); 
    // Debug log
    const encodedreturn = encodeURIComponent(listreturn);
    fetch(`/api/lists/${encodedreturn}`) // Adjust the endpoint as per your API
        .then(response => {
            if (!response.ok) {
                console.error('Fetch error:', response.statusText); // Debug log
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
    
        .then(data => {
            console.log('Received data:', data); // Debug log
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Clear previous results
            const sortOrderMultiplier = listsorter === 'ascending' ? 1 : -1;
console.log(attributeorder);
            // Check if data is an array before attempting to use forEach
            if (data.superheroes && Array.isArray(data.superheroes)) {
                if(attributeorder == 'power'){
                    data.superheroes.sort((a, b) => {
                        const powersA = Array.isArray(a.powers) ? a.powers.length : 0;
                        const powersB = Array.isArray(b.powers) ? b.powers.length : 0;
                        return (powersA - powersB) * sortOrderMultiplier;
                    });
                }
                else{
                data.superheroes.sort((a, b) => {
                    if(listsorter==='ascending'){
                    if (a[attributeorder] < b[attributeorder]) {
                        console.log(a[attributeorder]);
                      return listsorter === 'ascending' ? -1 : 1;
                    }
                    if (a[attributeorder] > b[attributeorder]) {
                        console.log(a[attributeorder]);
                      return listsorter === 'ascending' ? 1 : -1;
                      
                    }
                }
                else{
                    if (a[attributeorder] < b[attributeorder]) {
                        return listsorter === 'descending' ? 1 : -1;
                      }
                      if (a[attributeorder] > b[attributeorder]) {
                        return listsorter === 'descending' ? -1 : 1;
                      }
                    }
                    return 0;
                  });
                }
                data.superheroes.forEach(superhero => {
                    const div = document.createElement('div');
                    // Update these fields to match the actual properties of your superhero objects
                    div.innerHTML = `ID: ${superhero.id}, Name: ${superhero.name}, Gender: ${superhero.gender}, Eye Color: ${superhero.Eye_Color}, Race: ${superhero.race}, Hair: ${superhero.Hair}, Height: ${superhero.Height}, Publisher: ${superhero.Publisher}, Skin: ${superhero.Skin}, Alignment: ${superhero.Alignment}, Weight: ${superhero.Weight}, Powers: ${superhero.powers.join(', ')}`;
                    resultsContainer.appendChild(div);
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
      else{
        const fetchList = {
          method: 'DELETE',
         };
    //input Sanitization before fetching
const encodedreturn = encodeURIComponent(listreturn);
        fetch(`/api/lists/${encodedreturn}`, fetchList)
        .then(response => {
          if (!response.ok) {
            // If the server response was not ok, throw an error with the status text
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          // Try to parse the response as JSON, but handle cases where it's not JSON
          return response.text().then(text => {
            try {
              const resultsContainer = document.getElementById('results');
              resultsContainer.innerHTML = 'List deleted successfully';
              // Try to parse text as JSON
              return JSON.parse(text);
            } catch {
              // If it's not JSON, just return the text
              return text;
            }
          });
        })
        .then(data => {
          // Handle the data (which could be an object if JSON, or a string if not)
        
          console.log('Delete response:', data);
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          console.error('Fetch error:', error);
        });
}
  }



// Define the function that will handle the search
function searchSuperheroes(searchTerm, category, displayvolume, searchpower, categoryorder) {
    console.log(`api/superheroes/search?field=${category}&pattern=${searchTerm}&n=${displayvolume}`)
    if(category == 'power'){
      const encodedSearchpower = encodeURIComponent(searchpower);
      const encodeddisplayvolume = encodeURIComponent(displayvolume);
        console.log(`api/superheroes/search/power?power=${encodedSearchpower}&n=${encodeddisplayvolume}`);
        fetch(`api/superheroes/search/power?power=${searchpower}&n=${displayvolume}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data, categoryorder, category);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    else if(category == 'ids'){
      console.log("hi");
      const converter= parseInt(searchTerm);
      console.log(converter)
      const encodedconverter = encodeURIComponent(converter);
      fetch(`api/superheroes/${encodedconverter}/powers`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.length);
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        const superhero = data.superheroes[0]; // Access the first (and only) item in the array
        console.log(superhero); 
          const div = document.createElement('div');
          let eyeColor = superhero["Eye_Color"];
          let skin = superhero["Skin"];
          let Hair = superhero["Hair"];
          // Update these fields to match the actual properties of your superhero objects
          div.textContent = `ID: ${superhero.id}, Name: ${superhero.name}, Gender: ${superhero.gender}, Eye Color: ${eyeColor}, Race: ${superhero.race}, Hair: ${Hair}, Height: ${superhero.Height}, Publisher: ${superhero.Publisher}, Skin: ${skin}, Alignment: ${superhero.Alignment}, Weight: ${superhero.Weight}, Powers: ${superhero.powers.join(', ')}`;
          resultsContainer.appendChild(div);
     
      })
      .catch(error => {
        console.error('Error:', error);
      });

    }
  
    else{
      const encodedSearchTerm = encodeURIComponent(searchTerm);
const encodedCategory = encodeURIComponent(category);
const encodeddisplayvolume = encodeURIComponent(displayvolume);
  fetch(`api/superheroes/search?field=${encodedCategory}&pattern=${encodedSearchTerm}&n=${encodeddisplayvolume}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
      displayResults(data, categoryorder, category);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
}

function showpublishersresults() {
  fetch('/api/superheroes/publishers')
    .then(response => response.json())
    .then(publishers => { // 'publishers' is expected to be an array based on the server's response
        console.log(publishers);
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Clear previous results
        publishers.forEach(publisher => { // Iterate over the array directly
          const div = document.createElement('div');
          div.textContent = `Publisher: ${publisher}`; // 'publisher' is a string, not an object
          resultsContainer.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error fetching publishers:', error);
    });
}

function displayResults(superheroes, sortDirection, sortField) {
  const sortOrderMultiplier = sortDirection === 'ascending' ? 1 : -1;

  if (sortField === 'power') {
    superheroes.sort((a, b) => {
      const powersA = Array.isArray(a.powers) ? a.powers.length : 0;
      const powersB = Array.isArray(b.powers) ? b.powers.length : 0;
      return (powersA - powersB) * sortOrderMultiplier;
    });
  } else {
    superheroes.sort((a, b) => {
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';
      return valueA.localeCompare(valueB, undefined, { numeric: true }) * sortOrderMultiplier;
    });
  }

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results
  if (sortField === 'power') {
    superheroes.forEach(superhero => {
      const div = document.createElement('div');
      let eyeColor = superhero["Eye_Color"];
    let skin = superhero["Skin"];
    let Hair = superhero["Hair"];
      // Update these fields to match the actual properties of your superhero objects
      div.textContent = `ID: ${superhero.id}, Name: ${superhero.name}, Gender: ${superhero.gender}, Eye Color: ${eyeColor}, Race: ${superhero.race}, Hair: ${Hair}, Height: ${superhero.Height}, Publisher: ${superhero.Publisher}, Skin: ${skin}, Alignment: ${superhero.Alignment}, Weight: ${superhero.Weight}, powers: ${superhero.powers}`;
      resultsContainer.appendChild(div);
      
    });
  }
  else{
  superheroes.forEach(superhero => {
    const div = document.createElement('div');
    let eyeColor = superhero["Eye color"];
    let skin = superhero["Skin color"];
    let Hair = superhero["Hair color"];
    // Update these fields to match the actual properties of your superhero objects
    div.textContent = `ID: ${superhero.id}, Name: ${superhero.name}, Gender: ${superhero.Gender}, Eye Color: ${eyeColor}, Race: ${superhero.Race}, Hair: ${Hair}, Height: ${superhero.Height}, Publisher: ${superhero.Publisher}, Skin: ${skin}, Alignment: ${superhero.Alignment}, Weight: ${superhero.Weight}`;
    resultsContainer.appendChild(div);
  });
  }
}
showpublishers.addEventListener("click", () => {
showpublishersresults();
})
function sanitizeString(str) {
  return str.trim().replace(/[&<>"'/]/g, function (match) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    })[match];
  });
}
function sanitizeNumber(num) {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? 0 : parsed;
}
function sanitizeArray(arr) {
  return arr.map(el => sanitizeString(el));
}


// Add an event listener to the search button
searchButton.addEventListener("click", () => {
  // Get the current value of the input and select elements
  const displayn = sanitizeNumber(displayvol.value.toLowerCase());
  const searchTerm = sanitizeString(searchTermInput.value.toLowerCase());
  const searchpower = sanitizeString(searchTermInput.value);
  const category = categorySelect.value;
  const catsorter = categoryorder.value;
  const displayvolume = parseInt(displayn);
  console.log(searchTerm, category, displayvolume, searchpower); // Log the search term and category for debugging

  // Call the search function with the current search term and category
  searchSuperheroes(searchTerm, category, displayvolume, searchpower, catsorter);
});
submitlistButton.addEventListener("click", () => {
  const listVal = listName.value;
  const ids = superhero_ids.value.split(',').map(id => parseInt(id.trim(), 10)); // Convert string of IDs into an array of numbers
  createSuperheroList(listVal, ids);
  console.log(ids)
});
listreturnbutton.addEventListener("click", () => {
  const listreturnsi = sanitizeString(listreturn.value);
  const listsorter = listorder.value;
  const attributeorder = attributeSelect.value;
  const list_obj= list_objective.value;
  getSuperheroList(listreturnsi, listsorter, attributeorder, list_obj);
});

