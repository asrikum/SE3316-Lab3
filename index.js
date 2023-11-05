const express = require('express');
//dependant on two modules joi, express
const cors = require('cors');

// Enable CORS for all routes


// ... rest of your server setup

const app = express();
app.use(cors());
const router = express.Router();
app.use('/api/superheroes', router);
router.use(express.json());

app.use('/', express.static('client'));
const fs = require('fs').promises; // Make sure to use the promises version of fs

// Wrap the file reading in an async function
async function loadSuperheroes() {
  const data = await fs.readFile('./superheroes/superhero_powers.json', 'utf8');
  return JSON.parse(data);
}

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});

router.route('/')//All the routes to the base prefix
    .get((req,res) =>{//get a list of parst
        res.send(superhero_pub);
    })

// Call the function to load superheroes when starting the server
let superheroes = [];
loadSuperheroes().then(data => {
  superheroes = data;
}).catch(error => {
  console.error('Failed to load superheroes:', error);
});
router.get('/search/power', async (req, res) => {
  let { power } = req.query;

  power = power.trim();

  if (!power) {
    return res.status(400).send('Power query parameter is required');
  }

  try {
    const filteredSuperheroes = superheroes.filter(hero => {
      // Check if any of the hero's powers match the power we're looking for
      return Object.entries(hero).some(([key, value]) => key === power && value === "True");
    });

    if (filteredSuperheroes.length === 0) {
      return res.status(404).send('No superheroes found with the given power');
    }

    const superheroNames = filteredSuperheroes.map(hero => hero.hero_names);

    res.json(superheroNames);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/:name/powers', async (req, res) => {
    console.log("whatever");
    try {
       // Extract the name from the request parameters
    const superheroName = req.params.name;

    // Find the superhero by name
    const superhero = superheroes.find(sh => sh.hero_names === superheroName);

    // If the superhero is not found, send a 404 response
    if (!superhero) {
      return res.status(404).send('Superhero not found');
    }

    // Extract the powers from the superhero object
    const powers = Object.entries(superhero)
      .filter(([key, value]) => value === "True" && key !== "hero_names")
      .map(([key]) => key);

    // Send back the superhero's powers
    res.json(powers);
  } catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
  });

  async function loadSuperheroesPublisher() {
    const datapub = await fs.readFile('./superheroes/superhero_info.json', 'utf8');
    return JSON.parse(datapub);
  }
  let superhero_pub = [];
  loadSuperheroesPublisher().then(data => {
    superhero_pub = data;
  }).catch(error => {
    console.error('Failed to load superhero context:', error);
  });

router.get('/:id/publisher', async (req, res) => {
    try {

    const superheropublisher = parseInt(req.params.id);

    const superheropublisherid = superhero_pub.find(sh => sh.id === superheropublisher);
// If the superhero is not found, send a 404 response
if (!superheropublisherid) {
    return res.status(404).send('Superhero not found');
  }
  res.json({ publisher: superheropublisherid.Publisher });
}
    catch (error) {
        // If there's an error, send a 500 response
        res.status(500).send('Server error');
      }
});  
router.get('/publishers', async (req, res) => {
  try {
    // Create a set of unique publisher names
    const publisherSet = new Set(superhero_pub.map(hero => hero.Publisher));

    // Convert the set back into an array
    const publishers = [...publisherSet];

    // Send the list of unique publisher names
    res.json(publishers);
  } catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
});

router.get('/search', (req, res) => {
  const { field, pattern, n } = req.query;

  if (!field || !pattern) {
    return res.status(400).send('Search field and pattern must be provided');
  }

  // Perform the search with case-insensitive matching
  const regex = new RegExp(pattern, 'i');
  
  // Assuming superhero_pub is an array of superheroes with 'powers' as an array within each superhero object
  const filteredSuperheroes = superhero_pub.filter(sh => {
    // Check if the field is 'powers' and if so, search within the powers array
    if (field === 'powers') {
      return sh.powers.some(power => regex.test(power));
    } else {
      // For other fields, perform a regular regex test
      return regex.test(sh[field]);
    }
  });

  // Limit the number of results if 'n' is provided
  const limitedResults = n ? filteredSuperheroes.slice(0, n) : filteredSuperheroes;

  // Respond with the search results
  res.json(limitedResults);
});


router.get('/:id', (req, res) => {
    try {

        const superheroid = parseInt(req.params.id);
    
        const superhero = superhero_pub.find(sh => sh.id === superheroid);
    // If the superhero is not found, send a 404 response
    if (!superhero) {
        return res.status(404).send('Superhero not found');
      }
      res.json(superhero);
    }
        catch (error) {
            // If there's an error, send a 500 response
            res.status(500).send('Server error');
          }
});


// PORT
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request
