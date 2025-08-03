// @ts-nocheck
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./src/db/mock-pokemon.js');
const PokemonModel = require('./src/models/pokemon.js')

const app = express();
const port = 3000;

const sequelize = new Sequelize(
  'pokedex', // Database name
  'root', // Identifiant connexion BDD
  '', // Mot de passe connexion BDD
  {
    host: 'localhost', // Host de la BDD
    dialect: 'mariadb', // Type de BDD (mysql, mariadb, postgres, sqlite)
    dialectOptions: {
      timezone: 'Etc/GMT' 
    },
    logging: false, // Désactiver les logs de requêtes SQL
  }
);

sequelize.authenticate()
  .then(_ => {
    console.log('Connexion à la base de données réussie !');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

const Pokemon = PokemonModel(sequelize, DataTypes); 
  
sequelize.sync({force: true}) //force: true pour recréer la table à chaque démarrage (uniquement pour le développement pas production)
  .then(_ => {
    console.log('La base de données "Pokedex" a bien été synchronisée !');

    pokemons.map(pokemon => { //.map() pour parcourir le tableau de pokémons
      Pokemon.create({ // Pokemon.create() pour créer un nouveau Pokémon dans la base de données
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types.join() //.join() pour convertir le tableau en chaîne de caractères
      //.split() pour convertir la chaîne de caractères en tableau
    }).then(pokemon => console.log(pokemon.toJSON())) //.toJSON() pour afficher l'objet Pokémon créé
  })
})

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello again, Express ✌️!')
});

// pokédex
app.get('/api/pokemons', (req, res) => {
  res.json(success('Pokédex', pokemons));
});


// Identification d'un pokémon
app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find(pokemon => pokemon.id === id);
  const message = 'Un pokémon a bien été trouvé.';
  res.json(success(message, pokemon));
});

app.post('/api/pokemons', (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}};
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été créé.`;
  res.json(success(message, pokemonCreated));
});

app.put('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map(pokemon => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
});
  const message = `Le pokémon ${pokemonUpdated.name} a bien été mis à jour.`;
  res.json(success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
  pokemons = pokemons.filter(pokemon => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () => {
  console.log(`Notre application Node est démarrée sur : http://localhost:${port}`);
});