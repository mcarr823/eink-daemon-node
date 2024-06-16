import { ChangeEventHandler } from "react";
import SimpleOption from "./SimpleOption";

/**
 * A simple select element which turns an array of strings into a
 * dropdown list.
 * 
 * This is intended for use with the setter of a useState variable (setValue)
 * and simplifies the implementation of ChangeEventHandler.
 * 
 * eg.
 * const [selectedValue, setSelectedValue] = useState("")
 * const values = ["value1", "value2"]
 * return (
 *  <SimpleSelect
 *   id="test"
 *   value={selectedValue}
 *   values={values}
 *   setValue={setSelectedValue}/>
 * )
 * 
 * @param id Unique identifier for this element
 * @param value Default value to display. Can be a state variable from useState
 * @param values Array of strings to display as options in the dropdown list
 * @param setValue Callback to invoke when an option is selected
 * @returns A styled <select> node built from a string array
 */
export default function SimpleSelect(args: ISimpleSelectArgs){

    const children = args.values.map(SimpleOption)
    
    const setValue: ChangeEventHandler<HTMLSelectElement> = (event) => {
        args.setValue(event.target.value)
    }

    return (
        <select
            className="form-control"
            id={args.id}
            value={args.value}
            onChange={setValue}
            >
            {children}
        </select>
    )
}

interface ISimpleSelectArgs{
    id: string;
    value: string;
    values: Array<string>;
    setValue: (value: string) => void;
}