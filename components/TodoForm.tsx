
"use client";

import { useState } from "react";

type Props = {
    onAdd: (title: string) => Promise<void>;
};

export default function TodoForm({ onAdd }: Props) {
    const [title, setTitle] = useState("");

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        if (!title.trim()) return;

        await onAdd(title);
        setTitle("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="dont forget to do something"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button type="submit">
                yes
            </button>
        </form>
    );
}
