import * as turf from '@turf/turf';
import { GeoJSONPolygon } from '../types/geojson';

export const calculateAreaHectares = (polygon: GeoJSONPolygon): number => {
  try {
    const feature = turf.polygon(polygon.coordinates);
    const areaSqMeters = turf.area(feature);
    const ha = areaSqMeters / 10000;
    return Number(ha.toFixed(2));
  } catch (err) {
    console.warn('Could not calculate area:', err);
    return 0;
  }
};

export const getPolygonCenter = (polygon: GeoJSONPolygon): [number, number] => {
  try {
    const feature = turf.polygon(polygon.coordinates);
    const center = turf.centerOfMass(feature);
    return center.geometry.coordinates as [number, number];
  } catch {
    const coords = polygon.coordinates[0] || [];
    if (coords.length > 0) {
      return [coords[0][0], coords[0][1]];
    }
    return [0, 0];
  }
};

export const getPolygonBbox = (polygon: GeoJSONPolygon): [number, number, number, number] => {
  try {
    const feature = turf.polygon(polygon.coordinates);
    return turf.bbox(feature) as [number, number, number, number];
  } catch {
    return [-180, -90, 180, 90];
  }
};
