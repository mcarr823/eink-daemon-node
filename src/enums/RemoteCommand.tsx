/**
 * Enum to keep track of the supported remote commands.
 * 
 * ie. The commands which one instance of this program
 * can send to another instance of this program.
 * 
 * Any values in here should map to folders in /api/
 */

export enum RemoteCommand{
    QUERY = "query",
    CONFIG = "config",
    REMOTE = "remote"
}