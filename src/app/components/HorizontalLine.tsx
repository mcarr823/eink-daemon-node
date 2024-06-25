/**
 * Div with the appearance of a gray horizontal line.
 * 
 * Used to separate fields which are displayed below one another.
 * 
 * eg. You could have a heading, then a horizontal line, then subtext below it.
 * 
 * @returns Div node
 */
export default function HorizontalLine(){

    // Light gray line with minimal height
    const styling = {
        height: 1,
        background: "lightgray"
    }

    return (
        <div className="hr mb-3 mt-3" style={styling}></div>
    )
}