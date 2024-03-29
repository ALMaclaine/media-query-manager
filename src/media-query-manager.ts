import { ensureNotPxEm } from 'empxrem';

export class MediaQueryManager extends EventTarget {
    private _watchers: Array<MediaQueryList> = [];
    private _active = 0;
    protected readonly _breaks: Array<number> = [];
    protected readonly _baseFontSize;


    private _handler = () => {
        for (const [i, watcher] of Object.entries(this._watchers)) {
            if (watcher.matches) {
                ({ _breaks: { [parseInt(i)]: this._active } } = this);
                break;
            }
        }
        this._changed();
    };

    public init(): void {
        for (const pt of this._breaks) {
            const dim = ensureNotPxEm(pt, this._baseFontSize);
            const query = `(max-width: ${dim})`;
            const watcher = window.matchMedia(query);
            watcher.addEventListener('change', this._handler);
            this._watchers.push(watcher);
        }
        this._handler();
    }

    constructor(breaks: Array<number>, { baseFontSize = 16, delayInit = false } = {}) {
        super();
        this._baseFontSize = baseFontSize;
        this._breaks = [...breaks, 99999];

        if (!delayInit) {
            this.init();
        }
    }

    public updateBaseFont(): void {
        const node = document.querySelector('html');
        if (node) {
            node.style.fontSize = `${this._baseFontSize / 16 * 100}%`;
        }
    }

    private _changed() {
        const event = new CustomEvent<{active: number}>('change', { detail: { active: this.active } });
        this.dispatchEvent(event);
    }

    public destroy(): void {
        this._watchers.forEach(e => e.removeEventListener('change', this._handler));
    }

    get breaks(): Array<number> {
        return this._breaks;
    }

    get active(): number {
        return this._active;
    }
}
