import { Subject, timer, from } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { injectable, LifeCycle } from 'react-rxdi';
import LogSvs from './LogSvs';

// PollingSvs demonstrate
// how can a service know it's host component's lifecycle(.e.g un-mount)

function MockAPI(): Promise<number> {
  return new Promise(res => {
    setTimeout(() => {
      res(new Date().valueOf());
    }, 300);
  });
}

@injectable()
export class PollingSvs {
  public _hostLifeCycle = new LifeCycle();

  private _timeFromServer$ = new Subject<number>();

  public timeFromServer$ = this._timeFromServer$.asObservable();

  public constructor(private logSvs: LogSvs) {
    logSvs.log('creating PollingSvs');
    this._hostLifeCycle.mount$.subscribe(() => {
      timer(0, 2000)
        .pipe(
          switchMap(() => from(MockAPI())),
          // when unMount, unsubscribe the timer
          takeUntil(this._hostLifeCycle.unMount$)
        )
        .subscribe(time => {
          logSvs.log(`receive time from server: ${time}`);
          this._timeFromServer$.next(time);
        });
    });
  }
}
