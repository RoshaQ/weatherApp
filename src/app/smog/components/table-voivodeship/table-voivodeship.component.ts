import { City } from '../../service/model/city';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule } from 'primeng/datatable';

@Component({
  selector: 'app-table-voivodeship',
  templateUrl: './table-voivodeship.component.html',
  styleUrls: ['./table-voivodeship.component.scss']
})
export class TableVoivodeshipComponent implements OnInit {

  @Input() cities: City[];

  constructor() {
   }

  ngOnInit() {
  }


}
