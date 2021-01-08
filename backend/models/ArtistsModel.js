module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DECIMAL, DATE, BOOLEAN } = DataTypes;
  const Artists = sequelize.define(
    'Artists',
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
      email: {
        type: TEXT,
      },
      short_description: {
        type: TEXT,
      },
      description: {
        type: TEXT,
      },
      cover_img_url: {
        type: TEXT,
      },
      image1_url: {
        type: TEXT,
      },
      image2_url: {
        type: TEXT,
      },
      image3_url: {
        type: TEXT,
      },
      image4_url: {
        type: TEXT,
      },
      video_url: {
        type: TEXT,
      },
      custom_embed: {
        type: TEXT,
      },
      availability: {
        type: TEXT,
      },
      instruments: {
        type: TEXT,
      },
      equipment: {
        type: TEXT,
      },
      space: {
        type: TEXT,
      },
      dress_code: {
        type: TEXT,
      },
      rate: {
        type: DECIMAL,
        validate: {
          notEmpty: true,
          isDecimal: true,
        },
      },
      rating: {
        type: DECIMAL,
        validate: {
          isDecimal: true,
        },
      },
      active: {
        type: BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
      created: {
        type: DATE,
      },
    },
    {
      defaultScope: {
        where: {
          active: true,
        },
      },
      schema: process.env.PG_SCHEMA,
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      deletedAt: false,
      underscored: true,
    },
  );

  Artists.associate = function(models) {
    Artists.belongsTo(models.ArtistTypes, { foreignKey: 'artist_type_id' });
    Artists.belongsToMany(models.Locations, {
      through: 'ArtistsLocations',
      foreignKey: 'artist_id',
      otherKey: 'location_id',
      timestamps: false,
      as: 'Locations',
    });
    Artists.belongsToMany(models.ArtistGenres, {
      through: 'ArtistsArtistGenres',
      foreignKey: 'artist_id',
      otherKey: 'artist_genre_id',
      timestamps: false,
      as: 'ArtistGenres',
    });
    Artists.hasMany(models.Bookings, {
      foreignKey: 'artist_id',
      timestamps: false,
      as: 'Bookings'
    });
    Artists.hasMany(models.Reviews, {
      foreignKey: 'artist_id',
      timestamps: false,
      as: 'Reviews'
    });
  };

  return Artists;
};
