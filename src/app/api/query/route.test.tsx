/**
 * @jest-environment node
 */

import { POST } from './route';
import {expect, test, beforeAll, afterAll} from '@jest/globals';
import IConfig from '@/interfaces/IConfig';
import { INextResponseSuccess } from '@/network/NextResponseSuccess'
import { INextResponseError } from '@/network/NextResponseError'
import { UsbPanels } from '@/enums/UsbPanels';
import { Drivers } from '@/enums/Drivers';
import IPanelQueryResult from '@/interfaces/IPanelQueryResult';


test('POST /api/query Mock USB', async () => {
    
    const config: IConfig = {
        panel:UsbPanels.MOCK,
        driver:Drivers.USB,
        remote:false,
        host:'',
        port:0
    };
    const requestObj = {
        json: async () => (config),
    } as any;
    const response = await POST(requestObj);
    const body: INextResponseSuccess = await response.json();
    const result = body.data as IPanelQueryResult
  
    expect(response.status).toBe(200);
    expect(body.success).toBe(true)
    expect(result.vcom).toBeGreaterThanOrEqual(0)

});

