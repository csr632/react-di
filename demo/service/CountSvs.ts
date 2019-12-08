import { injectable } from 'react-svs-di';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';
import LogSvs from './LogSvs';

@injectable()
export class CountSvs {
  private readonly addend$ = new Subject<number>();

  // CountSvs don't have to know how is LogSvs configured
  public constructor(private logService: LogSvs) {
    this.logService.log('creating CountSvs');
  }

  public readonly sum$ = this.addend$.pipe(
    scan((acc, value) => acc + value, 0)
  );

  public inc() {
    this.logService.log('increase');
    this.addend$.next(1);
  }
}
