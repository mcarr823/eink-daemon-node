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

        const sigBytes = bytes.buffer.slice(0,4)
        this.signature = Buffer.from(sigBytes)

        const tagBytes = bytes.buffer.slice(4,8)
        const tagBuffer = Buffer.from(tagBytes)
        this.tag = bytesToInt(tagBuffer, bigEndian)

        const residueBytes = bytes.buffer.slice(8,12)
        const residueBuffer = Buffer.from(residueBytes)
        this.dataResidue = bytesToInt(residueBuffer, bigEndian)

        this.status = bytes[12]
    }

}