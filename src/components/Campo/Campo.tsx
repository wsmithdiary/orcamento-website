import type { Props } from "./Campo.types";
import { useId } from "react";



export default function Campo({ onChange, label, value, erro, ...resto }: Props) {
    // gera id unico para o campo
    const id = useId();

    // componente
    return (
        <label
            htmlFor={id}
            className="flex flex-col text-tinta-500 gap-2 text-xs"
        >
            <span>
                {label}
            </span>
            <input
                id={id}
                className={`${erro ? "border border-perigo-600" : "border border-tinta-100"} bg-base-100 px-1.5 py-1.5 rounded-md`}
                value={value}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? `${id}-erro` : undefined}
                onChange={(e) => onChange(e.target.value)}
                {...resto}
            />
            {
                erro && (
                    <span
                        id={`${id}-erro`}
                        role="alert"
                        className="text-perigo-600 text-xs font-normal"
                    >
                        {erro}
                    </span>
                )
            }
        </label>
    );
}