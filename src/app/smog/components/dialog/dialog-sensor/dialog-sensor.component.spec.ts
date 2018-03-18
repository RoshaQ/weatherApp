import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSensorComponent } from './dialog-sensor.component';

describe('DialogSensorComponent', () => {
  let component: DialogSensorComponent;
  let fixture: ComponentFixture<DialogSensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
