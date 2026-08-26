import type React from "react";
import { useId } from "react";

type Props = Omit<React.ComponentProps<"input">, "onChange"> & {
    label: string,
    onChange: (valor: string) => void
}

export default function Campo({ onChange, label, value, ...resto }: Props) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className="flex flex-col"
        >
            {label}
            <input
                className="border border-amber-500 p-1"
                {...resto}
                value={value}
                id={id}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    )
}