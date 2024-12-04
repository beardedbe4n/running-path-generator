import { Accuracy, getCurrentLocation, enableLocationRequest } from '@nativescript/geolocation';

export class LocationService {
  async getCurrentLocation() {
    try {
      await enableLocationRequest();
      const location = await getCurrentLocation({
        desiredAccuracy: Accuracy.high,
        maximumAge: 5000,
        timeout: 20000
      });
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }
}