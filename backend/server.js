require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const books = {
  html: [
    {
      tag: "html",
      title: "Head first HTML with CSS and XHTML",
      description: "Wouldnt it be dreamy if there was an HTML book that didnt assume you knew what elements, attributes, validation, selectors, and pseudo-classes were, all by page three? Its probably just a fantasy....",
      link: "http://artsites.ucsc.edu/sdaniel/170a_2014/Head_First_HTML_CSS_XHTML.pdf",
      img: "https://user-images.githubusercontent.com/100681165/238347591-83df59d5-1bae-4ae2-98aa-79fdb84f84c0.jpg"
    },
    {
    "tag": "html",
    "title": "HTML and CSS quickstart guide",
    "description": "One of the most popular books and bestseller. Covers all the important topics with detailed explanation and good examples.",
    "link": "https://www.scribd.com/book/506664350/HTML-CSS-QuickStart-Guide-The-Simplified-Beginners-Guide-to-Developing-a-Strong-Coding-Foundation-Building-Responsive-Websites-and-Mastering-the",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
  }
  ],
  css: [
    {
      tag: "css",
      title: "CSS: The Definitive Guide",
      description: "A comprehensive guide to CSS styling and layout techniques.",
      link: "https://example.com/css-guide",
      img: "https://example.com/css-book.jpg"
    },
    {
      "tag": "css",
      "title": "Head first HTML with CSS and XHTML",
      "description": "Many books that teach HTML and CSS resemble dull manuals. To make it easier for you to learn, we threw away the traditional template used by publishers and redesigned this book from scratch.",
      "link": "https://wtf.tw/ref/duckett.pdf",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ],
  javascript: [
    {
      "tag": "js",
      "title": "Eloquent Javascript",
      "description": "One of the most popular books and bestseller. Covers all the important topics with detailed explanation and good examples.",
      "link": "https://eloquentjavascript.net/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "js",
      "title": "Javascript for Professionals",
      "description": "400+ pages of professional hints and tricks. All the topics covered in detail with syntax and examples.",
      "link": "https://drive.google.com/file/d/1OonOQwMOTMKLTjTViqIt14Pi1l5rOBoM/view",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "js",
      "title": "Node Bots",
      "description": "This book is for anyone who wants to take the first steps on Nodebots or has an interest in deliving into some concepts that are poorly demonstrated on the subject.",
      "link": "https://drive.google.com/file/d/1NU8xbM2d-p3ihxPga1wtH114ieDdme1-/view",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "js",
      "title": "Javascript the Good Parts",
      "description": "This book calls out the best parts of Javascript and tells you what to avoid (the 'bad parts'). It's about making sure you know the really important parts of the language and create good habits instead of having to break bad ones down the line.",
      "link": "https://github.com/dwyl/Javascript-the-Good-Parts-notes",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "js",
      "title": "Javascript - The Right Way",
      "description": "This is a guide intended to introduce new developers to JavaScript and help experienced developers learn more about its best practices.Despite the name, this guide doesn't necessarily mean the only way to do JavaScript.We just gather all the articles, tips, and tricks from top developers and put it here. Since it comes from exceptional folks, we could say that it is the right way, or the best way to do so.",
      "link": "https://jstherightway.org/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ],
  tailwind: [
    {
    "tag": "tailwind",
    "title": "Tailwind CSS",
    "description": "Tailwind CSS is a highly customizable and utility-first CSS framework, designed to speed up web development by providing an extensive set of pre-built classes that can be combined to build modern and responsive user interfaces.",
    "link": "#",
    "img": "#"
    }
  ],
  nextjs: [
    {
    "tag": "nextjs",
    "title": "NextJS",
    "description": "Next.js is an open-source web development framework created by the private company Vercel providing React-based web applications with server-side rendering and static website generation.",
    "link": "#",
    "img": "#"
    }
  ],
  react: [
    {
    "tag": "react",
    "title": "The Road to React",
    "description": "Learn everything about React Components, React's top-level APIs, and JSX to create modern frontend applications.",
    "link": "https://www.roadtoreact.com/",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
    "tag": "react",
    "title": "Full Stack React",
    "description": "This book aims to be the single most useful resource on learning React. By the time youre done. reading this book, you (and your team) will have everything you need to build reliable, powerful React apps.",
    "link": "https://demo.smarttrainerlms.com/uploads/0003/trainings/course/45/modules/fullstack-react-book-r30_1510302324482009603.pdf",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
    "tag": "react",
    "title": "Learn React Hooks",
    "description": "Create large-scale web applications with code that is extensible and easy to understand using React Hooks. Explore effective strategies for migrating your state management from Redux and MobX to React Hooks",
    "link": "https://www.oreilly.com/library/view/learn-react-hooks/9781838641443/",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
    "tag": "react",
    "title": "Learning REACT",
    "description": "This book is a comprehensive guide that teaches you how to build modern web applications using the React JavaScript library",
    "link": "https://drive.google.com/file/d/1AZwshgVyazeIJ95ng6Pg1zUbVQoYX93t/view?usp=share_link",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
    "tag": "react",
    "title": "30 Days of REACT",
    "description": "Each day in our 30 day adventure will build upon the previous day materials so by the end of the series you'll not only know the terms concepts, andunderpinnings of how the framework works, but be able to use React in yournext web application.",
    "link": "https://drive.google.com/file/d/1NrMsdTXa-s9hhOZ-LXptbyW_XNvTwnVS/view?usp=sharing",
    "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ]
};

const editors = {
  html: [
    {
      "tag": "html",
      "title": "Visual Studio Code",
      "description": "A lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js.",
      "link": "https://code.visualstudio.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "html",
      "title": "Sublime Text",
      "description": "A sophisticated text editor for code, markup and prose. You'll love the slick user interface, extraordinary features and amazing performance.",
      "link": "https://www.sublimetext.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ],
  css: [
    {
      "tag": "css",
      "title": "Visual Studio Code",
      "description": "A lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js.",
      "link": "https://code.visualstudio.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "css",
      "title": "WebStorm",
      "description": "A powerful IDE for modern JavaScript development with built-in support for HTML, CSS, and JavaScript.",
      "link": "https://www.jetbrains.com/webstorm/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ],
  javascript: [
    {
      "tag": "js",
      "title": "Visual Studio Code",
      "description": "A lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js.",
      "link": "https://code.visualstudio.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "js",
      "title": "WebStorm",
      "description": "A powerful IDE for modern JavaScript development with built-in support for HTML, CSS, and JavaScript.",
      "link": "https://www.jetbrains.com/webstorm/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }
  ],
  tailwind: [
    {
      "tag": "tailwind",
      "title": "Visual Studio Code",
      "description": "A lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js.",
      "link": "https://code.visualstudio.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "tailwind",
      "title": "WebStorm",
      "description": "A powerful IDE for modern JavaScript development with built-in support for HTML, CSS, and JavaScript.",
      "link": "https://www.jetbrains.com/webstorm/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    }


  ],
  nextjs: [
      {
        "tag": "nextjs",
        "title": "NextJS",
        "description": "Next.js is an open-source web development framework created by the private company Vercel providing React-based web applications with server-side rendering and static website generation.",
        "link": "#",
        "img": "#"
      }
  ],
  react: [
    {
      "tag": "react",
      "title": "Visual Studio Code",
      "description": "A lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js.",
      "link": "https://code.visualstudio.com/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
    },
    {
      "tag": "react",
      "title": "WebStorm",
      "description": "A powerful IDE for modern JavaScript development with built-in support for HTML, CSS, and JavaScript.",
      "link": "https://www.jetbrains.com/webstorm/",
      "img": "https://user-images.githubusercontent.com/100681165/238345276-e3dde5b5-f7d2-46ea-a485-26a43df1f8c4.jpg"
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
  const newBooks = req.body;
  
  if (!books[category]) {
    books[category] = [];
  }
  
  //If the request body is an array ,add all books
  if (Array.isArray(newBooks)) {
    books[category].push(...newBooks);
    res.status(201).json(newBooks);
    return;
  }else{
    //Otherwise, add singlr book
    books[category].push(newBooks);
    res.status(201).json(newBooks);
  }
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

// Editor API Routes
// Get all editors
app.get('/api/editor', (req, res) => {
  res.json(editors);
});

// Get editors by category
app.get('/api/editor/:category', (req, res) => {
  const category = req.params.category;
  if (editors[category]) {
    res.json(editors[category]);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

// Add a new editor
app.post('/api/editor/:category', (req, res) => {
  const category = req.params.category;
  const newEditors = req.body;
  
  if (!editors[category]) {
    editors[category] = [];
  }
  
  if (Array.isArray(newEditors)) {
    editors[category].push(...newEditors);
    res.status(201).json(newEditors);
    return;
  } else {
    editors[category].push(newEditors);
    res.status(201).json(newEditors);
  }
});

// Search editors
app.get('/api/editor/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = {};
  
  Object.keys(editors).forEach(category => {
    const matches = editors[category].filter(editor => 
      editor.title.toLowerCase().includes(query) || 
      editor.description.toLowerCase().includes(query)
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