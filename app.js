// Require Libraries
const express = require('express');
const exphbs  = require('express-handlebars');
const Tenor = require("tenorjs").client({
    "Key": "EQNKCO4D4CUI", 
    "Filter": "high", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

// App Setup
const app = express();
app.use(express.static('public'));

// OUR MOCK ARRAY OF PROJECTS
let reviews = [
    { title: "Great Review", movieTitle: "Batman II" },
    { title: "Awesome Movie", movieTitle: "Titanic" }
  ]  

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routes
app.get('/reviews', (req, res) => {
    res.render('reviews-index', { reviews: reviews });
  })

app.get('/', (req, res) => {

    term = ""
    if (req.query.term) {
        term = req.query.term
    }

    Tenor.Search.Query(term, "10")
        .then(response => {
            const gifs = response;
            res.render('home', { gifs })
        }).catch(console.error);
  })

// Start Server
app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});