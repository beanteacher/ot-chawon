from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_size_predict_ok():
    response = client.post('/size/predict', json={
        'height_cm': 172,
        'weight_kg': 70,
        'gender': 'male'
    })
    assert response.status_code == 200


def test_size_predict_invalid_payload_type():
    response = client.post('/size/predict', json={'height_cm': 'bad'})
    assert response.status_code == 422


def test_size_predict_missing_required_field():
    response = client.post('/size/predict', json={'height_cm': 172})
    assert response.status_code == 422
