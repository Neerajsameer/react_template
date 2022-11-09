import { Select, TextInput, NumberInput } from "@mantine/core";

type Params = {
    onChange: (name: string, value: string | null | undefined) => void,
    disabled?: boolean,
    name: string,
    label?: string,
    placeholder?: string,
    value?: any,
    visible?: boolean,
    maxLength?: number,
    required?: boolean,
    expand?: boolean,
    type?: "text" | "email" | "number",
    width?: string
}

export default function NTextBox({ name, label = "", placeholder, width, value, onChange, disabled, visible = true, maxLength, required = true, type = 'text', expand }: Params) {
    return (
        <>
            {
                type == "text" ?

                    <TextInput
                        key={name}
                        name={name}
                        label={label}
                        style={{ width: width }}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled || !visible}
                        maxLength={maxLength}
                        value={value?.toString()}
                        required={required}
                        onChange={(e) => onChange(name, e.target.value == "" ? null : e.target.value)}
                    /> : <NumberInput
                        key={name}
                        name={name}
                        label={label}
                        itemType={"number"}
                        placeholder={placeholder}
                        disabled={disabled || !visible}
                        maxLength={maxLength}
                        // hideControls
                        value={value ? parseInt(value) : undefined}
                        required={required}
                        onChange={(e) => onChange(name, e?.toString())}
                    />
            }
        </>
    )
}