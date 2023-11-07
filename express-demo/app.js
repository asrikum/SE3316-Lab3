const Joi = require('joi');
const express = require('express');
//dependant on two modules joi, express
const app = express();
const router = express.Router();
app.use('/api/parts', router);
router.use(express.json());

const parts = [
    { id: 1, name: 'course1', choice: 'Calc', stock: 0 },
    { id: 2, name: 'course2', choice: 'Micro', stock: 0  },
    { id: 3, name: 'course3', choice: 'Chem', stock: 0  },
];

app.use('/', express.static('client'));

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});

router.route('/')//All the routes to the base prefix
    .get((req,res) =>{//get a list of parst
        res.send(parts);
    })
    
    .post((req, res) =>{
            const nextpart = req.body;
            nextpart.id = parts.length;
        if(nextpart.name){
            parts.push(nextpart);
            res.send(nextpart);
        }
        else{
            res.status(400).send('Missing name');
        }
    })

router.route('/:id') // All routes with a part ID 
.get((req, res) =>{
    const course = parts.find(c => c.id === parseInt(req.params.id));
    //finds the specific id through the parts array and equals it to the request parameter id in HTTP
    if (!course) return res.status(404).send('The course with the given ID was not found')
   res.send(course);
})
//Create/replace part data for a given ID 
.put((req, res) =>{
    const nextpart = req.body;//gets the json body
    console.log("Part: ", nextpart);// checks if the json is empty
    nextpart.id = parseInt(req.params.id);// moves to paramter id 

    
    const course = parts.findIndex(p => p.id === nextpart.id);// checks if the ids match
    if(course < 0){// if id is less than 0 than outside the array 
        console.log('Creating new part');
        parts.push(nextpart);//pushes new parts to json array 
    }
    else{
        console.log('Modifying part ', req.params.id);
    parts[course]= nextpart;//only modifying certain already existing indexes
    }
    //finds the specific id through the parts array and equals it to the request parameter id in HTTP
    
res.send(nextpart);//sending the response data 

})
//Update Stock level 
.post((req, res) =>{
    const newpart = req.body;
    console.log("Part: ", newpart);

    const course = parts.findIndex(c => c.id === parseInt(req.params.id));

   if (course < 0){
        res.status(404).send("Not Found");
   }
    else{
        console.log('Changing stock for ', req.params.id);
        parts[course].stock += parseInt(req.body.stock);
        res.send(parts[course]);
    }
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

  return schema.validate(course);//joi.validate does not work past version 14 on joi make schema a joi.object and use that
}



app.delete('/api/parts/:id', (req, res) => {
    const course = parts.find(c => c.id === parseInt(req.params.id));
    //finds the specific id through the parts array and equals it to the request parameter id in HTTP
    if (!course) return res.status(404).send('The course with the goven ID was not found')

    const index = parts.indexOf(course);
    parts.splice(index, 1);

    res.send(course);
    
});


// PORT
const port = process.env.PORT || 3000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request