import { bytesToInt } from "./IntConverter";

/**
 * Wrapper for a USB command status response.
 * 
 * This should correspond to a UsbCommandBlockWrapper
 * sent to a panel.
 */
export default class UsbCommandStatusWrapper{

    signature: Buffer;
    tag: number;
    dataResidue: number;
    status: number;
    
    constructor(
        bytes: Buffer,
        bigEndian: boolean
    ){

        if (bytes.length != 13){
            throw Error("Unexpected buffer length of: ${bytes.length}")
        }

        this.signature = bytes.subarray(0,4)

        const tagBytes = bytes.subarray(4,8)
        this.tag = bytesToInt(tagBytes, bigEndian)

        const residueBytes = bytes.subarray(8,12)
        this.dataResidue = bytesToInt(residueBytes, bigEndian)

        this.status = bytes[12]
    }

}