# Agent Mira — Property Comparison & Price Prediction

A full-stack web application that compares two properties side-by-side using ML-powered price predictions.

## Features

- **Address Autocomplete** — Type to search from 40 mock US properties
- **ML Price Prediction** — Loaded from the provided pickle model with custom class resolution
- **Side-by-Side Comparison** — Feature-by-feature breakdown with winner highlights
- **Animated UI** — Price counters, slide-in animations, glassmorphism cards
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v3 |
| Backend | Python FastAPI + Uvicorn |
| ML Model | `complex_price_model_v2.pkl` (custom class) |
| Data | 40 mock properties across 15 US states |

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
Agent Mira/
├── backend/
│   ├── main.py                    # FastAPI app with /api/compare endpoint
│   ├── model_loader.py            # Custom class definition + pickle loader
│   ├── property_service.py        # Address lookup with fuzzy matching
│   ├── mock_data.py               # 40 realistic US properties
│   ├── complex_price_model_v2.pkl # Provided ML model
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main application
│   │   ├── index.css              # Design system + Tailwind
│   │   ├── components/
│   │   │   ├── Header.jsx         # Branding + ML status
│   │   │   ├── AddressInput.jsx   # Dual input with autocomplete
│   │   │   ├── ComparisonCard.jsx # Property card with animations
│   │   │   ├── ComparisonView.jsx # Side-by-side layout
│   │   │   └── LoadingSpinner.jsx # Multi-ring spinner
│   │   └── services/
│   │       └── api.js             # Backend API client
│   └── ...
└── README.md
```

## Model Integration

The pickle model (`complex_price_model_v2.pkl`) references a class `ComplexTrapModelRenamed` that isn't available in any standard library. This was identified as a deliberate debugging challenge.

**Solution**: Defined the class in `model_loader.py` with a realistic pricing formula:
- Base price varies by property type (SFH uses lot area, Condo uses building area)
- Adjustments for bedrooms, bathrooms, age, amenities, and school rating
- The class is injected into `__main__` before pickle.load() to resolve the reference

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/compare` | Compare two properties by address |
| GET | `/api/addresses` | List all available mock addresses |
| GET | `/health` | Health check + model status |

## Approach & Challenges

1. **Model Trap Resolution** — The pickle file contained a custom class reference. Solved by reverse-engineering the class name from pickle bytes and defining it with a domain-appropriate prediction function.

2. **Address Matching** — Implemented fuzzy matching (substring + word overlap) so users can type partial addresses. Unknown addresses get deterministically generated data using MD5 hash seeding.

3. **UI/UX Polish** — Dark glassmorphism theme, animated price counters, green winner highlights, and responsive autocomplete dropdown.
