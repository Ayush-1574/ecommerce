import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Join ShopVerse and start shopping today
        </p>
      </div>
      <div className="bg-card rounded-2xl border shadow-sm p-8">
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Create Account"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          to="/auth/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;
