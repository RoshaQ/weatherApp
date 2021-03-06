import { ButtonModule } from 'primeng/primeng';
import { CitySensorsStore } from './service/sensors/city-sensors-store';
import { DataTableModule } from 'primeng/datatable';
import { TableModule } from 'primeng/table';
import { SensorsService } from './service/sensors/sensors.service';
import { SensorsStore } from './service/sensors/sensors-store';
import { AppComponent } from './../app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SmogService } from './service/smog.service';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartpageComponent } from './components/startpage/startpage.component';
import { MapPolandService } from './service/map-poland/map-poland.service';
import { VoivodenshipsStore } from './service/map-poland/voivodenships-store';
import { SensorsAdapter } from './service/sensors/sensors.adapter';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { MapComponent } from './components/startpage/map/map.component';
import { TableVoivodeshipComponent } from './components/startpage/table-voivodeship/table-voivodeship.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GMapModule } from 'primeng/gmap';
import { DialogSensorComponent } from './components/dialog/dialog-sensor/dialog-sensor.component';
import { GmapComponent } from './components/dialog/gmap/gmap.component';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    DataTableModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ChartModule,
    ButtonModule,
    TabViewModule,
    GMapModule,
    MDBBootstrapModule.forRoot(),
  ],
  declarations: [MapComponent, TableVoivodeshipComponent, StartpageComponent, DialogSensorComponent, DialogComponent, GmapComponent],
  exports: [MapComponent, TableVoivodeshipComponent, StartpageComponent],
  providers: [
    HttpClientModule,
    VoivodenshipsStore,
    SensorsStore,
    SensorsService,
    SmogService,
    MapPolandService,
    SensorsAdapter,
    CitySensorsStore],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SmogModule { }

