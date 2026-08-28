import type React from "react";

export type Props = Omit<React.ComponentProps<"input">, "onChange"> & {
    erro?: string,
    label: string,
    onChange: (valor: string) => void,
};