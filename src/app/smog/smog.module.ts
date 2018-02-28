import { DataTableModule } from 'primeng/datatable';
import { TableModule } from 'primeng/table';
import { SensorsService } from './service/sensors/sensors.service';
import { SensorsStore } from './service/sensors/sensors-store';
import { AppComponent } from './../app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SmogService } from './service/smog.service';
import { TableVoivodeshipComponent } from './components/table-voivodeship/table-voivodeship.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { StartpageComponent } from './components/startpage/startpage.component';
import { MapPolandService } from './service/map-poland/map-poland.service';
import { VoivodenshipsStore } from './service/map-poland/voivodenships-store';
import { SensorsAdapter } from './service/sensors/sensors.adapter';
import { HttpClientModule } from '@angular/common/http';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    DataTableModule,
    ProgressSpinnerModule,
    TableModule
  ],
  declarations: [MapComponent, TableVoivodeshipComponent, StartpageComponent],
  exports: [MapComponent, TableVoivodeshipComponent, StartpageComponent],
  providers: [
    HttpClientModule,
    VoivodenshipsStore,
    SensorsStore,
    SensorsService,
    SmogService,
    MapPolandService,
    SensorsAdapter],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SmogModule { }
