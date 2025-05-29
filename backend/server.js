const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (we'll move this to a database later)
const books = {
  html: [
    {
      tag: "html",
      title: "Head first HTML with CSS and XHTML",
      description: "Wouldnt it be dreamy if there was an HTML book that didnt assume you knew what elements, attributes, validation, selectors, and pseudo-classes were, all by page three? Its probably just a fantasy....",
      link: "http://artsites.ucsc.edu/sdaniel/170a_2014/Head_First_HTML_CSS_XHTML.pdf",
      img: "https://user-images.githubusercontent.com/100681165/238347591-83df59d5-1bae-4ae2-98aa-79fdb84f84c0.jpg"
    }
  ],
  css: [
    {
      tag: "css",
      title: "CSS: The Definitive Guide",
      description: "A comprehensive guide to CSS styling and layout techniques.",
      link: "https://example.com/css-guide",
      img: "https://example.com/css-book.jpg"
    }
  ]
};

// API Routes
// Get all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Get books by category
app.get('/api/books/:category', (req, res) => {
  const category = req.params.category;
  if (books[category]) {
    res.json(books[category]);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

// Add a new book
app.post('/api/books/:category', (req, res) => {
  const category = req.params.category;
  const newBook = req.body;
  
  if (!books[category]) {
    books[category] = [];
  }
  
  books[category].push(newBook);
  res.status(201).json(newBook);
});

// Search books
app.get('/api/books/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = {};
  
  Object.keys(books).forEach(category => {
    const matches = books[category].filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.description.toLowerCase().includes(query)
    );
    if (matches.length > 0) {
      results[category] = matches;
    }
  });
  
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 