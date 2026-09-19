def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Jane Forester",
            "email": "jane@darukaa.earth",
            "password": "SecurePassword123!",
            "role": "admin",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "jane@darukaa.earth"
    assert "tokens" in data
    assert "access_token" in data["tokens"]
    assert "refresh_token" in data["tokens"]


def test_register_duplicate_email(client):
    payload = {
        "name": "First User",
        "email": "duplicate@darukaa.earth",
        "password": "SecurePassword123!",
        "role": "admin",
    }
    r1 = client.post("/api/auth/register", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/api/auth/register", json=payload)
    assert r2.status_code == 400
    assert "already exists" in r2.json()["detail"]


def test_login_success(client, test_admin):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_admin.email,
            "password": "AdminPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["id"] == test_admin.id
    assert "tokens" in data
    assert "access_token" in data["tokens"]


def test_login_invalid_password(client, test_admin):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_admin.email,
            "password": "WrongPassword!",
        },
    )
    assert response.status_code == 401


def test_refresh_token(client, test_admin):
    login_resp = client.post(
        "/api/auth/login",
        json={
            "email": test_admin.email,
            "password": "AdminPass123!",
        },
    )
    refresh_token = login_resp.json()["tokens"]["refresh_token"]

    refresh_resp = client.post(
        "/api/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_resp.status_code == 200
    data = refresh_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_get_current_user_profile(client, auth_headers, test_admin):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_admin.id
    assert data["email"] == test_admin.email
