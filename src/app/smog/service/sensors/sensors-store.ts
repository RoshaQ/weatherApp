import { City } from './../model/city';
import { SensorAllInformationTo } from './../model/sensorAllInformation-to';
import { SensorTo } from './../model/sensor-to';
import { distinctUntilChanged } from 'rxjs/operators';
import { Logger } from './../../../core/logger';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SensorsState } from './sensors-state';

export class SensorsStore {

  private sensorsAllInformationList: SensorAllInformationTo[] = [];
  private stateSource = new BehaviorSubject<SensorsState>(
    {
      isLoading: true,
      sensorsList: null,
      sensorsInformation: null
    } as SensorsState
  );
  state$ = this.stateSource.asObservable().pipe(distinctUntilChanged());

  resetSensorsList() {
    this.emitNewState({
      isLoading: true,
      sensorsList: null
    } as SensorsState);
  }

  setSensorsList(sensorsList: SensorTo[]) {
    this.emitNewState({
      isLoading: false,
      sensorsList: sensorsList
    } as SensorsState);
  }

  resetSensorsInformation() {
    this.emitNewState({
      isLoading: false,
      sensorsInformation: null
    } as SensorsState);
  }

  setSensorsInformation(sensor: SensorAllInformationTo, length: number) {
    this.sensorsAllInformationList.push(sensor);
    const sensors = this.sensorsAllInformationList;
    if (sensors.length === length) {
      this.emitNewState({
        isLoading: false,
        sensorsInformation: sensors
      } as SensorsState);
      this.sensorsAllInformationList = [];
    }
  }

  resetCitiesSensors() {
    this.emitNewState({
      isLoading: true,
      cities: null
    } as SensorsState);
  }

  setCitiesSensors(cities: City[]) {
    this.emitNewState({
      isLoading: false,
      cities: cities
    } as SensorsState);
  }

  private emitNewState(newState: SensorsState) {
    const currentState = this.stateSource.getValue();
    const nextState = Object.assign({}, currentState, newState);
    this.stateSource.next(nextState);
    Logger.debug('nextState', nextState);
  }
}
