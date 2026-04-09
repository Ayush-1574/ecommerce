 import React from "react"
import Sidebar from "../components/admin-view/sidebar"
import Header from "../components/admin-view/header"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 bg-gray-50 px-4 md:px-8 py-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout