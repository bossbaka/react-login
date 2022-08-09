import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import axios from "../api/axios.js";
import useAuth from "../hook/useAuth";

import { Link, useNavigate, useLocation } from "react-router-dom";
//import useLocalStorage from "../hook/useLocalStorage.js";
import useInput from "../hook/useInput.js";
import useToggle from "../hook/useToggle.js";

const LOGIN_URL = "/auth";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const errRef = useRef();

  const [user, resetU, useAttribs] = useInput("user", ""); // useState
  const [pw, setPw] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);

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

      navigate(from, { replace: true });
      //setUser("");
      resetU();
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
    <section>
      <h1>Login</h1>

      <>
        <p ref={errRef}>{errMsg}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Username:</label>
          <input
            type="text"
            {...register("user", {
              // value: user,
              // onChange: (e) => setUser(e.target.value),
              required: "You must specify a Username",
              pattern: {
                value: /^[A-z][A-z0-9-_]{3,23}$/,
                message: "Invalid Entry",
              },
            })}
            {...useAttribs}
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

          <div className="persistCheck">
            <input
              type="checkbox"
              id="persist"
              onChange={toggleCheck}
              checked={check}
            />
            <label htmlFor="persist">Trust This Device</label>
          </div>

          <button type="sumbit">Sign In</button>

          <p>
            Need an Account? <br /> <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </>
    </section>
  );
}

export default Login;
