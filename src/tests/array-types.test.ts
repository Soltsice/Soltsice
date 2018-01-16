import { ArrayTypesTest } from '../contracts'
import { W3, testAccounts } from '../'

W3.Default = new W3();

describe('ArrayTypes', () => {
    let arrayTypesContract: ArrayTypesTest
    const arrayInt = [1,2,3]
    const arrayAddress = ["0xf209400320be8eccdc0eac7b5358631bc328799f", "0xf3488e96d8766f8cdc92775b4d9babf77bdcbb65"]

    beforeAll(async () => {
        arrayTypesContract = await ArrayTypesTest.New(
            W3.TC.txParamsDefaultDeploy(testAccounts[0]),
            {_array: arrayInt}
        )
    })

    it('should return array correctly', async () => {
        let res = await arrayTypesContract.array(2)
        expect(res.toNumber()).toEqual(arrayInt[2])
    })

    it('should return array from function correctly', async () => {
        let res = await arrayTypesContract.funcArrayInArguments(arrayAddress)
        expect(res).toEqual(arrayAddress)
    })
})