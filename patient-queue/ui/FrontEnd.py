import streamlit as st
import requests

# Flask API URL (must match Flask port)
API_URL = "http://127.0.0.1:1234/predict" 

st.title("🩺 AI-Powered Wait Time Prediction")
st.write("Enter data and get real-time predictions.")

# Input field for number of patients
num_patients = st.number_input("Enter Number of Patients", min_value=1, value=10, step=1)

# Submit button
if st.button("Predict Wait Time"):
    st.write("🔄 Sending request...")

    # Prepare data for POST request
    data = {"num_patients": num_patients}

    try:
        # Send POST request
        response = requests.post(API_URL, json=data)

        # Check response
        if response.status_code == 200:
            result = response.json()
            st.success(f"Predicted Wait Time: {result['predicted_wait_time']} minutes")
        else:
            st.error(f"Error from API: {response.text}")

    except requests.exceptions.RequestException as e:
        st.error(f"⚠️ Failed to connect to API: {e}")
