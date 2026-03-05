from app.services.size_rule import predict_size


def test_predict_size_m():
    assert predict_size(170) == 'M'


def test_predict_size_boundary_m():
    assert predict_size(174.99) == 'M'


def test_predict_size_boundary_l():
    assert predict_size(175) == 'L'


def test_predict_size_l():
    assert predict_size(180) == 'L'
