import { CitySensorsStore } from './../../../service/sensors/city-sensors-store';
import { City } from './../../../service/model/city';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule } from 'primeng/datatable';

@Component({
  selector: 'app-table-voivodeship',
  templateUrl: './table-voivodeship.component.html',
  styleUrls: ['./table-voivodeship.component.scss']
})
export class TableVoivodeshipComponent implements OnInit {

  isOpen = false;
  isOpen$: Observable<boolean>;
  @Input() cities: City[];
  constructor(private citySensorsStore: CitySensorsStore) {
  }
  pollutionNumber: number;
  ngOnInit() {
    this.isOpen$ = this.citySensorsStore.state$.pipe(
      map(s => s.modalOpen),
      distinctUntilChanged()
    );
  }
  selectCity(cityName: string) {
    // tslint:disable-next-line:no-shadowed-variable
    const city = this.cities.find((city: City) => {
      return city.city === cityName;
    });
    this.citySensorsStore.setCitiesSensors(city, true);
  }

}
