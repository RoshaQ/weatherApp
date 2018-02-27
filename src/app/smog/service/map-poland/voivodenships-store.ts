import { VoivodeshipTo } from './../model/voivodeship-to';
import { Logger } from './../../../core/logger';
import { VoivodenshipsState } from './voivodenships-state';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators';

export class VoivodenshipsStore {

  private stateSource = new BehaviorSubject<VoivodenshipsState>(
    {
      voivodenshipsList: null
    } as VoivodenshipsState
  );
  state$ = this.stateSource.asObservable().pipe(distinctUntilChanged());

  resetVoivodenships() {
    this.emitNewState({
      isLoading: true,
      voivodenshipsList: null
    } as VoivodenshipsState);
  }
  setVoivodenships(voivodenships: VoivodeshipTo[]) {
    this.emitNewState({
      isLoading: false,
      voivodenshipsList: voivodenships
    }as VoivodenshipsState);
  }


  private emitNewState(newState: VoivodenshipsState) {
    const currentState = this.stateSource.getValue();
    const nextState = Object.assign({}, currentState, newState);
    this.stateSource.next(nextState);
    Logger.debug('nextState', nextState);
  }
}
