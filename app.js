// Require Libraries
const express = require('express');
const app = express();
app.use(express.static('public'));

const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const Tenor = require("tenorjs").client({
    "Key": "EQNKCO4D4CUI", 
    "Filter": "high", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/', { useNewUrlParser: true }, { useUnifiedTopology: true });

const Review = mongoose.model('Review', {
    title: String,
    description: String,
    movieTitle: String
});

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Routes
app.get('/review', (req, res) => {
    Review.find().lean()
      .then(reviews => {
        res.render('reviews-index', { reviews: reviews });
      })
      .catch(err => {
        console.log(err);
      })
  })

  app.post('/reviews', (req, res) => {
    Review.create(req.body).then((review) => {
      console.log(review)
      res.redirect(`/reviews/${review._id}`) 
    }).catch((err) => {
      console.log(err.message)
    })
})

app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {title: "New Review"});
})

app.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
      res.render('reviews-edit', {review: review, title: "Edit Review"});
    })
})

app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Review.findByIdAndRemove(req.params.id).then((review) => {
      res.redirect('/');
    }).catch((err) => {
      console.log(err.message);
    })
})

app.put('/reviews/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body).lean()
      .then(review => {
        res.redirect(`/reviews/${review._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
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