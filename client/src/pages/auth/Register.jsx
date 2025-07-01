import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { toast } from "sonner"

const initialState = {
  userName : "",
  email : "",
  password : ""
}

const Register = () => {
  const [formData , setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(formData)

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      console.log(data)
      if(data?.payload?.success) {
        toast.success( data?.payload?.message || "Registration Successful" , {
          duration : 4000,
          
        })
        navigate("/auth/login")
      }
      else{
         toast.error( data?.payload?.message , {
          
          duration : 4000
         })
      } 
    })
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="w-full max-w-md space-y-8 text-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create your account</h2>
        <p className="text-sm text-gray-400">Start shopping with us today!</p>
      </div>

      <form onSubmit = {handleSubmit }className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="userName"
              type="text"
              value = {formData.userName}
               onChange = {handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="yourname"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value = {formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value = {formData.password}
              onChange = {handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-indigo-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
