import { ensureNotPxEm } from 'empxrem';

export class MediaQueryManager extends EventTarget {
  private _watchers: Array<MediaQueryList> = [];
  private _breaks: Array<number> = [];
  private _active = 0;
  protected readonly _finalBreaks: number[] = [];
  protected readonly _baseFontSize;


    private _handler = () => {
      for (let i = 0; i < this._watchers.length; i++) {
          if (this._watchers[i].matches) {
              this._active = this._breaks[i];
              break;
          }
      }
      this._changed();
  }

  public init(baseFontSize: number) {
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

  constructor(breaks: Array<number>, { baseFontSize = 16, delayInit = false } = {}) {
      super();
      this._baseFontSize = baseFontSize;
      this._finalBreaks = [...breaks, 99999];
      if (!delayInit) {
          this.init(baseFontSize);
      }
  }

  private _changed() {
      const event = new CustomEvent<{active: number}>('change', { detail: { active: this.active } });
      this.dispatchEvent(event);
  }

  public destroy(): void {
      this._watchers.forEach(e => e.removeEventListener('change', this._handler));
  }

  get breaks(): number[] {
      return this._breaks.sort((a, b) => a - b);
  }

  get active(): number {
      return this._active;
  }
}
