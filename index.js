const Joi = require('joi');
const express = require('express');
//dependant on two modules joi, express
const app = express();
const router = express.Router();
app.use('/api/superheroes', router);
router.use(express.json());

app.use('/', express.static('client'));
const fs = require('fs').promises; // Make sure to use the promises version of fs

// Wrap the file reading in an async function
async function loadSuperheroes() {
  const data = await fs.readFile('express-demo/superheroes/superhero_powers.json', 'utf8');
  return JSON.parse(data);
}

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});

router.route('/')//All the routes to the base prefix
    .get((req,res) =>{//get a list of parst
        res.send(parts);
    })

// Call the function to load superheroes when starting the server
let superheroes = [];
loadSuperheroes().then(data => {
  superheroes = data;
}).catch(error => {
  console.error('Failed to load superheroes:', error);
});

router.get('/:id/powers', async (req, res) => {
    console.log("whatever")
    try {
       // Extract the name from the request parameters
    const superheroName = req.params.id;

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



router.get('/:id', async (req, res) => {
    try {

        const data = await fs.readFile('express-demo\superheroes\superhero_info.json', 'utf8');
        const superherodata = JSON.parse(data);

    const superheropublisher = req.params.id;

    const superheropublisherid = superherodata.find(sh => sh.id === superheropublisher);
// If the superhero is not found, send a 404 response
if (!superheropublisherid) {
    return res.status(404).send('Superhero not found');
  }
  const publisher = Object.entries(superheropublisherid)
  .filter(([key, value]) => value === "Publisher" && key !== "id")
  .map(([key]) => key);
  res.json(publisher);
    } 
    catch (error) {
        // If there's an error, send a 500 response
        res.status(500).send('Server error');
      }
});  
// PORT
const port = process.env.PORT || 3000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request