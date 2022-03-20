const path = require('path');
const express = require('express');
const helmet =require('helmet');
const session = require('express-session');
const exphbs = require('express-handlebars');


const routes = require('./controller');
const sequelize = require('./config/connection');

const app = express();
app.use(helmet());
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
  secret: 'Super secret secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true},
};

app.set('trust proxy', 1);
app.use(session(sess));

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}!`))
});

