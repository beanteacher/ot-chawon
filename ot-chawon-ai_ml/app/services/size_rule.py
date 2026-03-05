def predict_size(height_cm: float) -> str:
    return 'M' if height_cm < 175 else 'L'
