import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Campo from "../components/Campo/Campo";

describe('Campo', () => {
    test("renderiza o label correto", () => {
        render(<Campo label="DESCRIÇÃO:" value="" onChange={() => { }} />);
        expect(screen.getByLabelText("DESCRIÇÃO:")).toBeDefined();
    });

    test("onChange recebe uma string", async () => {
        const aoMudar = vi.fn();
        render(<Campo label="DESCRIÇÃO:" value="" onChange={aoMudar} />)

        const input = screen.getByLabelText("DESCRIÇÃO:");
        await userEvent.type(input, "e");

        expect(aoMudar).toHaveBeenCalledWith("e")
    });
})