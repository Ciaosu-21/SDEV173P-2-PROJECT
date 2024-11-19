document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData);
    const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
    });
    const result = await response.json();
    document.getElementById('result').innerHTML = `
        <h2>Prediction Result</h2>
        <p>${result.prediction}</p>
        <p>Probability: ${result.probability}</p>
    `;
});
