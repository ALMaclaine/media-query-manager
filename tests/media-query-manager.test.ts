import * as mediaQueryManager from '../src';

describe('media-query-manager', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(mediaQueryManager);
        expect(keys.length).toBe(1);
        expect(keys).toMatchSnapshot();
    });
});
