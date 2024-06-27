/**
 * @jest-environment node
 */

import { configFile, GET, PUT } from './route';
import {expect, test, beforeAll, afterAll} from '@jest/globals';
import IConfig from '@/interfaces/IConfig';
import { INextResponseSuccess } from '@/network/NextResponseSuccess'
import { INextResponseError } from '@/network/NextResponseError'
import fs from "node:fs"

var initialConfig = ""
var configFileExisted = true

// Before any of the tests run, read the current config file.
beforeAll(() => {
    try{
        initialConfig = fs.readFileSync(configFile).toString()
    }catch(e){
        configFileExisted = false
    }
})

// Then, after all of the tests have run, restore the config
// file to its original state.
afterAll(() => {
    try{
        if (configFileExisted){
            fs.writeFileSync(configFile, initialConfig)
        }else{
            fs.unlinkSync(configFile)
        }
    }catch(e){
        // File write failed - probably an automated test
    }
});

// Test #1
// Performs a standard GET request to retrieve the server config.
// Only tests for a successful response. Does not validate the config.
test('GET /api/config', async () => {
    
    const requestObj = {} as any;
    const response = await GET(requestObj);
    const body: INextResponseSuccess = await response.json();
  
    expect(response.status).toBe(200);
    expect(body.success).toBe(true)

});

// Test #2
// Performs a PUT request to update the server config.
// Only tests for a successful response. Does not check if
// the config really was updated or not.
test('PUT /api/config', async () => {

    const config: IConfig = {
        panel:'test',
        driver:'test',
        remote:false,
        host:'localhost',
        port:1234
    };
    const requestObj = {
        json: async () => (config),
    } as any;

    const response = await PUT(requestObj);
    const body: INextResponseSuccess = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true)

});

// Test #3
// Performs a PUT request to update the server config.
// Tests for an unsuccessful response by feeding the server
// some invalid data.
test('PUT /api/config', async () => {

    const requestObj = {
        json: async () => ({}),
    } as any;

    const response = await PUT(requestObj);
    const body: INextResponseError = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false)

});

// Test #4
// A more comprehensive GET/PUT test.
// Performs a PUT request to update the server config,
// then a GET request to retrieve the new config.
// The GET data is then validated against the PUT data.
test('PUT and GET /api/config', async () => {

    const driver = "myuniquedriver"
    const panel = "myuniquepanel"
    const host = 'localhost'
    const port = 1234
    const remote = false
    const config: IConfig = { panel, driver, remote, host, port };
    const requestObj = {
        json: async () => (config),
    } as any;

    const response = await PUT(requestObj);
    const body: INextResponseSuccess = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true)

    const requestObj2 = {} as any;
    const response2 = await GET(requestObj2);
    const body2: INextResponseSuccess = await response2.json();
    const data2 = body2.data as IConfig
  
    expect(response2.status).toBe(200);
    expect(body2.success).toBe(true)
    expect(data2.driver).toBe(driver)
    expect(data2.panel).toBe(panel)
    expect(data2.remote).toBe(remote)
    expect(data2.host).toBe(host)
    expect(data2.port).toBe(port)

});
