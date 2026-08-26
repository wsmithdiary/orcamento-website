import type React from "react";
import { useId } from "react";

type Props = Omit<React.ComponentProps<"input">, "onChange"> & {
    label: string,
    erro?: string,
    onChange: (valor: string) => void
}

export default function Campo({ onChange, label, value, erro, ...resto }: Props) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className="flex flex-col"
        >
            <span
            >
                {label}
            </span>
            <input
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? `${id}-erro` : undefined}
                className="border border-amber-500 p-1"
                {...resto}
                value={value}
                id={id}
                onChange={(e) => onChange(e.target.value)}
            />
            {
                erro && (
                    <span id={`${id}-erro`} role="alert" className="text-red-400 text-sm font-normal">
                        {erro}
                    </span>
                )
            }
        </label>
    )
}