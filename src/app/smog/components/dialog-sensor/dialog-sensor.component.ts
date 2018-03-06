import { SensorsService } from './../../service/sensors/sensors.service';
import { City } from './../../service/model/city';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { CitySensorsStore } from './../../service/sensors/city-sensors-store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { pluck, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-sensor',
  templateUrl: './dialog-sensor.component.html',
  styleUrls: ['./dialog-sensor.component.scss']
})
export class DialogSensorComponent implements OnInit, OnDestroy {


  display = false;
  subscriptionModal: Subscription;
  titleModal: string;
  citySensorsSubscription: Subscription;
  idSensorsList: number[];
  constructor(
    private citySensorsStore: CitySensorsStore,
    private sensorsService: SensorsService
  ) {
  }

  ngOnInit() {
    this.subscriptionModal = this.citySensorsStore.state$.pipe(pluck('modalOpen')).subscribe((isOpen: boolean) => {
      if (isOpen) {
        this.showDialog(isOpen);
      }
    });
    this.citySensorsSubscription = this.citySensorsStore.state$.pipe(
      map(s => s.city),
      distinctUntilChanged())
      .subscribe((city: City) => {
        if (city) {
          this.idSensorsList = [];
          this.titleModal = city.city;
          city.sensors.forEach(sensor => {
            this.idSensorsList.push(sensor.id);
            console.log(this.idSensorsList);
          });
          this.sensorsService.readSensorsAllInformation(this.idSensorsList);
        }
      });
  }

  showDialog(display: boolean) {
    this.display = display;

  }
  close() {
    this.display = false;
    this.citySensorsStore.resetCitiesSensors();
  }

  ngOnDestroy(): void {
    this.subscriptionModal.unsubscribe();
    this.citySensorsSubscription.unsubscribe();
  }

}
