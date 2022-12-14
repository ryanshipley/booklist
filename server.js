// Dependencies
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/books.js");
require('dotenv').config();
const methodOverride = require("method-override");
const db = mongoose.connection
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});



db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
// ROUTES


app.get('/books', (req, res) => {
	Book.find({}, (error, allBooks) => {
		res.render('index.ejs', {
			books: allBooks,
		});
	});
});

app.get('/books/new', (req, res) => {
	res.render('new.ejs');
});

// Delete
app.delete("/books/:id", (req, res) => {
	Book.findByIdAndDelete(req.params.id, (err, data) => {
		res.redirect("/books")
	})
})

// Update
app.put("/books/:id", (req, res) => {
	if (req.body.completed === "on") {
	  req.body.completed = true
	} else {
	  req.body.completed = false
	}
  
	Book.findByIdAndUpdate(
	  req.params.id,
	  req.body,
	  {
		new: true,
	  },
	  (error, updatedBook) => {
		res.redirect(`/books/${req.params.id}`)
	  }
	)
  })

// CREATE
app.post('/books', (req, res) => {
	if (req.body.completed === 'on') {
		//if checked, req.body.completed is set to 'on'
		req.body.completed = true;
	} else {
		//if not checked, req.body.completed is undefined
		req.body.completed = false;
	}
	
	Book.create(req.body, (error, createdBook) => {
		res.redirect("/books");
	});
});

// Edit
app.get("/books/:id/edit", (req, res) => {
	Book.findById(req.params.id, (error, foundBook) => {
	  res.render("edit.ejs", {
		book: foundBook,
	  })
	})
  })

// Show
app.get('/books/:id', (req, res) => {
	Book.findById(req.params.id, (err, foundBook) => {
		res.render('show.ejs', {
			book: foundBook,
		});
	});
});


// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));