const express = require('express');
const cors = require('cors');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', express.static('client'));

// Initialize lowdb
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

// Ensure default data is set in the database if it's empty
function initializeDatabase() {
    const hasPowers = db.has('powers').value();
    const hasInfo = db.has('info').value();

    if (!hasPowers || !hasInfo) {
        const powersjson = require('./superheroes/superhero_powers.json');
        const infojson = require('./superheroes/superhero_info.json');
        db.defaults({ powers: powersjson, info: infojson }).write();
    }
}

initializeDatabase();
const router = express.Router();
app.use('/api/superheroes', router);

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});

router.route('/')//All the routes to the base prefix
    .get((req,res) =>{//get a list of parst
      const superheroes = db.get('info').value();
    res.send(superheroes);
    })

// Call the function to load superheroes when starting the server
const superheroes = db.get('powers').value();
const superhero_pub = db.get('info').value();
router.get('/search/power', async (req, res) => {
  let { power, n } = req.query;

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
    const limitedResults = n ? superheroNames.slice(0, n) : superheroNames;


    res.json(limitedResults);
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

app.post('/api/lists', async(req, res)=>{
  // Extract the list name and the superheroes from the request body
  try {
    
  const { listName } = req.body;


  // Check if the list name already exists
  const listExists = db.has(`lists.${listName}`).value();

  if (listExists) {
      // If the list name exists, return an error
      return res.status(400).send('List name already exists.');
  }

  // If the list name does not exist, create the new list
  db.set(`lists.${listName}`, []).write();

  // Return the newly created list
  res.status(201).json({
      message: 'New list created successfully.',
      listName: listName
      
  });
}catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
});

app.post('/api/lists/:listName', async (req, res) => {
  // Extract the list name from the URL parameters
  const { listName } = req.params;

  // Extract the superhero IDs from the request body
  const { superheroIds } = req.body;

  // Check if the list name already exists
  const listExists = db.has(`lists.${listName}`).value();

  if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
  }

  // Check if the superhero IDs are provided and are in an array
  if (!Array.isArray(superheroIds)) {
      return res.status(400).send('Superhero IDs must be an array.');
  }

  // Add superhero IDs to the existing list
  const updatedList = [...superheroIds];
  const uniqueElementsSet = new Set(updatedList);
const numberOfUniqueElements = uniqueElementsSet.size;
console.log(uniqueElementsSet);
const uniqueElementsArray = Array.from(uniqueElementsSet);
for(let i =0; i< numberOfUniqueElements; i++){
const listheroes = uniqueElementsArray[i];  
console.log(listheroes);
 const superhero = superhero_pub.find(sh => sh.id === listheroes);
  console.log(superhero);
};
  // Update the list in the database
  db.set(`lists.${listName}`, updatedList).write();

  // Return the updated list
  res.status(200).json({
      message: 'Superhero IDs added to the list successfully.',
      list: updatedList
  });
});

app.get('/api/lists/:listName', async (req, res) => {
  try {
    // Extract the listName from the request parameters
    const { listName } = req.params;

    // Check if the list name exists in the database
    const listExists = db.has(`lists.${listName}`).value();

    if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
    }
    // Retrieve the current list from the database
    const currentList = db.get(`lists.${listName}`).value();
    const uniqueElementsSet = new Set(currentList);
    const numberOfUniqueElements = uniqueElementsSet.size;
    console.log(uniqueElementsSet);
    const uniqueElementsArray = Array.from(uniqueElementsSet);
    let superheroarray = [];
    for(let i =0; i< numberOfUniqueElements; i++){
    const listheroes = uniqueElementsArray[i];  
    console.log(listheroes);
    const superhero = superhero_pub.find(sh => sh.id === listheroes);
    superheroarray.push(superhero)
      console.log(superhero);
    };
    // Send the current list as the response
    res.status(200).json({
      message: 'Superhero IDs shown from the list successfully.',
      list: currentList,
      Supeheroes:superheroarray
  });

  } catch (error) {
    // If there's an error, log it and send a 500 response
    console.error('Server error:', error);
  }
});

app.delete('/api/lists/:listName', (req, res) => {
  try {
    // Extract the listName from the request parameters
    const { listName } = req.params;

    // Check if the list name exists in the database
    const listExists = db.has(`lists.${listName}`).value();

    if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
    }
    db.unset(`lists.${listName}`).write();

    // Send a success response
    res.status(200).send('List deleted successfully.');
} catch (error) {
  // If there's an error, log it and send a 500 response
  console.error('Server error:', error);
  res.status(500).send('Server error');
}
  
});

// PORT
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request
