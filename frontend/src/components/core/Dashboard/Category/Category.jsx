import React, { useEffect, useState } from "react";
import { getAllCategories, addCategoryDetails } from "../../../../services/operations/categoryApi.js"; // <-- adjust path
import { toast } from "react-hot-toast";
//import {useSelector} from "react-redux";
import  CategoryPage from "../../../../pages/CategoryPage.jsx";


export default function Category() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // const { token } = useSelector((state) => state.auth)

    // Fetch all categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
        console.log(data.data);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        const newCategory = { name, description };
        const result = await addCategoryDetails(newCategory);

        if (result) {
            fetchCategories(); // refresh the list
            setName("");
            setDescription("");
            window.location.reload();
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-3xl font-medium text-center sm:text-left">
                Category Manager
            </h1>

            {/* Add Category Form */}
            <form
                onSubmit={handleAddCategory}
                className="mb-6 p-4 border rounded bg-white shadow"
            >
                <h2 className="text-xl font-semibold mb-4">Add Category</h2>
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category name"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Category
                </button>
            </form>

            {/* Category List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                {categories.length === 0 ? (
                    <p className="text-gray-500">No categories available.</p>
                ) : (
                    <div>

                        <ul className="space-y-3">

                            {categories.map((cat) => (

                                <li
                                    key={cat._id}
                                    className="p-4 border rounded bg-white shadow flex justify-between"
                                >
                                    <div>

                                        <h3 className="font-medium">{cat.name}</h3>

                                        <p className="text-sm text-gray-600">
                                            {cat.description || "No description"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <CategoryPage categories = {categories}/>
        </div>
    );
}
