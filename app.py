from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS
import logging

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup logging
logging.basicConfig(level=logging.INFO)

# Load the trained model
model_path = 'wait_time_model.pkl'
try:
    model = joblib.load(model_path)
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load model: {e}")
    model = None

# API to check if the server is running
@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'Flask API is running'})

# Wait-Time Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict_wait_time():
    try:
        data = request.get_json()
        features = np.array(data['num_patients']).reshape(1, -1)
        prediction = model.predict(features)[0]
        result = {'predicted_wait_time': round(prediction, 2)}
        return jsonify(result)
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8182)
