import { Component } from '@angular/core';
import { MapComponent } from "./component/map/map.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [MapComponent],
})
export class AppComponent {}