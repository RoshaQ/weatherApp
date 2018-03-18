import { pluck } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { CitySensorsStore } from '../../service/sensors/city-sensors-store';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  subscription: Subscription;
  display = false;
  titleModal: string;
  constructor(private citySensorsStore: CitySensorsStore) { }

  ngOnInit() {
    this.subscription = this.citySensorsStore.state$.pipe(pluck('modalOpen')).subscribe((isOpen: boolean) => {
      if (isOpen) {
        this.showDialog(isOpen);
      }
    });
  }
  public setModalTitle(title: string) {
  this.titleModal = title;
  }
  showDialog(display: boolean) {
    this.display = display;
  }

  close() {
    this.display = false;
    this.citySensorsStore.resetCitiesSensors();
  }

}
