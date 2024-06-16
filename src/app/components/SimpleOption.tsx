/**
 * A simple select option where the key, value, and display
 * text are all the exact same value.
 * 
 * eg. SimpleOption('test') would equal
 * <option key="test" value="test">test</option>
 * 
 * @param v String to display and also use as the key
 * @returns An <option> node for use within a <select> node
 */
export default function SimpleOption(v: string){
    return (
        <option key={v} value={v}>{v}</option>
    )
}