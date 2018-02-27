import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { StartpageComponent } from './smog/components/startpage/startpage.component';
import { MapComponent } from './smog/components/map/map.component';
import { TableVoivodeshipComponent } from './smog/components/table-voivodeship/table-voivodeship.component';
import { SmogModule } from './smog/smog.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { DataTableModule } from 'primeng/datatable';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    DataTableModule,
    SmogModule,
    CoreModule
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
