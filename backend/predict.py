from flask import request, jsonify

import pickle

def predict():
    with open('trained_model.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    try:
        # Get input values from the JSON request
        data = request.get_json()
        values = [data['length'], data['width'], data['height']]

        # Make predictions using the loaded model
        predicted_value = model.predict([values])[0]

        # Convert the NumPy array to a Python list
        predicted_value = predicted_value.tolist()

        # Return the predicted value as JSON
        return jsonify({'predicted_value': predicted_value})

    except Exception as e:
        return jsonify({'error': str(e)})



def predictToolDia():
    with open('toolDia.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    try:
        # Get input values from the JSON request
        data = request.get_json()
        length = float(data['length'])  # Convert to float
        width = float(data['width'])     # Convert to float
        values = [length, width]

        # Make predictions using the loaded model
        predicted_value = model.predict([values])[0]

        # Round the predicted value
        predicted_value = [round(value, 2) for value in predicted_value]

        print(predicted_value)
        # Return the predicted value as JSON
        return jsonify({'predicted_value': predicted_value})

    except Exception as e:
        return jsonify({'error': str(e)})