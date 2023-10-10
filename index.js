const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Cranberry Insights");
});

app.get("/reviews", async (req, res) => {
  const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&input=In-N-Out+Burger&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const placeSearchResponse = await axios.get(placeSearchUrl);
    console.log("Place Search Response:", placeSearchResponse.data);

    if (placeSearchResponse.data.status === "REQUEST_DENIED") {
      res.send("Error: " + placeSearchResponse.data.error_message);
      return;
    }

    if (!placeSearchResponse.data.candidates[0]) {
      res.send("Place not found");
      return;
    }

    const placeId = placeSearchResponse.data.candidates[0].place_id;

    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${process.env.GOOGLE_API_KEY}`;

    const placeDetailsResponse = await axios.get(placeDetailsUrl);

    const reviews = placeDetailsResponse.data.result.reviews;
    res.send(reviews.map(review => review.text).join("<br>"));
  } catch (error) {
    console.log("Error fetching data from Google Places API:", error);
    res.send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
