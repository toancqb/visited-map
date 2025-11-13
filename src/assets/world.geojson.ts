export const worldGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { ADMIN: 'France' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.0, 51.0], [2.5, 42.3], [7.0, 43.8], [2.0, 51.0]]]
      }
    },
    {
      type: 'Feature',
      properties: { ADMIN: 'Germany' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[5.5, 47.2], [15.0, 47.5], [15.0, 55.0], [5.5, 47.2]]]
      }
    }
  ]
};