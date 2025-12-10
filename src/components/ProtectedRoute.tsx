import React from "react"
import {Navigate} from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("token") //check if user is logged in

    if(!token) {
        // if no token, redirect to login page
        return <Navigate to="/auth" replace />
    }

    // If logged in, show the page
    return children
}

export default ProtectedRoute