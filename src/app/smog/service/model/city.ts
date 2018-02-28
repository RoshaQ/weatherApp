import { SensorTo } from './sensor-to';

export interface City {
    city: string;
    sensors: SensorTo[];
    pollutionLevelAvg?: number;
    pollutionInformation?: string;
}
