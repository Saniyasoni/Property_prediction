"""
Property Prediction — Property Comparison & Price Prediction API

Endpoints:
    POST /api/compare    — Compare two properties by address
    GET  /api/addresses  — List all available mock addresses
    GET  /health         — Health check
"""

import sys
import os

# Ensure the 'api' directory is in the path so local imports work on Vercel
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.append(api_dir)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model_loader import load_model
from property_service import get_property, get_all_addresses

# --- App Setup ---
app = FastAPI(
    title="Property Prediction API",
    description="Property comparison and price prediction service",
    version="1.0.0",
)

# CORS — allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML model at startup
model = load_model()


# --- Request / Response Models ---
class CompareRequest(BaseModel):
    address1: str
    address2: str


class PropertyResult(BaseModel):
    address: str
    property_type: str
    lot_area: int
    building_area: int
    bedrooms: int
    bathrooms: int
    year_built: int
    has_pool: bool
    has_garage: bool
    school_rating: int
    predicted_price: float


class CompareResponse(BaseModel):
    property1: PropertyResult
    property2: PropertyResult


# --- Endpoints ---
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "model_loaded": model is not None}


@app.get("/api/addresses")
@app.get("/addresses")
async def list_addresses():
    """Return all available mock property addresses."""
    return {"addresses": get_all_addresses()}


@app.post("/api/compare", response_model=CompareResponse)
@app.post("/compare", response_model=CompareResponse)
async def compare_properties(request: CompareRequest):
    """
    Compare two properties by address.
    Looks up property data, runs price prediction, returns side-by-side results.
    """
    if not request.address1.strip() or not request.address2.strip():
        raise HTTPException(status_code=400, detail="Both addresses are required")

    # Get property data
    prop1 = get_property(request.address1)
    prop2 = get_property(request.address2)

    # Build model input (exclude address, include only model schema fields)
    model_fields = [
        "property_type", "lot_area", "building_area",
        "bedrooms", "bathrooms", "year_built",
        "has_pool", "has_garage", "school_rating",
    ]

    input1 = {k: prop1[k] for k in model_fields}
    input2 = {k: prop2[k] for k in model_fields}

    # Predict prices
    price1 = model.predict(input1)
    price2 = model.predict(input2)

    return CompareResponse(
        property1=PropertyResult(**prop1, predicted_price=price1),
        property2=PropertyResult(**prop2, predicted_price=price2),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=8000, reload=True)
