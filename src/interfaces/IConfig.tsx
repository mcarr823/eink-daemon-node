/**
 * Interface representing the daemon's config file: data/config.json
 */
export default interface IConfig{

    // Type of driver the daemon should use.
    // See the Drivers enum for all possible values.
    driver: string;

    // Type of e-ink panel the daemon will connect to.
    // See the appropriate *Panels enum for possible values.
    // eg. UsbPanels or GpioPanels
    panel: string;

    // If true, the daemon is running on a different machine
    // than the one which the e-ink panel is connected to.
    // eg. The daemon could run on a PC while the e-ink panel
    // is connected to a raspberry pi.
    remote: boolean;

    // Only applies if `remote` is true.
    // IP address or hostname of the target device.
    // eg. 192.168.1.10, or pi.mydomain.com
    host: string;

    // Only applies if `remote` is true.
    // Port through which to connect to the remote device.
    // eg. 8888 for pigpio
    port: number;
}