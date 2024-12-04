export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export class RouteService {
  async generateRoute(startPoint: RoutePoint, distance: number): Promise<RoutePoint[]> {
    const route: RoutePoint[] = [];
    const earthRadius = 3959; // miles (changed from 6371 km)
    const distanceInMiles = distance / 1609.34; // Convert meters to miles
    
    const numPoints = 20;
    const baseRadius = distanceInMiles / (2 * Math.PI);
    
    route.push({ ...startPoint });
    
    for (let i = 1; i < numPoints - 1; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const radiusVariation = (Math.random() * 0.4 + 0.8) * baseRadius;
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
    
    route.push({ ...startPoint });
    
    return route;
  }
}