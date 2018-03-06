import { City } from './../model/city';
import { SensorTo } from './../model/sensor-to';
import { Logger } from './../../../core/logger';
import { distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CitySensorsState } from './city-sensors.state';
export class CitySensorsStore {

  private stateSource = new BehaviorSubject<CitySensorsState>(
    {
      isLoading: true,
      city: null,
      modalOpen: false
    } as CitySensorsState
  );
  state$ = this.stateSource.asObservable().pipe(distinctUntilChanged());


  resetCitiesSensors() {
    this.emitNewState({
      isLoading: true,
      city: null,
      modalOpen: false
    } as CitySensorsState);
  }

  setCitiesSensors(city: City, isOpen: boolean) {
    this.emitNewState({
      isLoading: false,
      city: city,
      modalOpen: isOpen
    } as CitySensorsState);
  }

  private emitNewState(newState: CitySensorsState) {
    const currentState = this.stateSource.getValue();
    const nextState = Object.assign({}, currentState, newState);
    this.stateSource.next(nextState);
    Logger.debug('nextState', nextState);
  }
}
