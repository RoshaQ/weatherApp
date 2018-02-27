import { City } from './../model/city';
import { SensorAllInformationTo } from './../model/sensorAllInformation-to';
import { SensorTo } from './../model/sensor-to';
export interface SensorsState {
  isLoading: boolean;
  sensorsList: SensorTo[];
  sensorsInformation: SensorAllInformationTo[];
  cities: City[];
}
