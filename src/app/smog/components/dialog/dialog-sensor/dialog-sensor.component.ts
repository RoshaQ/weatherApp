import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { pluck, map, distinctUntilChanged } from 'rxjs/operators';
import { SensorAllInformationTo } from '../../../service/model/sensorAllInformation-to';
import { AverageAndColor } from '../../../service/model/averageAndColor';
import { MeasurementsColorAndAverage } from '../../../service/model/measurementsColorAndAvarage';
import { CitySensorsStore } from '../../../service/sensors/city-sensors-store';
import { SensorsService } from '../../../service/sensors/sensors.service';
import { SensorsStore } from '../../../service/sensors/sensors-store';
import { City } from '../../../service/model/city';
import { roundValue } from '../../../../core/round/round-value';
@Component({
  selector: 'app-dialog-sensor',
  templateUrl: './dialog-sensor.component.html',
  styleUrls: ['./dialog-sensor.component.scss']
})
export class DialogSensorComponent implements OnInit, OnDestroy {

  sumValueMap: Map<string, number>;
  emptyValueMap: Map<string, number>;
  display = false;
  subscription: Subscription[] = [];
  @Output() addTitle = new EventEmitter<string>();
  idSensorsList: number[];
  sensorAllInformationTable: SensorAllInformationTo[];
  averageAndColor = {
    average: 0,
    color: ''
  } as AverageAndColor;
  randomColor = 'black';
  averageMeasurements = {
    airQualityIndex: {
      average: 0,
      color: 'grey'
    },
    pm1: {
      average: 0,
      color: 'grey'
    },
    pm25: {
      average: 0,
      color: 'grey'
    },
    pm10: {
      average: 0,
      color: 'grey'
    },
    pollutionLevel: {
      average: 0,
      color: 'grey'
    },
    pressure: {
      average: 0,
      color: 'grey'
    },
    humidity: {
      average: 0,
      color: 'grey'
    },
    temperature: {
      average: 0,
      color: 'grey'
    },
  } as MeasurementsColorAndAverage;

  constructor(
    private citySensorsStore: CitySensorsStore,
    private sensorsService: SensorsService,
    private sensorsStore: SensorsStore
  ) {
  }

  ngOnInit() {
    this.subscription[1] = this.citySensorsStore.state$.pipe(
      map(s => s.city),
      distinctUntilChanged())
      .subscribe((city: City) => {
        if (city) {
          this.idSensorsList = [];
          this.setModalTitle(city.city);
          city.sensors.forEach(sensor => {
            this.idSensorsList.push(sensor.id);
          });
        }
      });
    if (this.idSensorsList) {
      this.sensorsService.readSensorsAllInformation(this.idSensorsList.slice(0, 20));
      this.subscription[2] = this.sensorsStore.state$.pipe(
        map(s => s.sensorsInformation),
        distinctUntilChanged())
        .subscribe((sensorsInformation: SensorAllInformationTo[]) => {
          if (sensorsInformation) {
            this.sensorAllInformationTable = sensorsInformation;
            this.calcukateAverageMeasurements();
          }
        });
    }
  }
  public setModalTitle(title: string) {
    this.addTitle.emit(title);
  }
  private calcukateAverageMeasurements() {
    this.emptyValueMap = new Map([
      ['airQualityIndex', 0],
      ['pm10', 0],
      ['pm25', 0],
      ['pm1', 0],
      ['pollutionLevel', 0],
      ['humidity', 0],
      ['pressure', 0],
      ['temperature', 0]
    ]);
    this.sumValueMap = new Map([
      ['airQualityIndex', 0],
      ['pm10', 0],
      ['pm25', 0],
      ['pm1', 0],
      ['pollutionLevel', 0],
      ['humidity', 0],
      ['pressure', 0],
      ['temperature', 0]
    ]);

    this.sensorAllInformationTable.forEach(sensor => {
      this.calculateSumValues(sensor.currentMeasurements.airQualityIndex, 'airQualityIndex');
      this.calculateSumValues(sensor.currentMeasurements.pm10, 'pm10');
      this.calculateSumValues(sensor.currentMeasurements.pm25, 'pm25');
      this.calculateSumValues(sensor.currentMeasurements.pm1, 'pm1');
      this.calculateSumValues(sensor.currentMeasurements.pollutionLevel, 'pollutionLevel');
      this.calculateSumValues(sensor.currentMeasurements.humidity, 'humidity');
      this.calculateSumValues(sensor.currentMeasurements.pressure, 'pressure');
      this.calculateSumValues(sensor.currentMeasurements.temperature, 'temperature');
    });

    this.setPollutionData(this.averageMeasurements.airQualityIndex, 'airQualityIndex');
    this.setPollutionData(this.averageMeasurements.pm10, 'pm10');
    this.setPollutionData(this.averageMeasurements.pm25, 'pm25');
    this.setPollutionData(this.averageMeasurements.pm1, 'pm1');
    this.setPollutionData(this.averageMeasurements.pollutionLevel, 'pollutionLevel');
    this.setPollutionData(this.averageMeasurements.humidity, 'humidity');
    this.setPollutionData(this.averageMeasurements.pressure, 'pressure');
    this.setPollutionData(this.averageMeasurements.temperature, 'temperature');
  }

  private calculateSumValues(pollutionValue: number, name: string) {
    let sum = 0;
    let emptyCount = 0;
    if (pollutionValue) {
      sum = this.sumValueMap.get(name) + pollutionValue;
      this.sumValueMap.set(name, sum);
    } else {
      emptyCount = this.emptyValueMap.get(name) + 1;
      this.emptyValueMap.set(name, emptyCount);
    }
  }

  private setPollutionData(
    avgMeasurements: AverageAndColor,
    name: string) {
    const length = this.sensorAllInformationTable.length;
    const avg = this.sumValueMap.get(name) / (length - this.emptyValueMap.get(name));
    avgMeasurements.average = roundValue(avg, 1);
    this.setColorsGrid(avgMeasurements, name);
  }

  private setColorsGrid(measurementsType: AverageAndColor, name: string) {
    let valuePercent = 0;
    if (measurementsType !== null) {
      switch (name) {
        case 'airQualityIndex':
          this.setColorForPollution(measurementsType, measurementsType.average);
          break;
        case 'pm10':
          valuePercent = (measurementsType.average / 50) * 100;
          this.setColorForPollution(measurementsType, valuePercent);
          break;
        case 'pm1':
          valuePercent = (measurementsType.average / 10) * 100;
          this.setColorForPollution(measurementsType, valuePercent);
          break;
        case 'pm25':
          valuePercent = (measurementsType.average / 25) * 100;
          this.setColorForPollution(measurementsType, valuePercent);
          break;
        case 'pollutionLevel':
          valuePercent = (measurementsType.average / 6) * 100;
          this.setColorForPollution(measurementsType, valuePercent);
          break;
        case 'temperature':
          this.setColorForTemperature(measurementsType);
          break;
      }
    }
  }
  private setColorForPollution(measurementsType: AverageAndColor, percent: number) {
    if (measurementsType.average > 0) {
      measurementsType.color = this.setColor(percent);
    } else {
      // TODO MIKOLAJ
      console.log('ERROR');
    }
  }
  private setColorForTemperature(measurementsType: AverageAndColor) {
    if (measurementsType.average > 29) {
      measurementsType.color = 'red';
    }
    if (measurementsType.average <= 29 && measurementsType.average > 20) {
      measurementsType.color = 'orange';
    }
    if (measurementsType.average <= 20 && measurementsType.average > 12) {
      measurementsType.color = '#ffbc26';
    }
    if (measurementsType.average <= 12 && measurementsType.average > 5) {
      measurementsType.color = 'green';
    }
    if (measurementsType.average <= 5 && measurementsType.average > -5) {
      measurementsType.color = 'blue';
    }
    if (measurementsType.average <= -5 && measurementsType.average > -15) {
      measurementsType.color = '#27f4d5';
    }
    if (measurementsType.average <= -15) {
      measurementsType.color = '#edfffc';
    }
  }

  private setColor(average: number): string {
    if (average >= 100) {
      return 'red';
    }
    if (average > 75 && average < 100) {
      return 'orange';
    }
    if (average > 50 && average <= 75) {
      return '#F7D358';
    }
    if (average > 25 && average <= 50) {
      return '#BEF781';
    }
    if (average <= 25) {
      return '#3ADF00';
    }

  }

  setColorHTML(name: string): string {
    switch (name) {
      case 'airQualityIndex':
        return this.averageMeasurements.airQualityIndex.color;
      case 'pm10':
        return this.averageMeasurements.pm10.color;
      case 'pm1':
        return this.averageMeasurements.pm1.color;
      case 'pm25':
        return this.averageMeasurements.pm25.color;
      case 'pollutionLevel':
        return this.averageMeasurements.pollutionLevel.color;
      case 'temperature':
        return this.averageMeasurements.temperature.color;
      case 'humidity':
        return this.averageMeasurements.humidity.color = 'grey';
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscribe => {
      subscribe.unsubscribe();
    });
  }

}


