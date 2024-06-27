import { RemoteCommand } from "@/enums/RemoteCommand";

/**
 * Interface representing a command sent from one instance
 * of this program to another.
 * 
 * Any JSON payloads sent from one endpoint to another
 * should adhere to this format.
 */
export default interface IRemoteCommand{

    // API version number of the sending instance.
    // This is used to keep track of which commands
    // and data formats each endpoint understands when
    // two instances talk to one another.
    version: number;

    // Command to send to the remote endpoint.
    command: RemoteCommand;

    // Data for the remote endpoint to process.
    payload: JSON;

}