/**
 * Button which displays a progress icon inside of it when inactive.
 * 
 * This component is intended for cases where clicking the button
 * invokes some other action in the background and disables the
 * button while it is occurring.
 * 
 * For example, it could be used with an ajax request, where a user
 * clicks on a "Submit" button to send a form and waits for a response.
 * 
 * In that case, the button would become inactive and show a progress icon
 * while the request is in progress.
 * 
 * @param classes Style for the button. eg. "btn btn-success"
 * @param text Text to display inside of the button
 * @param enabled If true, enable the button. If false, show the spinner and disable it
 * @param onClick Callback to invoke when the button is clicked
 * @return A <button> element
 */
export default function SubmitButton(args: ISubmitButton){

    const {
        classes="btn btn-primary",
        text="Submit",
        enabled,
        onClick
    } = args

    return (
        <button className={classes} type="button" disabled={!enabled} onClick={onClick}>
            <Spinner enabled={enabled}/>
            &nbsp;{text}
        </button>
    )
    
}

/**
 * Represents a progress image (or nothing) to be displayed inside
 * of the button while requests are in progress.
 * 
 * @param enabled If true, show nothing, because the button is enabled.
 * If false, show a spinner image, because a request is in progress.
 * @returns Progress image or empty HTML element
 */
function Spinner({ enabled } : { enabled: boolean }){

    if (enabled) return (<></>)

    return (
        <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
        ></span>
    )

}

interface ISubmitButton{
    classes: string;
    text: string;
    enabled: boolean;
    onClick: () => void;
}