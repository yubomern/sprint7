import React, { useEffect, useState } from "react";
import axios from "axios";
import  './Todo.css'
const API_URL = "http://localhost:4000/api/v1/todo"; // your backend

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Fetch todos
    const fetchTodos = async () => {
        try {
            const res = await axios.get(API_URL);
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Add todo
    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            await axios.post(API_URL, { text: newTodo });
            setNewTodo("");
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    // Update todo
    const updateTodo = async (id) => {
        try {
            await axios.put(API_URL, { _id: id, text: editingText });
            setEditingId(null);
            setEditingText("");
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="todo-container">
            <h2 className="todo-title">ToDo App</h2>

            {/* Add Todo */}
            <div className="todo-add">
                <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                    className="input"
                />
                <button onClick={addTodo} className="btn btn-add">
                    Add
                </button>
            </div>

            {/* Todo List */}
            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo._id} className="todo-item">
                        {editingId === todo._id ? (
                            <>
                                <input
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="input"
                                />
                                <button
                                    onClick={() => updateTodo(todo._id)}
                                    className="btn btn-add"
                                    style={{ marginLeft: "8px" }}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="todo-text">{todo.text}</span>
                                <button
                                    onClick={() => {
                                        setEditingId(todo._id);
                                        setEditingText(todo.text);
                                    }}
                                    className="btn btn-edit"
                                    style={{ marginLeft: "8px" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="btn btn-danger"
                                    style={{ marginLeft: "8px" }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
