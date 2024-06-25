import IInEndpoint from "@/interfaces/IInEndpoint";

export default class MockUsbInEndpoint implements IInEndpoint{

    transfer(length: number, callback: (error: Error | undefined, data?: Buffer | undefined) => void) {}

}