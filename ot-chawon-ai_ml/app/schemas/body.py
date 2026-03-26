from pydantic import BaseModel, Field
from typing import Literal


class BodyInput(BaseModel):
    height_cm: float = Field(..., gt=0, le=300, description="키 (cm)")
    weight_kg: float = Field(..., gt=0, le=500, description="몸무게 (kg)")
    gender: Literal["male", "female"] = Field(..., description="성별")
    shoulder_cm: float = Field(..., gt=0, le=200, description="어깨너비 (cm)")
    chest_cm: float = Field(..., gt=0, le=300, description="가슴둘레 (cm)")
    waist_cm: float = Field(..., gt=0, le=300, description="허리둘레 (cm)")
    hip_cm: float = Field(..., gt=0, le=300, description="엉덩이둘레 (cm)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "height_cm": 175.0,
                "weight_kg": 68.0,
                "gender": "male",
                "shoulder_cm": 44.0,
                "chest_cm": 96.0,
                "waist_cm": 80.0,
                "hip_cm": 95.0,
            }
        }
    }
