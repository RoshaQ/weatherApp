import { LocationTo } from './location-to';
import { AddressTo } from './address-to';

export interface SensorTo {
  id: number;
  name: string;
  vendor: string;
  location: LocationTo;
  pollutionLevel: number;
  address: AddressTo;
}
