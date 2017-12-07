import { CrazyAsync } from './crazyasync';

describe('Async overhead test', () => {

    it('Test async overhead', async function () {
        console.time('async');
        let ca = new CrazyAsync();
        let sum = 0;
        for (var i = 0; i < 100; i++) {
            sum += await ca.increment8(i);
        }
        console.log('SUM', sum);
        console.timeEnd('async');
    });

});
