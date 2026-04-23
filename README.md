# 🏡 Agent Mira: ML-Powered Property Comparison & Price Prediction

**Agent Mira** is a high-end property intelligence tool designed for the **Delhi NCR real estate market**. It allows users to compare properties side-by-side using unstructured inputs (like "3BHK in Gurgaon") and leverages a **Machine Learning model** to predict fair market prices.

🚀 **Live Demo:** [property-prediction-one.vercel.app](https://property-prediction-one.vercel.app)

---

## ✨ Key Features
- **Smart Property Comparison:** Enter two addresses and get a feature-by-feature breakdown (Bedrooms, Bathrooms, Area, etc.).
- **ML-Driven Price Prediction:** Uses a Random Forest Regressor to estimate market value based on 9 core features.
- **NLP-Lite Input Parsing:** Intelligent search that understands local real estate jargon (BHK, Villa, Apartment).
- **Persistent Shortlist:** Save your favorite properties to a sidebar that persists even after refreshing the page.
- **Premium Glassmorphism UI:** A modern, dark-themed interface built with Tailwind CSS and smooth micro-animations.

---

## 🛠 Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS.
- **Backend:** Python FastAPI (Serverless).
- **Machine Learning:** Scikit-learn (Random Forest), Pickle.
- **Deployment:** Vercel (Unified Monorepo Architecture).

---

## 🏗 Project Structure
```text
/api                <-- Python FastAPI Backend (NLP Engine & ML Inference)
/src                <-- React Frontend (Components, Hooks, Styling)
/public             <-- Static assets
vercel.json         <-- Vercel deployment configuration
package.json        <-- Frontend dependencies
requirements.txt    <-- Backend dependencies
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Start the Backend (Terminal 1)
```bash
# Navigate to the root folder
pip install -r api/requirements.txt
python api/index.py
```

### 3. Start the Frontend (Terminal 2)
```bash
# Navigate to the root folder
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🧠 Machine Learning Model
The core of Agent Mira is a **Random Forest Regressor** trained on a 9-field feature vector:
1. `property_type` (SFH/Condo)
2. `lot_area`
3. `building_area`
4. `bedrooms`
5. `bathrooms`
6. `year_built`
7. `has_pool`
8. `has_garage`
9. `school_rating`

The model is loaded from a `.pkl` file using a custom namespace injection strategy to handle proprietary class structures.

---

## 🌍 Market Localization
The data is currently optimized for the **Delhi NCR** region, including major localities:
- **South Delhi:** Greater Kailash, Vasant Vihar, Saket.
- **Gurgaon:** DLF Phases, Golf Course Road, Sector 56.
- **Noida:** Sector 50, Sector 150, Expressway.

---

## 📜 License
This project was developed as a case study for property intelligence and machine learning integration.
