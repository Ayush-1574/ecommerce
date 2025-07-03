import React, { useState , useEffect } from 'react';
import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton"
import AuthLayout from './Layout/authLayout';
import Login from './pages/auth/Login';

import Register from './pages/auth/Register';
import Home from "./pages/shopping-view/Home";
import Account from "./pages/shopping-view/Account";
import Checkout from "./pages/shopping-view/Checkout";
import Listing from "./pages/shopping-view/Listing";
import Dashboard from './pages/admin-view/Dashboard';
import Orders from './pages/admin-view/Orders';
import Product from './pages/admin-view/Product';
import Features from './pages/admin-view/Features';
import AdminLayout from './Layout/AdminLayout';
import ShoppingLayout from './Layout/ShoppingLayout';
import NotFound from './pages/Not-Found';
import CheckAuth from './components/common/CheckAuth';
import UnAuth from './pages/unAuth/index';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice';


function App() {

  const {user , isAuthenticated , isLoading} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {dispatch(checkAuth())} , [dispatch])

  if(isLoading) return <div><Skeleton className="h-[600px] w-[600px] bg-black" /></div>

  const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth" element={
        <CheckAuth isAuthenticated = {isAuthenticated} user = {user}>
        <AuthLayout />
      </CheckAuth>}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path = "/admin" element = {
        <CheckAuth isAuthenticated = {isAuthenticated} user = {user}>
          <AdminLayout/>
        </CheckAuth>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="product" element={<Product/>} />
        <Route path="features" element={<Features />} />
      </Route>
       <Route path = "/shop" element = {
        <CheckAuth isAuthenticated = {isAuthenticated} user = {user} >
          <ShoppingLayout/>
        </CheckAuth>
       }>
        <Route path="account" element={<Account />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="listing" element={<Listing/>} />
        <Route path="home" element={<Home />} />
      </Route>
      <Route path = "/unauth-page" element = {<UnAuth/>}/>
      <Route path = "*" element = {<NotFound/>}/>
    </>
  )
);


  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;


