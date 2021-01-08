module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, BOOLEAN } = DataTypes;
  const Locations = sequelize.define(
    'Locations',
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
        },
      },
      active: {
        type: BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      schema: process.env.PG_SCHEMA,
      freezeTableName: true,
      timestamps: false,
      underscored: true,
      defaultScope: {
        where: {
          active: true,
        },
      },
    },
  );

  Locations.associate = function(models) {
    Locations.belongsToMany(models.Artists, {
      through: 'ArtistsLocations',
      foreignKey: 'location_id',
      otherKey: 'artist_id',
      timestamps: false,
      as: 'Artists',
    });
  };

  return Locations;
};
