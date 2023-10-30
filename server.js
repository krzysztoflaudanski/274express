const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const multer  = require('multer');

const app = express();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
});

const upload = multer({ 
  storage: fileStorageEngine, 
  fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
      cb(null, true);
    } else {
      req.fileError = 'Only .png, .jpg, .jpeg, or .gif files are allowed.';
      cb(null, false);
    }
  }
});

app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.post('/contact/send-message', upload.single('image'), (req, res) => {

  console.log(req.file);
  const { author, sender, title, message } = req.body;

  if(author && sender && title && message && req.file) {
    res.render('contact', { isSent: true, fileName: req.file.originalname });
  }
  else {
    res.render('contact', { isError: true, fileError: req.fileError });
  }

});


app.listen(8000, () => {
  console.log('Server is running on port: 8000');
})