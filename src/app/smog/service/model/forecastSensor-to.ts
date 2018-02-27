import { MeasurementsSensorTo } from './measurementsSensor-to';
export interface ForecastSensorTo {
  fromDateTime: string;
  tillDateTime: string;
  measurements: MeasurementsSensorTo[];
}
