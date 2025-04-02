import { useState } from "react";
import Layout from "../UI/Layout";
import useRequest from "../hooks/use-request";
import { Link, useNavigate } from "react-router-dom";

const inputs = [
  {
    type: "text",
    id: "name",
    placeholder: "Full name",
    validate: (value = "") => /^[a-zA-Z_]\w{2,}$/.test(value),
    message: "Please enter a valid name",
  },
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

const Signup = () => {
  const {
    loading,
    error,
    sendRequest: signupReq,
  } = useRequest(() => {
    navigate("/login");
  });
  const [formData, setFormData] = useState({});
  const [inputsTouched, setInputsTouched] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = inputs.every((input) =>
      input.validate(formData[input.id])
    );

    if (isFormValid) {
      signupReq({
        endpoint: "/users/signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  return (
    <Layout className="bg-main flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="-translate-y-14 bg-white rounded-3xl p-4 shadow-lg max-w-full w-[600px]"
      >
        <h1 className="text-4xl text-center mt-5">Signup</h1>
        <div className="mt-10 mb-5">
          {inputs.map((input) => (
            <div key={input.id} className="my-5">
              <input
                autoFocus={input.id === "name"}
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
          Already have an account?{" "}
          <Link className="underline text-main-from font-semibold" to="/login">
            Login
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
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </Layout>
  );
};

export default Signup;
