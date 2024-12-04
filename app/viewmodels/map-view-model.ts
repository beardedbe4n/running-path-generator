import { Observable } from '@nativescript/core';
import { LocationService } from '../services/location.service';
import { RouteService, RoutePoint } from '../services/route.service';
import { GeocodingService } from '../services/geocoding.service';

export class MapViewModel extends Observable {
  private locationService: LocationService;
  private routeService: RouteService;
  private geocodingService: GeocodingService;
  private _currentLocation: RoutePoint | null = null;
  private _route: RoutePoint[] = [];
  private _distance: number = 5000; // Default 5km
  private _address: string = '';
  private _isLoading: boolean = false;

  constructor() {
    super();
    this.locationService = new LocationService();
    this.routeService = new RouteService();
    this.geocodingService = new GeocodingService();
    // Set default location (New York City)
    this._currentLocation = {
      latitude: 40.7128,
      longitude: -74.0060
    };
  }

  async initializeMap() {
    try {
      await this.useCurrentLocation();
    } catch (error) {
      console.error('Failed to get initial location:', error);
    }
  }

  get currentLocation(): RoutePoint {
    return this._currentLocation || {
      latitude: 40.7128,
      longitude: -74.0060
    };
  }

  get route(): RoutePoint[] {
    return this._route;
  }

  get distance(): number {
    return this._distance;
  }

  get address(): string {
    return this._address;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set distance(value: number) {
    if (this._distance !== value) {
      this._distance = value;
      this.notifyPropertyChange('distance', value);
    }
  }

  set address(value: string) {
    if (this._address !== value) {
      this._address = value;
      this.notifyPropertyChange('address', value);
    }
  }

  set isLoading(value: boolean) {
    if (this._isLoading !== value) {
      this._isLoading = value;
      this.notifyPropertyChange('isLoading', value);
    }
  }

  async setLocationFromAddress() {
    if (!this._address) return;

    try {
      this.isLoading = true;
      const location = await this.geocodingService.getCoordinatesFromAddress(this._address);
      this._currentLocation = location;
      this.notifyPropertyChange('currentLocation', this._currentLocation);
    } catch (error) {
      console.error('Failed to get location from address:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async useCurrentLocation() {
    try {
      this.isLoading = true;
      const location = await this.locationService.getCurrentLocation();
      this._currentLocation = {
        latitude: location.latitude,
        longitude: location.longitude
      };
      this.notifyPropertyChange('currentLocation', this._currentLocation);
    } catch (error) {
      console.error('Failed to get current location:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async generateRoute() {
    if (!this._currentLocation) return;

    try {
      this.isLoading = true;
      this._route = await this.routeService.generateRoute(
        this._currentLocation,
        this._distance
      );
      this.notifyPropertyChange('route', this._route);
    } catch (error) {
      console.error('Failed to generate route:', error);
    } finally {
      this.isLoading = false;
    }
  }
}