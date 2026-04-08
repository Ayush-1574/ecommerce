import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <div className="bg-card rounded-2xl border shadow-sm p-8">
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          to="/auth/register"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
