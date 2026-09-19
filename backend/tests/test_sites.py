def test_create_and_query_site(client, auth_headers):
    # 1. First create a parent project
    proj_resp = client.post(
        "/api/projects",
        headers=auth_headers,
        json={"name": "Costa Rica Cloud Forest", "description": "Monteverde canopy protection"},
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 2. Create a site with polygon coordinates
    polygon_payload = {
        "type": "Polygon",
        "coordinates": [
            [
                [-84.810, 10.310],
                [-84.770, 10.310],
                [-84.760, 10.270],
                [-84.800, 10.265],
                [-84.820, 10.290],
                [-84.810, 10.310],
            ]
        ],
    }
    site_payload = {
        "project_id": project_id,
        "name": "Monteverde High Canopy Sector",
        "ecosystem_type": "Tropical Rainforest",
        "status": "Active",
        "polygon": polygon_payload,
    }
    site_resp = client.post("/api/sites", headers=auth_headers, json=site_payload)
    assert site_resp.status_code == 201
    site_data = site_resp.json()
    site_id = site_data["id"]
    assert site_data["name"] == "Monteverde High Canopy Sector"
    assert site_data["area"] > 0
    assert site_data["metrics"] is not None
    assert site_data["metrics"]["latest_carbon_score"] is not None

    # 3. Query sites filtering by project_id
    sites_list = client.get(f"/api/sites?project_id={project_id}", headers=auth_headers)
    assert sites_list.status_code == 200
    assert len(sites_list.json()) == 1

    # 4. Query sites in GeoJSON FeatureCollection format
    geojson_resp = client.get(f"/api/sites?project_id={project_id}&format=geojson", headers=auth_headers)
    assert geojson_resp.status_code == 200
    fc = geojson_resp.json()
    assert fc["type"] == "FeatureCollection"
    assert len(fc["features"]) == 1
    assert fc["features"][0]["properties"]["name"] == "Monteverde High Canopy Sector"

    # 5. Get site by ID
    get_site = client.get(f"/api/sites/{site_id}", headers=auth_headers)
    assert get_site.status_code == 200
    assert get_site.json()["id"] == site_id

    # 6. Update site
    update_site = client.put(
        f"/api/sites/{site_id}",
        headers=auth_headers,
        json={"name": "Monteverde Cloud Forest Sanctuary", "status": "Monitored"},
    )
    assert update_site.status_code == 200
    assert update_site.json()["name"] == "Monteverde Cloud Forest Sanctuary"

    # 7. Delete site
    del_site = client.delete(f"/api/sites/{site_id}", headers=auth_headers)
    assert del_site.status_code == 200
