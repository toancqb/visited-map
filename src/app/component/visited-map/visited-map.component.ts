import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { worldGeoJSON } from "../../../assets/world-110m.geojson";
import { NgFor, NgIf } from '@angular/common';

interface Country {
  name: string;
  code: string;
  visited: boolean;
}

@Component({
  selector: 'app-visited-map',
  templateUrl: './visited-map.component.html',
  styleUrls: ['./visited-map.component.css'],
  imports: [NgIf, NgFor]
})
export class VisitedMapComponent implements OnInit {
  private map!: L.Map;
  private geoJsonLayer!: L.GeoJSON;
  visitedCountries: Country[] = [];
  
  ngOnInit(): void {
    this.initMap();
    this.loadCountriesGeoJSON();
  }

  private initMap(): void {
    // Initialize the map
    this.map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      noWrap: true
    }).addTo(this.map);
  }

  private loadCountriesGeoJSON(): void {
    this.geoJsonLayer = L.geoJSON(worldGeoJSON as any, {
          style: (feature) => this.getCountryStyle(feature),
          onEachFeature: (feature, layer) => this.onEachCountry(feature, layer)
        }).addTo(this.map);
  }

  private getCountryStyle(feature: any): L.PathOptions {
    const countryCode = feature.properties.name;
    const isVisited = this.isCountryVisited(countryCode);
    
    return {
      fillColor: isVisited ? '#4CAF50' : '#e0e0e0',
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: isVisited ? 0.7 : 0.5
    };
  }

  private onEachCountry(feature: any, layer: L.Layer): void {
    const countryName = feature.properties.name;
    const countryCode = feature.properties.name;

    // Add hover effect
    layer.on({
      //mouseover: (e) => this.highlightCountry(e),
      //mouseout: (e) => this.resetHighlight(e),
      click: (e) => this.toggleCountryVisited(countryName, countryCode, e, feature)
    });

    // Bind popup
    layer.bindPopup(`<strong>${countryName}</strong><br>Click to mark as visited`);
  }

  private highlightCountry(e: L.LeafletMouseEvent): void {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#333',
      fillOpacity: 0.9
    });
    layer.bringToFront();
  }

  private resetHighlight(e: L.LeafletMouseEvent): void {
    this.geoJsonLayer.resetStyle(e.target);
  }

  private toggleCountryVisited(name: string, code: string, e: L.LeafletMouseEvent, feature: any): void {
    console.log(feature.properties)
    console.log(feature.properties.ISO_A3)
    const country = this.visitedCountries.find(c => c.code === code);
    
    if (country) {
      // Remove from visited
      this.visitedCountries = this.visitedCountries.filter(c => c.code !== code);
    } else {
      // Add to visited
      this.visitedCountries.push({ name, code, visited: true });
    }

    // Update the layer style
    this.geoJsonLayer.resetStyle(e.target);
    
    // Update popup
    /*const isVisited = this.isCountryVisited(code);
    e.target.bindPopup(
      `<strong>${name}</strong><br>${isVisited ? '✓ Visited' : 'Click to mark as visited'}`
    ).openPopup();
    */

    // Save to localStorage
    this.saveToLocalStorage();
  }

  private isCountryVisited(code: string): boolean {
    return this.visitedCountries.some(c => c.code === code);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('visitedCountries', JSON.stringify(this.visitedCountries));
  }

  private loadFromLocalStorage(): void {
    const saved = localStorage.getItem('visitedCountries');
    if (saved) {
      this.visitedCountries = JSON.parse(saved);
    }
  }

  getVisitedCount(): number {
    return this.visitedCountries.length;
  }

  clearAllVisited(): void {
    this.visitedCountries = [];
    this.saveToLocalStorage();
    if (this.geoJsonLayer) {
      this.geoJsonLayer.eachLayer(layer => {
        this.geoJsonLayer.resetStyle(layer);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}