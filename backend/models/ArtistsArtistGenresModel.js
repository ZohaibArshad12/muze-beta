module.exports = (sequelize, DataTypes) => {
  const { INTEGER } = DataTypes;
  const ArtistsArtistGenres = sequelize.define(
    'ArtistsArtistGenres',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: INTEGER,
      },
      artist_genre_id: {
        type: INTEGER,
      },
    },
    {
      schema: process.env.PG_SCHEMA,
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    },
  );

  ArtistsArtistGenres.associate = function(models) {
    ArtistsArtistGenres.belongsTo(models.Artists, { foreignKey: 'artist_id' });
    ArtistsArtistGenres.belongsTo(models.ArtistGenres, { foreignKey: 'artist_genre_id' });
  };

  return ArtistsArtistGenres;
};
