import IConfig from "@/interfaces/IConfig"
import NextResponseError from "@/network/NextResponseError"
import NextResponseSuccess from "@/network/NextResponseSuccess"
import { NextRequest } from "next/server"
import DriverBuilder from "@/classes/DriverBuilder"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: NextRequest) {
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

        // Find and initialize the panel and driver which correspond
        // to the details which the user has supplied.
        const panel = await DriverBuilder(config)

        // Query the panel for whichever information it will give us.
        const queryResult = await panel.query()
        
        // Put the details in a string and send it back in the
        // API response data.
        const data = JSON.stringify(queryResult)
        return NextResponseSuccess(data)

    }catch(err){
        console.error(err)
        return NextResponseError('Failed to query panel')
    }
}