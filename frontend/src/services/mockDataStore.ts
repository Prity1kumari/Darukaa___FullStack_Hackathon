import {
  Project,
  Site,
  OverviewKPIs,
  SiteAnalyticsResponse,
  ProjectAnalyticsResponse,
  User,
  AuthResponse,
  SiteGeoJSONFeatureCollection,
} from '../types';

const STORAGE_KEY_PROJECTS = 'darukaa_demo_projects';
const STORAGE_KEY_SITES = 'darukaa_demo_sites';

export const DEMO_USER: User = {
  id: 'usr_admin_default_01',
  name: 'Darukaa Administrator',
  email: 'admin@darukaa.earth',
  role: 'admin',
  created_at: '2026-01-01T00:00:00Z',
};

export const DEMO_AUTH_RESPONSE: AuthResponse = {
  user: DEMO_USER,
  tokens: {
    access_token: 'demo_jwt_access_token_darukaa_2026',
    refresh_token: 'demo_jwt_refresh_token_darukaa_2026',
    token_type: 'bearer',
  },
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_amazon_01',
    name: 'Amazonian Canopy & Peatland Reserve',
    description:
      'Large-scale tropical primary forest conservation and riparian corridor restoration in the South-Western Amazon basin.',
    created_by: DEMO_USER.id,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-03-01T12:00:00Z',
    summary: {
      site_count: 2,
      total_area_hectares: 3420.5,
      avg_carbon_score: 285.4,
      avg_biodiversity_score: 92.1,
      avg_vegetation_index: 0.88,
    },
  },
  {
    id: 'proj_sundarbans_02',
    name: 'Sundarbans Coastal Mangrove Shield',
    description:
      'Tidal blue carbon sequestration and delta biodiversity stabilization across sensitive mangrove delta systems.',
    created_by: DEMO_USER.id,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-03-05T12:00:00Z',
    summary: {
      site_count: 2,
      total_area_hectares: 2180.0,
      avg_carbon_score: 340.2,
      avg_biodiversity_score: 87.5,
      avg_vegetation_index: 0.82,
    },
  },
  {
    id: 'proj_caledonian_03',
    name: 'Caledonian Highlands Rewilding Initiative',
    description:
      'Peat bog re-wetting and native Scots pine regeneration for high-latitude terrestrial carbon storage and raptor return.',
    created_by: DEMO_USER.id,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-03-10T12:00:00Z',
    summary: {
      site_count: 2,
      total_area_hectares: 1850.2,
      avg_carbon_score: 195.8,
      avg_biodiversity_score: 79.4,
      avg_vegetation_index: 0.74,
    },
  },
  {
    id: 'proj_serengeti_04',
    name: 'Serengeti Wildlife & Acacia Corridor',
    description:
      'Savannah soil carbon enhancement, fire management, and megafauna migratory corridor protection.',
    created_by: DEMO_USER.id,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-03-12T12:00:00Z',
    summary: {
      site_count: 2,
      total_area_hectares: 4950.0,
      avg_carbon_score: 142.6,
      avg_biodiversity_score: 89.2,
      avg_vegetation_index: 0.69,
    },
  },
];

const INITIAL_SITES: Site[] = [
  {
    id: 'site_acre_01',
    project_id: 'proj_amazon_01',
    name: 'Acre Old-Growth Primary Zone',
    ecosystem_type: 'Tropical Rainforest',
    status: 'Active',
    area: 1950.0,
    created_at: '2026-01-16T10:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-70.525, -9.120],
          [-70.475, -9.120],
          [-70.465, -9.165],
          [-70.510, -9.185],
          [-70.540, -9.150],
          [-70.525, -9.120],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 310.5,
      latest_biodiversity_score: 94.2,
      latest_vegetation_index: 0.91,
      latest_canopy_cover: 88.5,
      latest_soil_moisture: 42.0,
      last_updated: '2026-03-01T00:00:00Z',
    },
  },
  {
    id: 'site_jurua_02',
    project_id: 'proj_amazon_01',
    name: 'Juruá River Basin Reforestation',
    ecosystem_type: 'Tropical Rainforest',
    status: 'Restoring',
    area: 1470.5,
    created_at: '2026-01-16T11:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-70.380, -9.210],
          [-70.330, -9.200],
          [-70.315, -9.245],
          [-70.365, -9.260],
          [-70.395, -9.235],
          [-70.380, -9.210],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 260.3,
      latest_biodiversity_score: 90.0,
      latest_vegetation_index: 0.85,
      latest_canopy_cover: 76.2,
      latest_soil_moisture: 39.5,
      last_updated: '2026-03-01T00:00:00Z',
    },
  },
  {
    id: 'site_matla_03',
    project_id: 'proj_sundarbans_02',
    name: 'Matla Estuary Blue Carbon Delta',
    ecosystem_type: 'Mangrove',
    status: 'Active',
    area: 1250.0,
    created_at: '2026-01-21T10:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [88.650, 21.920],
          [88.710, 21.935],
          [88.725, 21.880],
          [88.670, 21.865],
          [88.635, 21.895],
          [88.650, 21.920],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 365.0,
      latest_biodiversity_score: 89.1,
      latest_vegetation_index: 0.84,
      latest_canopy_cover: 72.0,
      latest_soil_moisture: 65.0,
      last_updated: '2026-03-05T00:00:00Z',
    },
  },
  {
    id: 'site_gosaba_04',
    project_id: 'proj_sundarbans_02',
    name: 'Gosaba Island Buffer Zone',
    ecosystem_type: 'Mangrove',
    status: 'Restoring',
    area: 930.0,
    created_at: '2026-01-21T11:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [88.780, 22.140],
          [88.830, 22.155],
          [88.845, 22.110],
          [88.790, 22.095],
          [88.765, 22.115],
          [88.780, 22.140],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 315.4,
      latest_biodiversity_score: 85.9,
      latest_vegetation_index: 0.80,
      latest_canopy_cover: 68.4,
      latest_soil_moisture: 62.0,
      last_updated: '2026-03-05T00:00:00Z',
    },
  },
  {
    id: 'site_glen_05',
    project_id: 'proj_caledonian_03',
    name: 'Glen Affric Peat & Pine Plateau',
    ecosystem_type: 'Peatland',
    status: 'Active',
    area: 1100.2,
    created_at: '2026-02-02T10:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-4.980, 57.280],
          [-4.920, 57.290],
          [-4.905, 57.255],
          [-4.960, 57.240],
          [-4.995, 57.260],
          [-4.980, 57.280],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 210.6,
      latest_biodiversity_score: 82.0,
      latest_vegetation_index: 0.76,
      latest_canopy_cover: 45.0,
      latest_soil_moisture: 78.0,
      last_updated: '2026-03-10T00:00:00Z',
    },
  },
  {
    id: 'site_strath_06',
    project_id: 'proj_caledonian_03',
    name: 'Strathglass Native Woodland',
    ecosystem_type: 'Temperate Forest',
    status: 'Monitored',
    area: 750.0,
    created_at: '2026-02-02T11:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-4.820, 57.340],
          [-4.770, 57.350],
          [-4.760, 57.315],
          [-4.810, 57.305],
          [-4.835, 57.320],
          [-4.820, 57.340],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 181.0,
      latest_biodiversity_score: 76.8,
      latest_vegetation_index: 0.72,
      latest_canopy_cover: 62.1,
      latest_soil_moisture: 55.0,
      last_updated: '2026-03-10T00:00:00Z',
    },
  },
  {
    id: 'site_mara_07',
    project_id: 'proj_serengeti_04',
    name: 'Mara River Riparian Sector',
    ecosystem_type: 'Savannah',
    status: 'Active',
    area: 2800.0,
    created_at: '2026-02-16T10:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [34.950, -1.580],
          [35.010, -1.570],
          [35.030, -1.620],
          [34.975, -1.635],
          [34.935, -1.605],
          [34.950, -1.580],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 155.2,
      latest_biodiversity_score: 91.5,
      latest_vegetation_index: 0.71,
      latest_canopy_cover: 38.0,
      latest_soil_moisture: 28.0,
      last_updated: '2026-03-12T00:00:00Z',
    },
  },
  {
    id: 'site_grumeti_08',
    project_id: 'proj_serengeti_04',
    name: 'Grumeti Biomass Reserve',
    ecosystem_type: 'Savannah',
    status: 'Monitored',
    area: 2150.0,
    created_at: '2026-02-16T11:00:00Z',
    polygon_geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [34.420, -2.150],
          [34.480, -2.140],
          [34.495, -2.190],
          [34.440, -2.205],
          [34.405, -2.175],
          [34.420, -2.150],
        ],
      ],
    },
    metrics: {
      latest_carbon_score: 130.0,
      latest_biodiversity_score: 86.9,
      latest_vegetation_index: 0.67,
      latest_canopy_cover: 32.5,
      latest_soil_moisture: 24.5,
      last_updated: '2026-03-12T00:00:00Z',
    },
  },
];

export class MockDataStore {
  private static getProjectsStore(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(data);
  }

  private static getSitesStore(): Site[] {
    const data = localStorage.getItem(STORAGE_KEY_SITES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(INITIAL_SITES));
      return INITIAL_SITES;
    }
    return JSON.parse(data);
  }

  static getProjects(): Project[] {
    return this.getProjectsStore();
  }

  static getProject(id: string): Project & { sites: Site[] } {
    const projects = this.getProjectsStore();
    const proj = projects.find((p) => p.id === id) || projects[0];
    const sites = this.getSitesStore().filter((s) => s.project_id === proj.id);
    return { ...proj, sites };
  }

  static createProject(input: { name: string; description?: string }): Project {
    const projects = this.getProjectsStore();
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: input.name,
      description: input.description,
      created_by: DEMO_USER.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      summary: {
        site_count: 0,
        total_area_hectares: 0,
        avg_carbon_score: 0,
        avg_biodiversity_score: 0,
        avg_vegetation_index: 0,
      },
    };
    projects.push(newProj);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    return newProj;
  }

  static updateProject(id: string, input: { name?: string; description?: string }): Project {
    const projects = this.getProjectsStore();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx >= 0) {
      projects[idx] = { ...projects[idx], ...input, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      return projects[idx];
    }
    return projects[0];
  }

  static deleteProject(id: string): { message: string; id: string } {
    const projects = this.getProjectsStore().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    const sites = this.getSitesStore().filter((s) => s.project_id !== id);
    localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));
    return { message: 'Project deleted successfully', id };
  }

  static getSites(projectId?: string): Site[] {
    const sites = this.getSitesStore();
    if (projectId) return sites.filter((s) => s.project_id === projectId);
    return sites;
  }

  static getSitesGeoJSON(projectId?: string): SiteGeoJSONFeatureCollection {
    const sites = this.getSites(projectId);
    return {
      type: 'FeatureCollection',
      features: sites.map((s) => ({
        type: 'Feature',
        id: s.id,
        geometry: s.polygon_geojson,
        properties: {
          id: s.id,
          project_id: s.project_id,
          name: s.name,
          area: s.area,
          ecosystem_type: s.ecosystem_type,
          status: s.status,
          carbon_score: s.metrics?.latest_carbon_score || 200,
          biodiversity_score: s.metrics?.latest_biodiversity_score || 85,
          vegetation_index: s.metrics?.latest_vegetation_index || 0.75,
        },
      })),
    };
  }

  static getSite(id: string): Site {
    const sites = this.getSitesStore();
    return sites.find((s) => s.id === id) || sites[0];
  }

  static createSite(input: any): Site {
    const sites = this.getSitesStore();
    const newSite: Site = {
      id: `site_${Date.now()}`,
      project_id: input.project_id,
      name: input.name,
      ecosystem_type: input.ecosystem_type || 'Mixed Forest',
      status: input.status || 'Active',
      polygon_geojson: input.polygon,
      area: input.area || 500.0,
      created_at: new Date().toISOString(),
      metrics: {
        latest_carbon_score: 220.0,
        latest_biodiversity_score: 84.0,
        latest_vegetation_index: 0.78,
        latest_canopy_cover: 65.0,
        latest_soil_moisture: 45.0,
        last_updated: new Date().toISOString(),
      },
    };
    sites.push(newSite);
    localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));

    const projects = this.getProjectsStore();
    const projIdx = projects.findIndex((p) => p.id === input.project_id);
    if (projIdx >= 0) {
      const projSites = sites.filter((s) => s.project_id === input.project_id);
      projects[projIdx].summary = {
        site_count: projSites.length,
        total_area_hectares: projSites.reduce((acc, s) => acc + s.area, 0),
        avg_carbon_score:
          Math.round(
            (projSites.reduce((acc, s) => acc + (s.metrics?.latest_carbon_score || 0), 0) /
              projSites.length) *
              10
          ) / 10,
        avg_biodiversity_score:
          Math.round(
            (projSites.reduce((acc, s) => acc + (s.metrics?.latest_biodiversity_score || 0), 0) /
              projSites.length) *
              10
          ) / 10,
        avg_vegetation_index:
          Math.round(
            (projSites.reduce((acc, s) => acc + (s.metrics?.latest_vegetation_index || 0), 0) /
              projSites.length) *
              100
          ) / 100,
      };
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    }

    return newSite;
  }

  static deleteSite(id: string): { message: string; id: string } {
    const sites = this.getSitesStore().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(sites));
    return { message: 'Site deleted successfully', id };
  }

  static getOverview(): OverviewKPIs {
    const projects = this.getProjectsStore();
    const sites = this.getSitesStore();
    const totalArea = sites.reduce((sum, s) => sum + s.area, 0);
    const avgCarbon = sites.length
      ? sites.reduce((sum, s) => sum + (s.metrics?.latest_carbon_score || 0), 0) / sites.length
      : 0;
    const avgBio = sites.length
      ? sites.reduce((sum, s) => sum + (s.metrics?.latest_biodiversity_score || 0), 0) / sites.length
      : 0;
    const avgVeg = sites.length
      ? sites.reduce((sum, s) => sum + (s.metrics?.latest_vegetation_index || 0), 0) / sites.length
      : 0;

    return {
      total_projects: projects.length,
      total_sites: sites.length,
      total_area_hectares: Math.round(totalArea * 10) / 10,
      total_carbon_sequestered: Math.round(avgCarbon * totalArea * 10) / 10,
      average_biodiversity_score: Math.round(avgBio * 10) / 10,
      average_vegetation_index: Math.round(avgVeg * 100) / 100,
    };
  }

  static getSiteAnalytics(siteId: string): SiteAnalyticsResponse {
    const site = this.getSite(siteId);
    const months = 24;
    const trends = [];
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - months);

    let c = (site.metrics?.latest_carbon_score || 250) * 0.82;
    let b = (site.metrics?.latest_biodiversity_score || 85) * 0.85;
    let v = (site.metrics?.latest_vegetation_index || 0.8) * 0.88;

    for (let i = 0; i < months; i++) {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + i);
      c += Math.random() * 5 + 1;
      b += Math.random() * 1.5 + 0.2;
      v += Math.random() * 0.01 + 0.002;
      trends.push({
        timestamp: d.toISOString(),
        carbon_score: Math.round(c * 10) / 10,
        biodiversity_score: Math.min(100, Math.round(b * 10) / 10),
        vegetation_index: Math.min(1.0, Math.round(v * 100) / 100),
        canopy_cover: Math.min(
          95,
          Math.round((site.metrics?.latest_canopy_cover || 70) * (0.8 + i * 0.01))
        ),
        soil_moisture: Math.round(
          (site.metrics?.latest_soil_moisture || 40) + Math.sin(i / 2) * 5
        ),
      });
    }

    return {
      site_id: site.id,
      site_name: site.name,
      area_hectares: site.area,
      ecosystem_type: site.ecosystem_type,
      current_metrics: {
        carbon_score: trends[trends.length - 1].carbon_score,
        biodiversity_score: trends[trends.length - 1].biodiversity_score,
        vegetation_index: trends[trends.length - 1].vegetation_index,
        canopy_cover: trends[trends.length - 1].canopy_cover,
        soil_moisture: trends[trends.length - 1].soil_moisture,
        last_measured: trends[trends.length - 1].timestamp,
      },
      trends,
      summary_stats: {
        carbon_change_pct: 21.4,
        biodiversity_change_pct: 16.8,
        vegetation_change_pct: 12.3,
        records_count: 24,
        first_recorded: trends[0].timestamp,
        latest_recorded: trends[trends.length - 1].timestamp,
      },
    };
  }

  static getProjectAnalytics(projectId: string): ProjectAnalyticsResponse {
    const proj = this.getProject(projectId);
    const sites = this.getSites(projectId);
    const months = 12;
    const aggregate_trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short' });
      aggregate_trends.push({
        month: monthStr,
        avg_carbon_score: Math.round(
          (proj.summary?.avg_carbon_score || 250) * (0.85 + (months - i) * 0.013)
        ),
        avg_biodiversity_score: Math.round(
          (proj.summary?.avg_biodiversity_score || 85) * (0.88 + (months - i) * 0.01)
        ),
        avg_vegetation_index:
          Math.round(
            (proj.summary?.avg_vegetation_index || 0.8) *
              (0.9 + (months - i) * 0.008) *
              100
          ) / 100,
      });
    }

    return {
      project_id: proj.id,
      project_name: proj.name,
      total_area_hectares: proj.summary?.total_area_hectares || 1000,
      total_sites: sites.length,
      aggregate_trends,
      site_comparisons: sites.map((s) => ({
        site_id: s.id,
        site_name: s.name,
        area_hectares: s.area,
        ecosystem_type: s.ecosystem_type,
        carbon_score: s.metrics?.latest_carbon_score || 200,
        biodiversity_score: s.metrics?.latest_biodiversity_score || 85,
        vegetation_index: s.metrics?.latest_vegetation_index || 0.75,
      })),
      ecosystem_breakdown: {
        [sites[0]?.ecosystem_type || 'Tropical Rainforest']: sites.length,
      },
    };
  }
}
