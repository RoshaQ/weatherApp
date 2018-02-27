import { NavbarComponent } from './navbar/navbar.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class CoreModule { }
