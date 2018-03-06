import { SensorAllInformationTo } from './../model/sensorAllInformation-to';
import { SensorTo } from './../model/sensor-to';
import { SensorsAdapter } from './sensors.adapter';
import { Injectable } from '@angular/core';
import { SensorsStore } from './sensors-store';
import { Location } from '../model/location';
import { Logger } from '../../../core/logger';

@Injectable()
export class SensorsService {

  private sensorsAllInformationList: SensorAllInformationTo[];
  constructor(private adapter: SensorsAdapter,
    private store: SensorsStore) { }

  readSensorsList(locationRange: Location) {
    this.store.resetSensorsList();
    this.adapter.readSensorsList(locationRange).subscribe((sensorsList: Array<SensorTo>) => {
      this.store.setSensorsList(sensorsList);
    },
      error => this.onError('Sensors List load with Error'),
      () => this.onCompleted('Sensors List load Completed'));
  }
  readSensorsAllInformation(ids: number[]) {
    this.sensorsAllInformationList = [];
    this.store.resetSensorsInformation();
    ids.forEach((id) => {
      this.adapter.readSensorsAllInformation(id).subscribe((sensor: SensorAllInformationTo) => {
        this.sensorsAllInformationList.push(sensor);
        this.store.setSensorsInformation(this.sensorsAllInformationList);
      });
    });
    this.store.setSensorsInformation(this.sensorsAllInformationList);
  }

  private onCompleted(message: string) {
    Logger.debug(message);
  }

  private onError(message: string) {
    Logger.debug(message);
  }
}
