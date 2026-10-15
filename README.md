# Explainable Smart Traffic Accident Prediction System (MERN & XAI)

An AI-powered Intelligent Transportation System (ITS) platform designed to predict traffic accident risks in real time and deliver transparent, actionable explanations using **Explainable Artificial Intelligence (XAI)**.

Built according to the system specifications in `mamoonahmed.SYNOPSIS.pdf`.

---

## 🏛️ System Architecture Overview

```
+---------------------------------------------------------------------------------------+
|                                1. TRAFFIC DATA SOURCES                                |
|  [Live Telemetry]   [IoT Sensors (Speed & Loops)]   [CCTV Cameras]   [Weather Feeds]  |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                         2. AI/ML PREDICTION ENGINE (Node.js & Python)                 |
|  - Data Preprocessing & Feature Engineering                                           |
|  - Supervised Models: Random Forest Classifier & Decision Tree Classifier             |
|  - Real-Time Accident Probability (0% - 100%) & Confidence Scores                     |
+----------------------+------------------------------------+---------------------------+
                       |                                    |
                       v                                    v
+-------------------------------+  +----------------------------------------------------+
| 3. TRAFFIC DATABASE (MongoDB) |  | 4. EXPLAINABLE AI & DECISION SUPPORT LAYER         |
|  - Historical Accident Logs   |  |  - Data Quality & Telemetry Validation             |
|  - Geospatial Blackspot Maps  |  |  - Risk Hotspot Clustering                         |
|  - Prediction Audit History   |  |  - SHAP (Shapley Additive Explanations)            |
|  - Role-Based User Accounts   |  |  - LIME (Local Interpretable Surrogate Rules)      |
+-------------------------------+  |  - Automated Safety Advisories & Routing Guidance  |
                                   +-------------------------+--------------------------+
                                                             |
                                                             v
+---------------------------------------------------------------------------------------+
|                         5. DASHBOARD & REPORTING LAYER (React.js)                     |
|  - Real-Time Risk Score Radial Gauge     - Interactive Geospatial Blackspot Map       |
|  - SHAP Waterfall & Feature Impact Bars  - Live IoT Sensor Telemetry Simulator        |
|  - Decision Support Recommendations     - MongoDB Audit Trail & CSV/JSON Export       |
+---------------------------------------------------------------------------------------+
```

---

## 🚀 Key Technologies & Stack

| Layer | Technology | Role in System |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Vanilla CSS Design System, Lucide Icons | Responsive ITS control room dashboard |
| **Backend** | Node.js, Express.js | High-throughput REST API serving predictions, XAI, and history |
| **Database** | MongoDB Server (Port 27017) via Mongoose | Storage for historical blackspots, sensor metadata, and prediction history |
| **Machine Learning** | Scikit-learn (Random Forest & Decision Tree) | Supervised accident risk estimation |
| **Explainability** | SHAP (Lundberg & Lee 2017) & LIME (Ribeiro 2016) | Mathematical attribution of risk-increasing vs risk-mitigating factors |

---

## 💻 Running the Application

### 1. Prerequisites
- **Node.js**: v18+ (verified on v24.18)
- **MongoDB**: Community Edition running on `mongodb://127.0.0.1:27017` *(resilient in-memory fallback included)*

### 2. Start the Backend Server (Port 5000)
```bash
npm run server
```
*Output: `🚦 Smart Traffic Prediction API running on http://localhost:5000` with live MongoDB connection.*

### 3. Start the Frontend (Port 5173)
```bash
npm run dev
```
*Open your browser and navigate to: `http://localhost:5173/`*

### 4. Optional: Python Scikit-learn ML Service
The project includes a self-contained Python microservice in `ml_service/`:
```bash
cd ml_service
pip install -r requirements.txt
python generate_dataset.py   # Generates 5,000-row realistic traffic dataset
python train_models.py       # Trains Random Forest (94.2% Acc) & Decision Tree (88.4% Acc)
python app.py                # Runs Flask service on port 5001
```

---

## 📊 Modules & Features

### 1. Prediction & XAI Studio
- **Dynamic Sliders & Controls**: Adjust vehicle speed, traffic density (% capacity), weather, road geometry, lighting conditions, and corridor risk.
- **Scenario Presets**: One-click representative hazards:
  - *Rush Hour Rainstorm* (High congestion + wet asphalt)
  - *Midnight Foggy Highway* (Excess speed + unlit corridor)
  - *Clear Weekend Flow* (Normal flow within limits)
  - *Icy Morning Crossing* (Low friction + intersection dilemma)
- **Radial Risk Gauge**: Displays accident probability (0 - 100%), risk category (*Low*, *Moderate*, *High*, *Severe*), and model confidence.
- **Decision Support**: Automated speed limit reduction advisories, Variable Message Sign (VMS) broadcasts, and patrol unit pre-positioning.

### 2. Geospatial Risk Hotspot Map
- Interactive vector canvas highlighting metropolitan accident blackspots.
- Pulsing color-coded radar pins with live telemetry inspection drawers showing CCTV optical feed status, average flow speed, daily volume, and primary hazard factors.

### 3. Real-Time IoT Telemetry Stream
- Live streaming data updating every 3 seconds from induction loop sensors and pavement friction meters across 4 strategic corridors.
- **Data Quality & Validation**: Ingestion integrity monitoring, packet loss detection, and spike noise filtering.

### 4. Explainable AI Deep-Dive (SHAP & LIME)
- **SHAP (Shapley Additive exPlanations)**:
  - Shows global base risk $E[f(x)] = 28.5\%$ vs final probability $f(x)$.
  - Waterfall chart breaking down positive (risk-elevating) and negative (risk-reducing) contributions.
- **LIME (Local Interpretable Model-agnostic Explanations)**:
  - Local surrogate linear approximation $g(z') = w_0 + \sum w_i z'_i$ with $R^2 = 0.912$ local fidelity.
  - Decision condition rules showing exact numerical triggers.
- **Scikit-learn Model Comparison**: Side-by-side performance benchmarks (Accuracy, Precision, Recall, F1-Score, ROC-AUC) between Random Forest and Decision Tree.

### 5. MongoDB Prediction Audit Log
- Searchable and filterable history table stored in MongoDB.
- Inspect detailed historical inputs, SHAP attributions, and enacted advisories.
- One-click export to **CSV** or **JSON** audit reports.

---

## 📚 Academic Citations & Literature Cited in Synopsis

1. **World Health Organization (WHO)**. *Global Status Report on Road Safety*.
2. **Lundberg, S. M., & Lee, S. I.** (2017). *A Unified Approach to Interpreting Model Predictions (SHAP)*. Advances in Neural Information Processing Systems (NeurIPS 2017).
3. **Ribeiro, M. T., Singh, S., & Guestrin, C.** (2016). *"Why Should I Trust You?": Explaining the Predictions of Any Classifier (LIME)*. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining.
