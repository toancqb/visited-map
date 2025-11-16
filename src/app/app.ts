import { Component } from '@angular/core';
import { MapComponent } from "./component/map/map.component";
import { VisitedMapComponent } from './component/visited-map/visited-map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [VisitedMapComponent],
})
export class AppComponent {}