module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, BOOLEAN, DATE } = DataTypes;
  const Reviews = sequelize.define(
    'Reviews',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: INTEGER,
      },
      author_name: {
        type: TEXT,
      },
      author_title: {
        type: TEXT,
      },
      author_email: {
        type: TEXT,
      },
      review: {
        type: TEXT,
      },
      rating: {
        type: INTEGER,
      },
      active: {
        type: BOOLEAN,
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

  Reviews.associate = function(models) {
    Reviews.belongsTo(models.Artists, { foreignKey: 'artist_id' });
  };

  return Reviews;
};
