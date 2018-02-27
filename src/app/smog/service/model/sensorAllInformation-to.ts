import { ForecastSensorTo } from './forecastSensor-to';
import { MeasurementsSensorTo } from './measurementsSensor-to';
export interface SensorAllInformationTo {
  currentMeasurements: MeasurementsSensorTo;
  history: ForecastSensorTo[];
  forecast: ForecastSensorTo[];
}
