import { EventData, Page } from '@nativescript/core';
import { MapViewModel } from '../viewmodels/map-view-model';
import { MapView, Polyline, Marker } from '@nativescript/google-maps';

let mapView: MapView;

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new MapViewModel();
}

export function onMapReady(args: EventData) {
    mapView = args.object as MapView;
    const vm = mapView.page.bindingContext as MapViewModel;
    
    // Initialize map with current location
    vm.initializeMap();
    
    // Watch for route changes
    vm.on('propertyChange', (data: any) => {
        if (data.propertyName === 'route' && mapView) {
            drawRoute(vm.route);
        } else if (data.propertyName === 'currentLocation' && mapView) {
            updateMapCenter(vm.currentLocation);
        }
    });
}

function updateMapCenter(location: { latitude: number; longitude: number }) {
    if (mapView && location) {
        mapView.latitude = location.latitude;
        mapView.longitude = location.longitude;
        mapView.zoom = 15;
    }
}

function drawRoute(route: any[]) {
    if (!mapView) return;
    
    mapView.removeAllShapes();
    
    if (route && route.length > 0) {
        const points = route.map(point => ({
            lat: point.latitude,
            lng: point.longitude
        }));
        
        const polyline = new Polyline();
        polyline.points = points;
        polyline.color = '#4285F4';
        polyline.width = 5;
        
        mapView.addPolyline(polyline);
        
        // Add markers for start and end
        const startMarker = new Marker();
        startMarker.position = points[0];
        startMarker.title = 'Start';
        mapView.addMarker(startMarker);
        
        const endMarker = new Marker();
        endMarker.position = points[points.length - 1];
        endMarker.title = 'Finish';
        mapView.addMarker(endMarker);
    }
}