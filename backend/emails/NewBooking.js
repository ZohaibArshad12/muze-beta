const nodemailer = require('nodemailer');
const inlineCss = require('nodemailer-juice');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const Sqrl = require('squirrelly');
const fs = require('fs');

const NewBookingEmail = {
  getMessageForMuze: (data) => {
    const htmlTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-muze.html', 'utf8');
    const html = Sqrl.render(htmlTemplate, data);

    const textTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-muze.txt', 'utf8');
    const text = Sqrl.render(textTemplate, data);

    return {
      from: 'MUZE Music <info@muzebeta.com>',
      to: 'MUZE Music <info@muzebeta.com>',
      subject: `New Booking #${data.confirmation_code} for ${data.artist_name}`,
      text: text,
      html: html,
    };
  },

  getMessageForArtist: (data) => {
    const htmlTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-artist.html', 'utf8');
    const html = Sqrl.render(htmlTemplate, data);

    const textTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-artist.txt', 'utf8');
    const text = Sqrl.render(textTemplate, data);

    return {
      from: 'MUZE Music <info@muzebeta.com>',
      to: `${data.artist_name} <${data.artist_email}>`,
      subject: `New Booking #${data.confirmation_code} on MUZE Music`,
      text: text,
      html: html,
    };
  },

  getMessageForCustomer: (data) => {
    const htmlTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-customer.html', 'utf8');
    const html = Sqrl.render(htmlTemplate, data);

    const textTemplate = fs.readFileSync(__dirname + '/templates/new-booking-to-customer.txt', 'utf8');
    const text = Sqrl.render(textTemplate, data);

    return {
      from: 'MUZE Music <info@muzebeta.com>',
      to: `${data.contact_firstname} ${data.contact_lastname} <${data.contact_email}>`,
      subject: `MUZE Booking Confirmation #${data.confirmation_code}`,
      text: text,
      html: html,
    };
  },

  send: (data) => {
    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
      }

      console.log('Credentials obtained, sending message...');

      // Create a SMTP transporter object
      let transporter = process.env.SMTP_HOST === 'ethereal' ?
        nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })
        : nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
        });

      transporter.use('compile', inlineCss());
      transporter.use('compile', inlineBase64())

      const muzeMessage = NewBookingEmail.getMessageForMuze(data);
      NewBookingEmail.handleSend(transporter, muzeMessage);

      if (data.artist_email) {
        const artistMessage = NewBookingEmail.getMessageForArtist(data);
        NewBookingEmail.handleSend(transporter, artistMessage);
      }

      const customerMessage = NewBookingEmail.getMessageForCustomer(data);
      NewBookingEmail.handleSend(transporter, customerMessage);
    });
  },

  handleSend: (transporter, message) => {
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }
      console.log('Message sent: %s', info.messageId);

      // Preview only available when sending through an Ethereal account
      if (process.env.SMTP_HOST === 'ethereal') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    });
  },
};

module.exports = NewBookingEmail;