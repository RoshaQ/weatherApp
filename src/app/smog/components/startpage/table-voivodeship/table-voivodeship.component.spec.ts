import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVoivodeshipComponent } from './table-voivodeship.component';

describe('TableVoivodeshipComponent', () => {
  let component: TableVoivodeshipComponent;
  let fixture: ComponentFixture<TableVoivodeshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableVoivodeshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableVoivodeshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
