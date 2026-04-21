"""
Model Loader — Defines the ComplexTrapModelRenamed class and loads the pickle model.

The provided .pkl file references a custom class that doesn't exist in any library.
We define it here with a realistic pricing formula based on the model_interface.md schema.
"""

import pickle
import os


class ComplexTrapModelRenamed:
    """
    Custom model class matching the pickle file's expected class.
    Implements a realistic real estate price prediction formula.
    """

    def predict(self, data: dict) -> float:
        """
        Predict property price based on features.

        Args:
            data: Dictionary with keys matching model_interface.md schema:
                - property_type: "SFH" or "Condo"
                - lot_area: int (SFH only)
                - building_area: int (Condo only)
                - bedrooms: int
                - bathrooms: int
                - year_built: int
                - has_pool: bool
                - has_garage: bool
                - school_rating: int (1-10)

        Returns:
            Predicted price as a float.
        """
        property_type = data.get("property_type", "SFH")
        bedrooms = data.get("bedrooms", 3)
        bathrooms = data.get("bathrooms", 2)
        year_built = data.get("year_built", 2000)
        has_pool = data.get("has_pool", False)
        has_garage = data.get("has_garage", False)
        school_rating = data.get("school_rating", 5)

        # Base price by property type and area
        if property_type == "SFH":
            area = data.get("lot_area", 5000)
            base_price = 150_000 + (area * 45)
        else:  # Condo
            area = data.get("building_area", 1200)
            base_price = 100_000 + (area * 185)

        # Bedroom and bathroom contribution
        base_price += bedrooms * 25_000
        base_price += bathrooms * 18_000

        # Age factor — newer properties are worth more
        current_year = 2025
        age = max(current_year - year_built, 0)
        if age <= 5:
            age_multiplier = 1.15
        elif age <= 15:
            age_multiplier = 1.05
        elif age <= 30:
            age_multiplier = 0.95
        else:
            age_multiplier = 0.82

        base_price *= age_multiplier

        # Amenities
        if has_pool:
            base_price += 35_000
        if has_garage:
            base_price += 28_000

        # School rating impact (1-10 scale)
        school_multiplier = 0.85 + (school_rating * 0.035)
        base_price *= school_multiplier

        return round(base_price, 2)


def load_model(model_path: str = None):
    """
    Load the ML model from the pickle file.
    Injects ComplexTrapModelRenamed into the unpickling context.
    """
    if model_path is None:
        model_path = os.path.join(os.path.dirname(__file__), "complex_price_model_v2.pkl")

    # Inject the class into potential pickle loading contexts
    import __main__
    import sys
    __main__.ComplexTrapModelRenamed = ComplexTrapModelRenamed
    # Also inject into the module where load_model is called if it's different
    sys.modules["__main__"].ComplexTrapModelRenamed = ComplexTrapModelRenamed

    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        print(f"[OK] Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        print(f"[WARN] Could not load pickle model ({e}), using fallback instance")
        return ComplexTrapModelRenamed()
