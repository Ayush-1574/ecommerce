import React, { Fragment } from "react"
import {BadgeCheck, ChartNoAxesCombined} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard , ShoppingBasket } from "lucide-react"


const adminSidebarMenuItems = [
    {
        id : 'dashboard',
        label : "dashboard",
        path : "/admin/dashboard",
        icon : <LayoutDashboard />
    },
    {
        id : 'products',
        label : "products",
        path : "/admin/product",
        icon : <ShoppingBasket />
    },
    {
        id : 'features',
        label : "features",
        path : "/admin/features",
    },
    {
        id : 'orders',
        label : "orders",
        path : "/admin/orders",
        icon : <BadgeCheck/>
    },
]

  function MenuItem(){
        const navigate = useNavigate()
        return <nav className = "mt-8 flex-col flex gap-2">
            {
                adminSidebarMenuItems.map((menuitems) => <div key = {menuitems.id} onClick = {() => navigate(menuitems.path)}className="flex items-center gap-2 rounded-md px-3 py-2"> 
                {menuitems.icon}
                <span>{menuitems.label}</span>
                </div>)
            }
        </nav>
    }

const Sidebar = () => {
    const navigate = useNavigate()
    return (
        <Fragment>
            <aside className = "hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div onClick = {() => navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-2">
                    <ChartNoAxesCombined size = {30}/>
                    <h2 className = "text-xl font-extrabold ">Admin Panel</h2>

                </div>
                <MenuItem/>
            </aside>
        </Fragment>
    )
}

export default Sidebar