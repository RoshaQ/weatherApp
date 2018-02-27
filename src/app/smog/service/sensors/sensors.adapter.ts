import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SensorTo } from '../model/sensor-to';
import { Location } from '../model/location';
import { SensorAllInformationTo } from '../model/sensorAllInformation-to';

@Injectable()
export class SensorsAdapter {

  private readonly baseUrl = 'https://airapi.airly.eu/v1/';
  private readonly apiKey= '&apikey=fae55480ef384880871f8b40e77bbef9';
  constructor(private http: HttpClient) {
  }

  readSensorsList(location: Location): Observable<Array<SensorTo>> {
    // tslint:disable-next-line:max-line-length
    const url = `${this.baseUrl}/sensorsWithWios/current?southwestLat=${location.southwestLat}&southwestLong=${location.southwestLong}&northeastLat=${location.northeastLat}&northeastLong=${location.northeastLong}${this.apiKey}`;
    return this.http.get<Array<SensorTo>>(url);
  }

  readSensorsAllInformation(id: number): Observable<SensorAllInformationTo> {
    const url = `${this.baseUrl}sensor/measurements?sensorId=${id}${this.apiKey}`;
    return this.http.get<SensorAllInformationTo>(url);
  }

}
