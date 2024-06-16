import IConfig from "@/interfaces/IConfig"
import fs from "node:fs"
import NextResponseError from "@/network/NextResponseError"
import NextResponseSuccess from "@/network/NextResponseSuccess"

const configFile = process.cwd()+"/data/config.json"

export async function GET(_: Request) {
    var config: IConfig = { driver: "", panel: "" }
    try{
        const data = fs.readFileSync(configFile)
        const json = JSON.parse(data.toString())
        config = json as IConfig
    }catch(err){
        console.log(err)
    }
    return NextResponseSuccess(config)
    
}
