'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const db = {};

const config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USERNAME,
  process.env.PG_PASSWORD,
  config,
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });


// *********************************************
//
// db.Artists.findAll({ include: ['Locations', 'ArtistType', 'ArtistGenres'] }).then((artists) => {
//   console.log(artists.map((artist) => ({
//     artist: artist.get(),
//     locations: artist.get('Locations').map(x => x.get('name')),
//     artistGenres: artist.get('ArtistGenres').map(x => x.get('name')),
//     artistType: artist.get('ArtistType').get('name'),
//   })));
// });
//
// db.ArtistTypes.findAll().then((artistTypes) => {
//   console.log(artistTypes.map(artistType => artistType.name));
// });

// db.artist.scope('locations').findAll().then((artists) => {
//   console.log(artists.map((artist) => ({
//     artist: artist.get(),
//     locations: artist.get('locations').map(location => location.get('name'))
//   })));
//
//   //console.log(artist.dataValues.locations.map((location) => location.dataValues.name));
//   // artist.getLocations().then((locations) => {
//   //   console.log(locations);
//   // });
// });

// *********************************************

Sequelize.postgres.DECIMAL.parse = function (value) {
  return parseFloat(value);
};
Sequelize.postgres.BIGINT.parse = function (value) {
  return parseInt(value);
};

module.exports = db;
