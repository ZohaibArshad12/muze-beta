const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require('cookie-parser')
var session = require('express-session')
const AppRoutes = require("./routes/AppRoutes");
const SearchRoutes = require("./routes/SearchRoutes");
const ArtistRoutes = require("./routes/ArtistRoutes");
const ArtistTypeRoutes = require("./routes/ArtistTypeRoutes");
const ArtistGenreRoutes = require("./routes/ArtistGenreRoutes");
const LocationRoutes = require("./routes/LocationRoutes");
const BookingRoutes = require("./routes/BookingRoutes");
const ContactRoutes = require("./routes/ContactRoutes");
const AdminArtistRoutes = require("./routes/Admin/ArtistRoutes");
const AdminArtistTypeRoutes = require("./routes/Admin/ArtistTypeRoutes");
const AdminArtistGenreRoutes = require("./routes/Admin/ArtistGenreRoutes");
const AdminLocationRoutes = require("./routes/Admin/LocationRoutes");
const AdminReviewRoutes = require("./routes/Admin/ReviewRoutes");
const AdminBookingRoutes = require("./routes/Admin/BookingRoutes");
const db = require("./models");
const { setHeaders } = require("./middleware");

const PORT = process.env.PORT || 3005;

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// Configure headers
app.use(setHeaders);

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
  }));

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave:false,  saveUninitialized: true
}))

// Set routes
app.use("/api/app", AppRoutes);
app.use("/api/search", SearchRoutes);
app.use("/api/artists", ArtistRoutes);
app.use("/api/artist-types", ArtistTypeRoutes);
app.use("/api/artist-genres", ArtistGenreRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/contact", ContactRoutes);
app.use("/api/locations", LocationRoutes);
app.use("/api/admin/artists", AdminArtistRoutes);
app.use("/api/admin/artist-types", AdminArtistTypeRoutes);
app.use("/api/admin/artist-genres", AdminArtistGenreRoutes);
app.use("/api/admin/locations", AdminLocationRoutes);
app.use("/api/admin/reviews", AdminReviewRoutes);
app.use("/api/admin/bookings", AdminBookingRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
