export class GeocodingService {
  async getCoordinatesFromAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            latitude: location.lat(),
            longitude: location.lng()
          });
        } else {
          reject(new Error('No location found for this address'));
        }
      });
    });
  }
}