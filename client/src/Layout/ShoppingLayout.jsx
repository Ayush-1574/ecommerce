import Header from "@/components/shopping-view/Header"
import React from "react"
import { Outlet } from "react-router-dom"

const ShoppingLayout = () => {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            <Header/>
            <main className="flex-1 flex bg-muted/40 p-4 md:p-6">
                    <Outlet/>
            </main>
        </div>
    )
}

export default ShoppingLayout