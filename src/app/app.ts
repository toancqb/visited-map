import { AfterViewInit, Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { latLng, tileLayer, geoJSON, Map, Layer, GeoJSON } from 'leaflet';
import * as L from 'leaflet';
import { worldGeoJSON } from '../assets/world-110m.geojson'; // simplified world borders
import { LeafletDirective } from '@bluehalo/ngx-leaflet';

@Component({
  selector: 'app-root',
  //imports: [LeafletDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements AfterViewInit {
  visitedCountries = new Set<string>();
  map!: L.Map;

  ngAfterViewInit() {
    this.map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.geoJSON(worldGeoJSON as any, {
      style: (feature) => ({
        color: 'gray',
        weight: 1,
        fillOpacity: 0.4,
        fillColor: this.visitedCountries.has(feature?.properties?.name)
          ? 'green'
          : 'lightgray'
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () => this.toggleVisited(feature, layer));
        layer.bindTooltip(feature.properties.name);
      }
    }).addTo(this.map);
  }

  toggleVisited(feature: any, layer: any) {
    //console.log(feature)
    const countryName = feature.properties.name;
    if (this.visitedCountries.has(countryName)) {
      this.visitedCountries.delete(countryName);
      layer.setStyle({ fillColor: 'lightgray' });
    } else {
      this.visitedCountries.add(countryName);
      layer.setStyle({ fillColor: 'green' });
    }
    //console.log(this.visitedCountries)
  }
}