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
import { TableModule } from 'primeng/table';
import { DataTableModule } from 'primeng/datatable';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  voivodeshipsTable: VoivodeshipTo[];
  selected: number;
  voivodeshipHover = '';
  selectedVoivodeship: VoivodeshipTo;
  map = [];
  cities: City[];
  citiesSort: City[];
  voivodenshipList$: Observable<VoivodeshipTo[]>;
  voivodenshipListSubscription: Subscription;
  sensorsListSubscription: Subscription;
  sensorsAllInformationSubscription: Subscription;
  sensorsList: SensorTo[];
  sensorsInformation: SensorAllInformationTo[];
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
      this.newMethod();

    } else {
      if (!(this.selectedVoivodeship === voivodeship)) {
        this.selectedVoivodeship = voivodeship;
        this.newMethod();
      }
    }
  }

  private newMethod() {
    if (this.selectedVoivodeship != null) {
      this.sensorsService.readSensorsList(this.selectedVoivodeship.location);
      this.sensorsListSubscription = this.sensorsStore.state$.pipe(map((s: any) => s.sensorsList), distinctUntilChanged()).subscribe((sensorsList: SensorTo[]) => {
        if (sensorsList) {
          this.sensorsList = sensorsList;
          console.log(sensorsList);
          this.cities = [];

          sensorsList.forEach((sensor) => {

            if (sensor.address.locality && !this.cities.find(city => city.city === sensor.address.locality)) {

              const sensorsTable = [];
              sensorsTable.push(sensor);
              const sensorCity = {
                city: sensor.address.locality,
                sensors: sensorsTable,
                pollutionLevelAvg: sensor.pollutionLevel
              } as City;
              this.cities.push(sensorCity);
            } else {
              if (this.cities.find(city => city.city === sensor.address.locality)) {

                const indexCity = this.cities.findIndex(city => city.city === sensor.address.locality);
                const pollutionLevelAvg = (this.cities[indexCity].pollutionLevelAvg + sensor.pollutionLevel)
                  / (this.cities[indexCity].sensors.length + 1);
                const sensorsTable = this.cities[indexCity].sensors;
                sensorsTable.push(sensor);
                const sensorCity = {
                  city: sensor.address.locality,
                  sensors: sensorsTable,
                  pollutionLevelAvg: pollutionLevelAvg
                } as City;

                this.cities[indexCity] = sensorCity;
                if (this.cities.length > 1) {
                  this.citiesSort = this.cities.sort((firstCity: City, secondCity: City): number => {
                    if (firstCity.city.toLowerCase() < secondCity.city.toLowerCase()) { return -1; }
                    if (firstCity.city.toLowerCase() > secondCity.city.toLowerCase()) { return 1; }
                  });
                }
              }
            }
          });
        }
      });
      console.log(this.cities);
    }
  }

  hasVoivodeship(voivodeship: any): boolean {
    return this.selectedVoivodeship === voivodeship;
  }

  ngOnDestroy(): void {
    this.voivodenshipListSubscription.unsubscribe();
    this.sensorsAllInformationSubscription.unsubscribe();
    this.sensorsListSubscription.unsubscribe();
  }
}
