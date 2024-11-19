document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const formData = new FormData(event.target);
    const data = {};

    // Convert FormData to JSON
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        // Send the data to the Flask backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch prediction. Please try again.');
        }

        const result = await response.json();

        // Update the fixed result section
        document.getElementById('result').innerHTML = `
            <h2>Prediction Result</h2>
            <p><strong>${result.prediction}</strong></p>
            <p>Probability: <strong>${result.probability}</strong></p>
        `;
    } catch (error) {
        // Display error message
        document.getElementById('result').innerHTML = `
            <p style="color: red;">${error.message}</p>
        `;
    }
});
