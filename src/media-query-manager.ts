import { ensureNotPxEm } from 'empxrem';

import  {BreakpointDims} from './types';

export class MediaQueryManager extends EventTarget {
  private _watchers: Array<MediaQueryList> = [];
  private _breaks: Array<number> = [];
  private _active: number = 0;
  private readonly _finalBreaks: number[] = [];

  private _handler = () => {
    for (let i = 0; i < this._watchers.length; i++) {
      if (this._watchers[i].matches) {
        this._active = this._breaks[i];
        break;
      }
    }
    this._changed();
  }

  constructor(breaks: Array<number>, baseFontSize: number = 16) {
    super();

    this._finalBreaks = [...breaks, 99999];
    for (const pt of this._finalBreaks) {
      const dim = ensureNotPxEm(pt, baseFontSize);
      const query = `(max-width: ${dim})`;
      const watcher = window.matchMedia(query);
      watcher.addEventListener('change', this._handler);
      this._watchers.push(watcher);
      this._breaks.push(pt);
    }
    this._handler();
  }

  private _changed() {
    this.dispatchEvent(new Event('change'));
  }

  public _destroy = () => this._watchers.forEach(e => e.removeEventListener('change', this._handler));

  get breaks(): number[] {
    return this._breaks
  }

  get active(): number {
    return this._active;
  }
}
