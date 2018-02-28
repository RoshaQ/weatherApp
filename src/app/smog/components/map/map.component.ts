import { City } from './../../service/model/city';
import { SensorAllInformationTo } from './../../service/model/sensorAllInformation-to';
import { SensorTo } from './../../service/model/sensor-to';
import { SensorsStore } from './../../service/sensors/sensors-store';
import { SensorsService } from './../../service/sensors/sensors.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { VoivodenshipsStore } from './../../service/map-poland/voivodenships-store';
import { MapPolandService } from './../../service/map-poland/map-poland.service';
import { Component, OnInit } from '@angular/core';
import { VoivodeshipTo } from '../../service/model/voivodeship-to';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataTableModule } from 'primeng/datatable';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  voivodeshipHover = '';
  selectedVoivodeship: VoivodeshipTo;
  voivodeshipsTable: VoivodeshipTo[];
  sensorsList: SensorTo[];
  cities: City[];
  sensorsList$: Observable<SensorTo[]>;
  voivodenshipList$: Observable<VoivodeshipTo[]>;
  voivodenshipListSubscription: Subscription;
  sensorsListSubscription: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    public mapPolandService: MapPolandService,
    private voivodenshipsStore: VoivodenshipsStore,
    private sensorsService: SensorsService,
    private sensorsStore: SensorsStore
  ) {
    this.voivodeshipsTable = mapPolandService.getVoivodeship();
  }

  ngOnInit() {
    this.selectedVoivodeship = null;
    this.mapPolandService.readVoivodenships();
    this.fillVoivodenshipsList();
    this.fillTable();
    this.isLoading$ = this.sensorsStore.state$.pipe(map((s: any) => s.isLoading), distinctUntilChanged());
  }

  private fillVoivodenshipsList() {
    this.voivodenshipList$ = this.voivodenshipsStore.state$.pipe(map((s: any) => s.voivodenshipsList), distinctUntilChanged());
    this.voivodenshipListSubscription = this.voivodenshipList$.subscribe((voivodenships: VoivodeshipTo[]) => {
      if (voivodenships) {
        this.voivodeshipsTable = voivodenships;
      }
    });
  }

  clicked(voivodeship: any) {
    if (this.selectedVoivodeship == null) {
      this.selectedVoivodeship = voivodeship;
      this.sensorsService.readSensorsList(this.selectedVoivodeship.location);
    } else {
      if (!(this.selectedVoivodeship === voivodeship)) {
        this.selectedVoivodeship = voivodeship;
        this.sensorsService.readSensorsList(this.selectedVoivodeship.location);
      }
    }
  }

  private fillTable() {
    this.selectedVoivodeship = {
      location: {
        southwestLat: '51.67365607907271',
        southwestLong: '2.2584999999999127',
        northeastLat: '56.41488342549234',
        northeastLong: '36.00849999999991',
      }
    };
    this.sensorsService.readSensorsList(this.selectedVoivodeship.location);
    this.sensorsList$ = this.sensorsStore.state$.pipe(
      map((s: any) => s.sensorsList),
      distinctUntilChanged());
      this.sensorsListSubscription = this.sensorsList$.subscribe((sensorsList: SensorTo[]) => {
      if (sensorsList) {
        this.sensorsList = sensorsList;
        this.cities = [];
        this.groupSensorsForCity();
        this.avgPollutionLevelForCity();
      }
    });
  }
  private groupSensorsForCity() {
    this.sensorsList.forEach((sensor) => {
      if (sensor.address.locality && !this.cities.find(city => city.city === sensor.address.locality)) {
        const sensorsTable = [];
        const sensorCity = this.fillCityObject(sensorsTable, sensor);
        this.cities.push(sensorCity);
      } else {
        const indexCity = this.cities.findIndex(city => city.city === sensor.address.locality);
        this.addSensorToTheExistingCity(indexCity, sensor);
      }
    });
  }

  private addSensorToTheExistingCity(indexCity: number, sensor: SensorTo) {
    if (indexCity > -1) {
      const sensorsTable = this.cities[indexCity].sensors;
      const sensorCity = this.fillCityObject(sensorsTable, sensor);
      this.cities[indexCity] = sensorCity;
    }
  }

  private fillCityObject(sensorsTable: SensorTo[], sensor: SensorTo, pollutionLevelAvg?: number) {
    sensorsTable.push(sensor);
    const sensorCity = {
      city: sensor.address.locality,
      sensors: sensorsTable,
      pollutionLevelAvg: 0
    } as City;
    return sensorCity;
  }

  hasVoivodeship(voivodeship: any): boolean {
    return this.selectedVoivodeship === voivodeship;
  }

  avgPollutionLevelForCity() {
    this.cities.forEach(element => {
      element.sensors.forEach(sensor => {
        element.pollutionLevelAvg = element.pollutionLevelAvg + sensor.pollutionLevel;
      });
      element.pollutionLevelAvg = element.pollutionLevelAvg / element.sensors.length;
    });
  }

  ngOnDestroy(): void {
    this.voivodenshipListSubscription.unsubscribe();
    this.sensorsListSubscription.unsubscribe();
  }
}
