export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface SiteGeoJSONProperties {
  id: string;
  project_id: string;
  name: string;
  area: number;
  ecosystem_type: string;
  status: string;
  carbon_score: number;
  biodiversity_score: number;
  vegetation_index: number;
}

export interface SiteGeoJSONFeature {
  type: 'Feature';
  id: string;
  geometry: GeoJSONPolygon;
  properties: SiteGeoJSONProperties;
}

export interface SiteGeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: SiteGeoJSONFeature[];
}
