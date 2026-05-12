import pickle
import sys
import os

# 1. We must define the class the pickle expects, or it will crash
class ComplexTrapModelRenamed:
    def predict(self, data):
        return 0.0

# 2. Inject it into the main namespace
import __main__
__main__.ComplexTrapModelRenamed = ComplexTrapModelRenamed

# 3. Path to your model
model_path = "api/complex_price_model_v2.pkl"

try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    
    print("--- Model Information ---")
    print(f"Object Type: {type(model)}")
    
    # Try to see attributes of the model
    print(f"Attributes: {dir(model)}")
    
except Exception as e:
    print(f"Error opening model: {e}")
