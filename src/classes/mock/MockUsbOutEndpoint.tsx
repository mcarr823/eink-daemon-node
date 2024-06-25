import IOutEndpoint from "@/interfaces/IOutEndpoint";

export default class MockUsbOutEndpoint implements IOutEndpoint{

    transfer(buffer: Buffer, callback?: ((error: Error | undefined, actual: number) => void) | undefined) {}
    
}