document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    const formData = new FormData(event.target);
    const data = {};

    // Convert FormData to JSON object
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        // Send the form data to the Flask backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to fetch prediction. Please try again.');

        const result = await response.json();

        // Update the result section with the prediction
        document.getElementById('result').innerHTML = `
            <h2>Prediction Result</h2>
            <p><strong>${result.prediction}</strong></p>
            <p>Probability: <strong>${result.probability}</strong></p>
        `;
    } catch (error) {
        // Display an error message if something goes wrong
        document.getElementById('result').innerHTML = `
            <p style="color: red;">${error.message}</p>
        `;
    }
});
