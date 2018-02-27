import { environment } from '../../environments/environment';

/**
 * Wrapper für Log Meldungen.
 * Log Meldungen werden nur ausgegeben, wenn man sich nicht im "production" Modus befindet.
 */
export class Logger {

  private static develop = !environment.production;

  static debug(message: string, param1?: any) {
    if (Logger.develop) {
      if (param1) {
        console.log(message, param1);
      } else {
        console.log(message);
      }
    }
  }

  static warn(message: string) {
    if (Logger.develop) {
      console.warn(message);
    }
  }

  static error(message: string) {
    if (Logger.develop) {
      console.error(message);
    }
  }

}
