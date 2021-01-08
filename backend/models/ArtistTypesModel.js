module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, BOOLEAN } = DataTypes;
  const ArtistTypes = sequelize.define(
    "ArtistTypes",
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

  ArtistTypes.associate = function(models) {
    ArtistTypes.hasMany(models.Artists, {
      foreignKey: 'artist_type_id',
      timestamps: false,
      as: 'Artists'
    });
  };

  return ArtistTypes;
};
