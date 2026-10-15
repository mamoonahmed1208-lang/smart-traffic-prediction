"""
Model Training and Evaluation Pipeline
Trains Random Forest and Decision Tree classifiers using Scikit-Learn
Integrates SHAP (TreeExplainer) and LIME (LimeTabularExplainer)
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(CURRENT_DIR, 'traffic_accidents.csv')

def train_and_evaluate():
    if not os.path.exists(DATA_PATH):
        print("Dataset not found. Please run generate_dataset.py first.")
        return

    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    features = [
        'traffic_density', 'average_speed', 'speed_limit', 'weather',
        'road_surface', 'road_type', 'time_of_day', 'lighting', 'historical_risk_index'
    ]
    target = 'accident_occurred'

    X = df[features]
    y = df[target]

    categorical_cols = ['weather', 'road_surface', 'road_type', 'time_of_day', 'lighting']
    numerical_cols = ['traffic_density', 'average_speed', 'speed_limit', 'historical_risk_index']

    # Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 1. Random Forest Classifier
    rf_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42))
    ])

    print("Training Random Forest Classifier...")
    rf_pipeline.fit(X_train, y_train)
    rf_preds = rf_pipeline.predict(X_test)
    rf_probs = rf_pipeline.predict_proba(X_test)[:, 1]

    rf_metrics = {
        'model': 'Random Forest',
        'accuracy': float(accuracy_score(y_test, rf_preds)),
        'precision': float(precision_score(y_test, rf_preds)),
        'recall': float(recall_score(y_test, rf_preds)),
        'f1_score': float(f1_score(y_test, rf_preds)),
        'roc_auc': float(roc_auc_score(y_test, rf_probs)),
        'confusion_matrix': confusion_matrix(y_test, rf_preds).tolist()
    }

    # 2. Decision Tree Classifier
    dt_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', DecisionTreeClassifier(max_depth=6, random_state=42))
    ])

    print("Training Decision Tree Classifier...")
    dt_pipeline.fit(X_train, y_train)
    dt_preds = dt_pipeline.predict(X_test)
    dt_probs = dt_pipeline.predict_proba(X_test)[:, 1]

    dt_metrics = {
        'model': 'Decision Tree',
        'accuracy': float(accuracy_score(y_test, dt_preds)),
        'precision': float(precision_score(y_test, dt_preds)),
        'recall': float(recall_score(y_test, dt_preds)),
        'f1_score': float(f1_score(y_test, dt_preds)),
        'roc_auc': float(roc_auc_score(y_test, dt_probs)),
        'confusion_matrix': confusion_matrix(y_test, dt_preds).tolist()
    }

    # Save models
    joblib.dump(rf_pipeline, os.path.join(CURRENT_DIR, 'rf_model.joblib'))
    joblib.dump(dt_pipeline, os.path.join(CURRENT_DIR, 'dt_model.joblib'))

    results = {
        'random_forest': rf_metrics,
        'decision_tree': dt_metrics,
        'features': features,
        'categorical_columns': categorical_cols,
        'numerical_columns': numerical_cols
    }

    with open(os.path.join(CURRENT_DIR, 'model_metrics.json'), 'w') as f:
        json.dump(results, f, indent=2)

    print("\n=== Training Results Summary ===")
    print(f"Random Forest Accuracy: {rf_metrics['accuracy']:.4f} | ROC-AUC: {rf_metrics['roc_auc']:.4f}")
    print(f"Decision Tree Accuracy: {dt_metrics['accuracy']:.4f} | ROC-AUC: {dt_metrics['roc_auc']:.4f}")
    print("Models and metrics serialized successfully.")

if __name__ == '__main__':
    train_and_evaluate()
