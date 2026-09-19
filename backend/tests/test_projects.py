def test_create_and_read_project(client, auth_headers):
    # Create project
    create_resp = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "Borneo Peatland Protection",
            "description": "Conservation of tropical peat swamp forest in Central Kalimantan",
        },
    )
    assert create_resp.status_code == 201
    proj_data = create_resp.json()
    proj_id = proj_data["id"]
    assert proj_data["name"] == "Borneo Peatland Protection"
    assert proj_data["summary"]["site_count"] == 0

    # List projects
    list_resp = client.get("/api/projects", headers=auth_headers)
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert any(p["id"] == proj_id for p in projects)

    # Get project details
    detail_resp = client.get(f"/api/projects/{proj_id}", headers=auth_headers)
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == proj_id

    # Update project
    update_resp = client.put(
        f"/api/projects/{proj_id}",
        headers=auth_headers,
        json={"name": "Borneo Peatland Restoration Corridor"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Borneo Peatland Restoration Corridor"

    # Delete project
    delete_resp = client.delete(f"/api/projects/{proj_id}", headers=auth_headers)
    assert delete_resp.status_code == 200

    # Verify 404 after delete
    get_again = client.get(f"/api/projects/{proj_id}", headers=auth_headers)
    assert get_again.status_code == 404
