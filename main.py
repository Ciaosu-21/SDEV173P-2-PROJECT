from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Initialize Flask app
app = Flask(__name__)


# Load and preprocess the dataset
def load_model():
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    column_names = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope',
                    'ca', 'thal', 'target']
    data = pd.read_csv(url, names=column_names)

    # Preprocess the dataset
    data.replace('?', np.nan, inplace=True)
    for col in ['ca', 'thal']:
        data[col] = pd.to_numeric(data[col])
    data.fillna(data.median(), inplace=True)

    # Binary classification (presence or absence of heart disease)
    X = data.drop('target', axis=1)
    y = (data['target'] > 0).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    return model


# Load model
classifier = load_model()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = np.array([[
        int(data['age']),
        int(data['sex']),
        int(data['cp']),
        int(data['trestbps']),
        int(data['chol']),
        int(data['fbs']),
        int(data['restecg']),
        int(data['thalach']),
        int(data['exang']),
        float(data['oldpeak']),
        int(data['slope']),
        int(data['ca']),
        int(data['thal']),
    ]])
    prediction = classifier.predict(user_input)[0]
    probability = classifier.predict_proba(user_input)[0][1] * 100
    return jsonify({
        'prediction': 'Heart Disease' if prediction == 1 else 'No Heart Disease',
        'probability': f"{probability:.2f}%"
    })


if __name__ == '__main__':
    #app.run(debug=True)
    app.run()
