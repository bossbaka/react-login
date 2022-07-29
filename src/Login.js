import React, { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "./context/AuthProvider";
import { useForm } from "react-hook-form";

import axios from "./api/axios.js";
const LOGIN_URL = "/auth";

function Login() {
  const { setAuth } = useContext(AuthContext);

  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");

  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setErrMsg("");
  }, [user, pw]);

  const onSubmit = async (e, values) => {
    console.log(e);
    console.log(values);

    try {
      const respon = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd: pw }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(respon?.data);

      const accessToken = respon?.data?.accessToken;
      const roles = respon?.data?.roles;
      setAuth({ user, pw, roles, accessToken });

      setSuccess(true);
      setUser("");
      setPw("");
      reset();
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {success ? (
        <>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </>
      ) : (
        <>
          <p ref={errRef}>{errMsg}</p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Username:</label>
            <input
              type="text"
              {...register("user", {
                value: user,
                onChange: (e) => setUser(e.target.value),
                required: "You must specify a Username",
                pattern: {
                  value: /^[A-z][A-z0-9-_]{3,23}$/,
                  message: "Invalid Entry",
                },
              })}
            />

            <div className="error">{errors.user && errors.user.message}</div>

            <label>Password:</label>
            <input
              type="password"
              {...register("password", {
                value: pw,
                onChange: (e) => setPw(e.target.value),
                required: "You must specify a password",
              })}
            />
            <div className="error">
              {errors.password && errors.password.message}{" "}
            </div>

            <button type="sumbit">Sign In</button>

            <p>
              Need an Account? <br /> <a href="#"> Sign Up </a>
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
