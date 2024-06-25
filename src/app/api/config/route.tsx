import IConfig from "@/interfaces/IConfig"
import fs from "node:fs"
import NextResponseError from "@/network/NextResponseError"
import NextResponseSuccess from "@/network/NextResponseSuccess"
import { NextRequest } from "next/server"

export const configFile = process.cwd()+"/data/config.json"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(_: NextRequest) {
    var config: IConfig = {
        driver: "",
        panel: "",
        remote: false,
        host: "",
        port: 0
    }
    try{
        const data = fs.readFileSync(configFile)
        const json = JSON.parse(data.toString())
        config = json as IConfig
    }catch(err){
        console.log(err)
    }
    return NextResponseSuccess(config)
    
}

export async function PUT(request: NextRequest) {
    try{
        // Note: request.json() actually gives an Object,
        // rather than JSON.
        // So we need to cast it to the expected Object
        // format (IConfig) and then convert that into a
        // string with JSON.stringify().
        const config: IConfig = await request.json()

        // Check each of the expected parameters
        if (
            typeof config.driver === 'undefined' ||
            typeof config.panel === 'undefined' ||
            typeof config.remote === 'undefined' ||
            typeof config.host === 'undefined' ||
            typeof config.port === 'undefined'
        ) throw Error("One or more expected parameters not specified")
        
        const data = JSON.stringify(config)

        // Write the stringified JSON to disk
        fs.writeFileSync(configFile, data)
        return NextResponseSuccess()
    }catch(err){
        console.error(err)
        return NextResponseError('Failed to write config file')
    }
}