module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, BOOLEAN } = DataTypes;
  const ArtistGenres = sequelize.define(
    "ArtistGenres",
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: TEXT,
        validate: {
          notEmpty: true,
        }
      },
      sort_order: {
        type: INTEGER,
      },
      active: {
        type: BOOLEAN,
        validate: {
          notEmpty: true,
        }
      },
    },
    {
      schema: process.env.PG_SCHEMA,
      freezeTableName: true,
      timestamps: false,
      underscored: true,
      defaultScope: {
        where: {
          active: true
        },
        order: [['sort_order', 'desc']]
      }
    }
  );

  ArtistGenres.associate = function(models) {
    ArtistGenres.belongsToMany(models.Artists, {
      through: 'ArtistsArtistGenres',
      foreignKey: 'artist_genre_id',
      otherKey: 'artist_id',
      timestamps: false,
      as: 'Artists',
    });
  };

  return ArtistGenres;
};
