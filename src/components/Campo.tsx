import type React from "react"

type Props = Omit<React.ComponentProps<"input">, "onChange"> & {
    label: string,
    onChange: (valor: string) => void
}

export default function Campo({ onChange, label, ...resto }: Props) {
    return (
        <label>
            {label}
            <input
                {...resto}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    )
}