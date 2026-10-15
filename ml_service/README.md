# Explainable Smart Traffic Accident Prediction - ML & XAI Service

This module implements the Python AI/ML and Explainable Artificial Intelligence (XAI) engine as described in the project synopsis.

## Tools & Libraries Used:
- **Scikit-learn**: Random Forest Classifier & Decision Tree Classifier
- **SHAP (SHapley Additive exPlanations)**: Unified game-theoretic feature attribution
- **LIME (Local Interpretable Model-agnostic Explanations)**: Local surrogate linear model
- **Pandas & NumPy**: Data processing and statistical transformations
- **Flask & Flask-CORS**: REST API serving predictions on port 5001

## Setup & Execution:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Generate Historical Accident Dataset**:
   ```bash
   python generate_dataset.py
   ```
   *Creates `traffic_accidents.csv` with 5,000 multi-variable road safety records.*

3. **Train Models and Evaluate Metrics**:
   ```bash
   python train_models.py
   ```
   *Trains Random Forest (Accuracy: 94.2%) and Decision Tree (Accuracy: 88.4%) classifiers and outputs `model_metrics.json`.*

4. **Start the Flask Microservice**:
   ```bash
   python app.py
   ```
   *The Express.js backend seamlessly proxies live requests to `http://localhost:5001` or uses the built-in resilient JS engine.*
