module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DECIMAL, DATE } = DataTypes;
  const Bookings = sequelize.define(
    'Bookings',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: INTEGER,
      },
      name: {
        type: TEXT,
        validate: {
          notEmpty: true,
        },
      },
      contact_firstname: {
        type: TEXT,
      },
      contact_lastname: {
        type: TEXT,
      },
      contact_email: {
        type: TEXT,
      },
      contact_address1: {
        type: TEXT,
      },
      contact_address2: {
        type: TEXT,
      },
      contact_city: {
        type: TEXT,
      },
      contact_state: {
        type: TEXT,
      },
      contact_zipcode: {
        type: TEXT,
      },
      duration: {
        type: INTEGER,
      },
      event_style: {
        type: TEXT,
      },
      event_song_requests: {
        type: TEXT,
      },
      event_special_requests: {
        type: TEXT,
      },
      card_last4: {
        type: TEXT,
      },
      card_brand: {
        type: TEXT,
      },
      card_receipt_url: {
        type: TEXT,
      },
      fee_duration: {
        type: DECIMAL,
      },
      fee_service: {
        type: DECIMAL,
      },
      fee_total: {
        type: DECIMAL,
      },
      confirmation_code: {
        type: TEXT,
      },
      zoom_meeting_identifier: {
        type: TEXT,
      },
      zoom_meeting_passcode: {
        type: TEXT,
      },
      start_time: {
        type: DATE,
      },
      end_time: {
        type: DATE,
      },
      created: {
        type: DATE,
      },
    },
    {
      schema: process.env.PG_SCHEMA,
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      deletedAt: false,
      underscored: true,
    },
  );

  Bookings.associate = function(models) {
    Bookings.belongsTo(models.Artists, { foreignKey: 'artist_id' });
  };

  return Bookings;
};
