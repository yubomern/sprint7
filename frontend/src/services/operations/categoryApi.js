/*

categoryEndpoint

 */


import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { categoryEndpoint } from "../apis"

const   {GET_ALL_CATEGORIES_API ,  ADD_CATEGORIES_API} = categoryEndpoint;


// ================ get All Categories ================
export const getAllCategories = async () => {
    const toastId = toast.loading("Loading...")
    let result = []

    try {
        const response = await apiConnector("GET", GET_ALL_CATEGORIES_API)
        console.table(response.data?.data);
        console.log("HTTP Status:", response.status);

        // API message
        console.log("API Message:", response.data?.message);

        if (response.status!==200) {
            throw new Error("Could Not Fetch  Categories")
        }
        result = response?.data;
        console.table(result);
    } catch (error) {
        console.log("GET_ALL_CATEGORIES_API API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}




// ================ add Category  Details ================
export const addCategoryDetails = async (data) => {
    const toastId = toast.loading("Loading...")
    let result = null;

    try {
        const response = await apiConnector("POST", ADD_CATEGORIES_API, data, {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
        })
        console.log("CREATE Category API RESPONSE............", response)

        if (!response?.data?.success) {
            throw new Error("Could Not Add Category")
        }

        result = response?.data?.data
        toast.success("Category Details Added Successfully")
    } catch (error) {
        console.log("CREATE Category API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}
