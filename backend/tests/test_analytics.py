def test_site_analytics_timeseries(client, auth_headers):
    # Create project and site
    proj_resp = client.post(
        "/api/projects",
        headers=auth_headers,
        json={"name": "Daintree Rainforest Trust", "description": "Queensland ancient forest protection"},
    )
    proj_id = proj_resp.json()["id"]

    site_resp = client.post(
        "/api/sites",
        headers=auth_headers,
        json={
            "project_id": proj_id,
            "name": "Cooper Creek Basin",
            "ecosystem_type": "Tropical Rainforest",
            "status": "Active",
            "polygon": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [145.410, -16.150],
                        [145.450, -16.150],
                        [145.460, -16.190],
                        [145.420, -16.200],
                        [145.390, -16.170],
                        [145.410, -16.150],
                    ]
                ],
            },
        },
    )
    site_id = site_resp.json()["id"]

    # Request site analytics
    analytics_resp = client.get(f"/api/analytics/site/{site_id}", headers=auth_headers)
    assert analytics_resp.status_code == 200
    analytics_data = analytics_resp.json()
    assert analytics_data["site_id"] == site_id
    assert len(analytics_data["trends"]) >= 12
    assert "carbon_score" in analytics_data["current_metrics"]
    assert "summary_stats" in analytics_data

    # Request project analytics
    proj_analytics_resp = client.get(f"/api/analytics/project/{proj_id}", headers=auth_headers)
    assert proj_analytics_resp.status_code == 200
    p_data = proj_analytics_resp.json()
    assert p_data["project_id"] == proj_id
    assert len(p_data["site_comparisons"]) == 1
    assert "Tropical Rainforest" in p_data["ecosystem_breakdown"]


def test_overview_kpis(client, auth_headers):
    resp = client.get("/api/analytics/overview", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_projects" in data
    assert "total_sites" in data
    assert "total_area_hectares" in data
    assert "total_carbon_sequestered" in data
