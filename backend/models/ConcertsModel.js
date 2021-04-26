const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DECIMAL, DATE, BOOLEAN } = DataTypes;
  const Concerts = sequelize.define(
    'Concerts',
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
      rate: {
        type: DECIMAL,
        validate: {
          notEmpty: true,
          isDecimal: true,
        },
      },
      active: {
        type: BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
      concert_time: {
        type: DATE,
        get: function () {
          return moment(this.getDataValue('concert_time')).format('YYYY-MM-DDTHH:mm:ss');
        },
      },
      on_zoom_url: {
        type: TEXT,
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
    }
  );

  return Concerts;
};
