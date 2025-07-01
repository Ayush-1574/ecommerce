 import React from "react"
import Sidebar from "../components/admin-view/sidebar"
import Header from "../components/admin-view/header"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 bg-muted/40 px-6 py-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout