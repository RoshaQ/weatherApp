import { element } from 'protractor';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataTableModule } from 'primeng/datatable';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VoivodeshipTo } from '../../../service/model/voivodeship-to';
import { SensorTo } from '../../../service/model/sensor-to';
import { City } from '../../../service/model/city';
import { MapPolandService } from '../../../service/map-poland/map-poland.service';
import { VoivodenshipsStore } from '../../../service/map-poland/voivodenships-store';
import { SensorsService } from '../../../service/sensors/sensors.service';
import { SensorsStore } from '../../../service/sensors/sensors-store';
import { roundValue } from '../../../../core/round/round-value';
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

  allPoland() {
    this.fillTable();
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
        southwestLat: '48.23317386736747',
        southwestLong: '4.917191406249913',
        northeastLat: '55.3364033237913',
        northeastLong: '38.66719140624991',
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
        this.deleteSensorWithFalsePollution(sensorsList);
        this.groupSensorsForCity();
        this.avgPollutionLevelForCity();
      }
    });
  }
  private deleteSensorWithFalsePollution(sensorsList: SensorTo[]) {
    this.sensorsList.forEach(sensor => {
      if (!sensor.pollutionLevel) {
        const index = sensorsList.indexOf(sensor, 0);
        this.sensorsList.splice(index, 1);
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
    // tslint:disable-next-line:no-shadowed-variable
    this.cities.forEach(element => {
      let count = 0;
      element.sensors.forEach(sensor => {
        if (sensor.pollutionLevel > 0) {
          element.pollutionLevelAvg = element.pollutionLevelAvg + sensor.pollutionLevel;
        } else {
          count++;
        }

      });
      element.pollutionLevelAvg = element.pollutionLevelAvg / (element.sensors.length - count);
      element.pollutionLevelAvg = roundValue(element.pollutionLevelAvg, 1);
    });
  }

  ngOnDestroy(): void {
    this.voivodenshipListSubscription.unsubscribe();
    this.sensorsListSubscription.unsubscribe();
  }
}
