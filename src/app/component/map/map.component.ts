import { Component, OnInit, signal } from "@angular/core";
import { LeafletDirective } from "@bluehalo/ngx-leaflet";
import * as L from 'leaflet';
import { worldGeoJSON } from "../../../assets/world-110m.geojson";

@Component({
  selector: 'app-map',
  imports: [LeafletDirective],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  mapOptions: any;
  map!: L.Map;
  geoJsonLayer!: L.GeoJSON<any>;
  //visitedCountries = new Set<string>();
  //visitedCountries: string[] = []
  visitedCountries = signal([] as string[])


  ngOnInit() {
    this.mapOptions = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 10,
          minZoom: 3,
          attribution: '© OpenStreetMap contributors'
        })
      ],
      zoom: 1,
      center: L.latLng(20, 0)
    };
  }

  onMapReady(map: L.Map) {
    this.map = map;

    this.geoJsonLayer = L.geoJSON(worldGeoJSON as any, {
      style: (feature) => ({
        color: 'gray',
        weight: 1,
        fillOpacity: 0.4,
        fillColor: this.find(feature?.properties?.name)
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
    const countryName = feature.properties.name;
    console.log('before: ', this.visitedCountries())

    if (this.find(countryName)) {
      this.deleteFromSet(countryName);
      layer.setStyle({ fillColor: 'lightgray' });
    } else {
      this.addToSet(countryName);
      layer.setStyle({ fillColor: 'green' });
    }
    console.log('after: ', this.visitedCountries())
  }

  private addToSet(countryName: string) {
    this.visitedCountries().push(countryName)
    this.visitedCountries.set([...this.visitedCountries()])
    //this.visitedCountries = [...this.visitedCountries]
  }

  private deleteFromSet(countryName: string) {
    this.visitedCountries.set(this.visitedCountries().filter(i => i !== countryName))
  }

  private find(countryName?: string): boolean {
    if (countryName) {
      return this.visitedCountries().find(i => i == countryName) != null
    }
    return false    
  }
}