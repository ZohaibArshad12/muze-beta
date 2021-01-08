module.exports = (sequelize, DataTypes) => {
  const { INTEGER } = DataTypes;
  const ArtistsLocations = sequelize.define(
    'ArtistsLocations',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: INTEGER,
      },
      location_id: {
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

  ArtistsLocations.associate = function(models) {
    ArtistsLocations.belongsTo(models.Artists, { foreignKey: 'artist_id' });
    ArtistsLocations.belongsTo(models.Locations, { foreignKey: 'location_id' });
  };

  return ArtistsLocations;
};
