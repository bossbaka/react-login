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
  const [matchPw, setMatchPw] = useState("");

  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  let pwd = watch("password");

  useEffect(() => {
    setErrMsg("");
  }, [user, pw, matchPw]);

  const onSubmit = async (e, values) => {
    console.log(e);
    console.log(values);

    try {
      const respon = await axios.post(LOGIN_URL, JSON.stringify({ user, pw }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(respon?.data);
      console.log(respon);
      console.log(JSON.stringify(respon));
      setSuccess(true);

      setUser("");
      setPw("");
      setMatchPw("");
      reset();
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}

export default Login;
