import { useState } from "react";
import Layout from "../UI/Layout";
import useRequest from "../hooks/use-request";
import { login } from "../store/auth-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const inputs = [
  {
    type: "email",
    id: "email",
    placeholder: "Email",
    validate: (value = "") =>
      /^[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)?@[a-zA-Z_]\w*\.[a-zA-Z]{2,}$/.test(value),
    message: "Please enter a valid email!",
  },
  {
    type: "password",
    id: "password",
    placeholder: "Password",
    validate: (value = "") => /.{6,}/.test(value),
    message: "Invalid password!",
  },
];

const Login = () => {
  const {
    loading,
    error,
    sendRequest: loginReq,
  } = useRequest((res) => {
    dispatch(login(res.payload));
    navigate("/");
  });
  const [formData, setFormData] = useState({});
  const [inputsTouched, setInputsTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = inputs.every((input) =>
      input.validate(formData[input.id])
    );

    if (isFormValid) {
      loginReq({
        endpoint: "/users/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      const newValue = {};
      for (const key of inputs) newValue[key.id] = true;
      setInputsTouched(newValue);
    }
  };

  const handleBlur = (e) =>
    setInputsTouched((prev) => ({ ...prev, [e.target.id]: true }));

  const handleChange = (e) => {
    const key = e.target.id;
    setFormData((prev) => ({
      ...prev,
      [key]: key === "save" ? e.target.checked : e.target.value,
    }));
  };

  return (
    <Layout className="bg-main flex justify-center items-center">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="-translate-y-14 bg-white rounded-3xl p-4 shadow-lg max-w-full w-[600px]"
      >
        <h1 className="mt-5 text-4xl text-center">Login</h1>
        <div className="mt-10 mb-5">
          {inputs.map((input) => (
            <div key={input.id} className="my-5">
              <input
                autoFocus={input.id === "email"}
                onChange={handleChange}
                className={`border ${
                  inputsTouched[input.id]
                    ? input.validate(formData[input.id])
                      ? ""
                      : "border-red-500 bg-red-50 focus:border-red-500"
                    : "focus:border-main-from"
                } rounded w-full p-2 outline-none duration-150`}
                type={input.type}
                id={input.id}
                placeholder={input.placeholder}
                onBlur={handleBlur}
              />
              {inputsTouched[input.id] &&
                !input.validate(formData[input.id]) && (
                  <p className={`text-red-500 text-sm`}>{input.message}</p>
                )}
            </div>
          ))}
        </div>
        <p className="text-red-500 my-4 text-center font-semibold">
          {error?.message}
        </p>
        <p className="my-5 text-center text-text-main">
          You don&apos;t have an account?{" "}
          <Link className="underline text-main-from font-semibold" to="/signup">
            Signup
          </Link>
        </p>
        <button
          disabled={
            loading ||
            !inputs.every((input) => input.validate(formData[input.id]))
          }
          type="submit"
          className="border disabled:opacity-50 block mx-auto rounded-full text-main-from border-main-from text-xl bg-btnColor py-2.5 px-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </Layout>
  );
};

export default Login;
