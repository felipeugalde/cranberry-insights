document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("addressForm");
    const reviewsDiv = document.getElementById("reviews");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const address = form.elements.address.value;

        fetch(`/getReviews?address=${address}`)
            .then(response => response.json())
            .then(data => {
                reviewsDiv.innerHTML = "";
                data.reviews.forEach(review => {
                    const reviewElement = document.createElement("div");
                    reviewElement.textContent = review.text;
                    reviewsDiv.appendChild(reviewElement);
                });
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    });
});
