const Joi = require('joi');
const express = require('express');
//dependant on two modules joi, express
const app = express();

app.use(express.json());
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
res.send('Hello')
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
    // sends the response request to the HTTP on the local host through the course array 
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body); // getting error property
    if(error) return res.status(400).send('Name is required and should minimum 3 characters')

    const course = {
        id: courses.length + 1,
        name: req.body.name
        //used with input validation for the post 

    };
    //posts a new entry into the database 
    courses.push(course);
    //
    res.send(course);
    //sends a new response to the client to showcase the push request  
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //finds the specific id through the courses array and equals it to the request parameter id in HTTP
    if (!course) return res.status(404).send('The course with the goven ID was not found')
    

    const { error } = validateCourse(req.body); // getting error property
    if(error) return res.status(400).send('Name is required and should minimum 3 characters')

    course.name = req.body.name;
    res.send(course);
    //Update course
    //Return the updated course 
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

  return schema.validate(course);//joi.validate does not work past version 14 on joi make schema a joi.object and use that
}

// /api/courses/1
app.get('/api/courses/:id', (req, res) => {// gets the id of the paramater for courses 
   const course = courses.find(c => c.id === parseInt(req.params.id));
   //finds the specific id through the courses array and equals it to the request parameter id in HTTP
   if (!course) return res.status(404).send('The course with the goven ID was not found')
  res.send(course);
    
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //finds the specific id through the courses array and equals it to the request parameter id in HTTP
    if (!course) return res.status(404).send('The course with the goven ID was not found')

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);

});

// PORT
const port = process.env.PORT || 3000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request