import React, { Fragment } from "react"
import {BadgeCheck, ChartNoAxesCombined, LogOut, Settings} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard , ShoppingBasket } from "lucide-react"
import { useDispatch } from "react-redux"
import { logoutUser } from "@/store/auth-slice"


const adminSidebarMenuItems = [
    {
        id : 'dashboard',
        label : "Dashboard",
        path : "/admin/dashboard",
        icon : <LayoutDashboard className="w-5 h-5" />
    },
    {
        id : 'products',
        label : "Products",
        path : "/admin/product",
        icon : <ShoppingBasket className="w-5 h-5" />
    },
    {
        id : 'orders',
        label : "Orders",
        path : "/admin/orders",
        icon : <BadgeCheck className="w-5 h-5"/>
    },
    {
        id : 'features',
        label : "Features",
        path : "/admin/features",
        icon : <ChartNoAxesCombined className="w-5 h-5" />
    },
]

  function MenuItem(){
        const navigate = useNavigate()
        return <nav className = "mt-8 flex-col flex gap-1">
            {
                adminSidebarMenuItems.map((menuitems) => <div 
                    key = {menuitems.id} 
                    onClick = {() => navigate(menuitems.path)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-600 font-medium text-sm"
                > 
                    <span className="text-gray-500 group-hover:text-blue-600">{menuitems.icon}</span>
                    <span>{menuitems.label}</span>
                </div>)
            }
        </nav>
    }

const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate("/auth/login")
    }

    return (
        <Fragment>
            <aside className = "hidden w-72 flex-col border-r bg-gradient-to-b from-slate-50 to-white p-6 lg:flex">
                {/* Logo Section */}
                <div onClick = {() => navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <ChartNoAxesCombined size={24} className="text-white"/>
                    </div>
                    <div>
                        <h2 className = "text-lg font-bold text-gray-900">ShopVerse</h2>
                        <p className="text-xs text-gray-500">Admin Portal</p>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1">
                    <div className="mt-8">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-4">Main Menu</p>
                        <MenuItem/>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t pt-4 mt-8">
                    <button 
                        onClick={() => navigate("/admin/dashboard")}
                        className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-gray-900 mb-2"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">Settings</span>
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full rounded-lg px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors duration-200 text-red-600 hover:text-red-700"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </Fragment>
    )
}

export default Sidebar