const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

app.use(express.static(".")); // Serve static files

app.get("/fetch-reviews", async (req, res) => {
  const businessName = req.query.business;

  // Fetch place_id
  let response = await axios.get(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
    {
      params: {
        key: "AIzaSyAL4wxvXOXXHRS6KbtI-pzZjNfrMBYN-s0",
        input: businessName,
        inputtype: "textquery",
        fields: "place_id",
      },
    }
  );
  const placeId = response.data.candidates[0].place_id;

  // Fetch reviews
  response = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        key: "AIzaSyAL4wxvXOXXHRS6KbtI-pzZjNfrMBYN-s0",
        place_id: placeId,
        fields: "review",
      },
    }
  );

  const reviews = response.data.result.reviews;
  res.json(reviews.slice(0, 100)); // Send last 100 reviews to frontend
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
