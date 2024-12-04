import { Geocoding } from 'nativescript-geocoding';

export class GeocodingService {
  async getCoordinatesFromAddress(address: string) {
    try {
      const locations = await Geocoding.geocode(address);
      if (locations && locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude
        };
      }
      throw new Error('No location found for this address');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
}