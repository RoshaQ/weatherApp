import { City } from './../model/city';
import { SensorTo } from './../model/sensor-to';
export interface CitySensorsState {
  isLoading: boolean;
  city: City;
  modalOpen: boolean;
}
