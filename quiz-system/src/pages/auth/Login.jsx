import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {

      localStorage.setItem(
        "token",
        "fake-token"
      );

      localStorage.setItem(
        "role",
        "admin"
      );

      navigate("/admin");

    } else {

      localStorage.setItem(
        "token",
        "fake-token"
      );

      localStorage.setItem(
        "role",
        "user"
      );

      navigate("/");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">

      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-xl p-10 rounded-[35px] w-[420px] border border-white/20 shadow-2xl"
      >

        <h1 className="text-5xl font-bold text-white text-center mb-10">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 rounded-2xl mb-5 bg-white/20 border border-white/20 text-white placeholder:text-gray-200 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-2xl mb-8 bg-white/20 border border-white/20 text-white placeholder:text-gray-200 outline-none"
        />

        <button className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 duration-300">
          Login
        </button>

        <p className="text-white text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="font-bold ml-2"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;