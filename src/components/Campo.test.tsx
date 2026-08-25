import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Campo from "./Campo";

test("Associa o label ao input", () => {
    render(<Campo label="DESCRIÇÃO:" value="" onChange={() => { }} />);
    expect(screen.getByLabelText("DESCRIÇÃO:")).toBeDefined();
});