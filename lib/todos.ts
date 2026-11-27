import { supabase } from "./supabase";

// READ
export async function getTodos() {
    const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// CREATE
export async function addTodo(title: string) {
    const { data, error } = await supabase
        .from("todos")
        .insert({ title })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// UPDATE
export async function updateTodo(
    id: number,
    title: string
) {
    const { data, error } = await supabase
        .from("todos")
        .update({ title })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// DELETE
export async function deleteTodo(id: number) {
    const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

    if (error) throw error;
}