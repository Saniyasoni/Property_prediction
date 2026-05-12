# 🏡 Property Prediction: ML-Powered Property Intelligence

**Property Prediction** is a full-stack property intelligence platform designed for the **Delhi NCR real estate market**. It transforms unstructured natural language queries into data-driven price predictions and side-by-side property comparisons.

🚀 **Live Demo:** [property-prediction-one.vercel.app](https://property-prediction-one.vercel.app)

---

## 🛠 Technical Approaches

### 1. NLP-Lite Parsing Engine
Instead of basic keyword matching, I developed a custom normalization engine using **Regex and Keyword Scoring**. This allows the system to parse messy user inputs (e.g., *"3bhk flat in Noida Expressway"*) and extract the 9-field numerical schema required for ML inference. I also implemented a **Word Overlap Scoring** system for fuzzy address matching.

### 2. ML-Driven Price Prediction
The core intelligence uses a **Random Forest Regressor**. This model was chosen for its robustness against outliers in the volatile real estate market. It evaluates features like school ratings, building area, and amenity presence to predict fair market value. For unknown addresses, I implemented a **Deterministic Fallback** generator that uses address hashing to create consistent, plausible property data.

### 3. Modern Frontend Architecture
Built with **React 19 and Tailwind CSS**, the UI follows a **Glassmorphism** design system. I prioritized UX by implementing a "Shortlist" feature that persists across sessions using LocalStorage and custom React hooks.

### 4. Unified Monorepo Deployment
To ensure a seamless developer experience and zero-config deployment, I architected the project as a **Flattened Monorepo** on Vercel, using `vercel.json` to bridge the React frontend and FastAPI backend on a single domain.

---

## 🧠 Challenges & Engineering Solutions

### 🔴 The "Pickle Trap" (Class Dependency)
**Challenge:** The provided `.pkl` model file was serialized with a custom Python class (`ComplexTrapModelRenamed`) that wasn't available in standard libraries, causing `AttributeError` during unpickling.
**Solution:** I implemented **Namespace Injection**. By dynamically injecting the class definition into the `__main__` and `sys.modules` namespace at runtime, I successfully unpickled the model without needing the original source code.

### 🔴 Deployment Path Mismatches
**Challenge:** Standard Vercel Python runtimes often clash with React routing, leading to 404s on API endpoints when refreshed.
**Solution:** I configured a robust **Routing Proxy** in `vercel.json`, mapping all `/api/*` requests to the FastAPI entry point while allowing the React SPA to handle client-side routing.

### 🔴 Data Accuracy & Localization
**Challenge:** Real estate data in India (Delhi NCR) is often unstructured and uses specific jargon like "BHK" or "Sectors" which generic models fail to understand.
**Solution:** I curated a **localized dataset** of 40+ properties across Gurgaon, Noida, and South Delhi, ensuring the prediction engine is grounded in realistic, region-specific market trends.

---

## 🏗 Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend:** Python FastAPI, Pydantic, Uvicorn.
- **Machine Learning:** Scikit-learn (Random Forest), Pickle.
- **Infrastructure:** Vercel (Unified Architecture).

---

## 🚀 Quick Start
```bash
# Install dependencies
npm install && pip install -r api/requirements.txt

# Run Frontend & Backend
npm run dev
python api/index.py
```

---
*Developed for technical evaluation as a case study in AI-integrated web applications.*
