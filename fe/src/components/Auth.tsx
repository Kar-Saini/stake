import React, { useState } from "react";
import SERVER from "../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Auth = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setLoading(true);
    if (formState === "login") {
      const result = await axios.post<{
        message: string;
        id: string;
        token: string;
      }>(SERVER + "/signin", {
        email,
        password,
      });
      if (result.data) {
        toast.success(result.data.message);
        console.log(result);
        localStorage.setItem("token", result.data.token);
        navigate("/");
      }
    }
    if (formState === "register") {
      try {
        const result = await axios.post<{ message: string; id: string }>(
          SERVER + "/register",
          {
            email,
            password,
            name,
          }
        );
        if (result.status === 200) {
          toast.success(result.data.message as string);
          setFormState("login");
        }
      } catch (error) {
        console.log(error);
        toast.error("Email exists");
      }
    }
    setEmail("");
    setName("");
    setPassword("");
    setLoading(false);
  }

  const handleToggle = () => {
    setFormState((prevState) => (prevState === "login" ? "register" : "login"));
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
      <div className="flex flex-col w-full max-w-md bg-gray-800 shadow-lg rounded-md p-8 gap-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="italic text-5xl font-extrabold tracking-wide text-white mb-4">
            Stake
          </h1>
          <p className="text-neutral-400">
            {formState === "login"
              ? "Welcome back! Please log in."
              : "Join us today! Create an account."}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-y-4">
          {formState === "register" && (
            <InputBox
              label="Name"
              id="name"
              value={name}
              type="text"
              onChange={setName}
            />
          )}
          <InputBox
            label="Email"
            id="email"
            value={email}
            type="email"
            onChange={setEmail}
          />
          <InputBox
            label="Password"
            id="password"
            value={password}
            type="password"
            onChange={setPassword}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || email === "" || password === ""}
          className={`py-3 w-full rounded-md text-white font-bold ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-x-2">
              <span className="loader"></span> Processing...
            </div>
          ) : (
            "Submit"
          )}
        </button>

        {/* Toggle Login/Register */}
        <div className="text-center mt-4 text-sm text-neutral-400">
          {formState === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={handleToggle}
                className="text-blue-400 underline hover:text-blue-500"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={handleToggle}
                className="text-blue-400 underline hover:text-blue-500"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function InputBox({
  label,
  id,
  value,
  type,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  type: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={id} className="text-sm text-neutral-400 font-semibold">
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        className="bg-gray-700 text-gray-300 text-sm rounded-md outline-none p-3 focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default Auth;
