
import TodoItem from "./TodoItem";

type Todo = {
    id: number;
    title: string;
};

type Props = {
    todos: Todo[];
    onUpdate: (id: number, title: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
};

export default function TodoList({
    todos,
    onUpdate,
    onDelete,
}: Props) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
