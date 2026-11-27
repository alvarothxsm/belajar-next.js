
"use client";

import { useState } from "react";
import EditButton from "./Editbutton";
import DeleteButton from "./DeleteButton";

type Todo = {
    id: number;
    title: string;
};

type Props = {
    todo: Todo;
    onUpdate: (id: number, title: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
};

export default function TodoItem({
    todo,
    onUpdate,
    onDelete,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);

    async function handleUpdate() {
        if (!title.trim()) return;

        await onUpdate(todo.id, title);
        setEditing(false);
    }

    return (
        <div className="todo-item">
            {editing ? (
                <>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <button type="button" onClick={handleUpdate}>
                        simpan
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setTitle(todo.title);
                            setEditing(false);
                        }}
                    >
                        batal
                    </button>
                </>
            ) : (
                <>
                    <span>{todo.title}</span>

                    <EditButton
                        onClick={() => setEditing(true)}
                    />

                    <DeleteButton
                        onClick={() => onDelete(todo.id)}
                    />
                </>
            )}
        </div>
    );
}
