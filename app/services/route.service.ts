export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export class RouteService {
  async generateRoute(startPoint: RoutePoint, distance: number): Promise<RoutePoint[]> {
    const route: RoutePoint[] = [];
    const earthRadius = 6371; // km
    const distanceInKm = distance / 1000;
    
    // Generate a more random circular route
    const numPoints = 20;
    const baseRadius = distanceInKm / (2 * Math.PI);
    
    // Add start point
    route.push({ ...startPoint });
    
    // Generate random waypoints
    for (let i = 1; i < numPoints - 1; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      // Add some randomness to the radius
      const radiusVariation = (Math.random() * 0.4 + 0.8) * baseRadius;
      // Add some random variation to the angle
      const angleVariation = angle + (Math.random() * 0.2 - 0.1);
      
      const lat = startPoint.latitude + 
        (radiusVariation / earthRadius) * 
        Math.cos(angleVariation) * (180 / Math.PI);
      const lng = startPoint.longitude + 
        (radiusVariation / earthRadius) * 
        Math.sin(angleVariation) * (180 / Math.PI) / 
        Math.cos(startPoint.latitude * Math.PI / 180);
      
      route.push({ latitude: lat, longitude: lng });
    }
    
    // Add end point (same as start)
    route.push({ ...startPoint });
    
    return route;
  }
}