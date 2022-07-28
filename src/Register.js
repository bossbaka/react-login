import React, { useState, useEffect, useRef } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import axios from "./api/axios";

const REGISTER_URL = "/register";

function Register() {
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
      const respon = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd: pw }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
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
    <section>
      <h1>Register</h1>

      <p ref={errRef}>{errMsg}</p>

      {success ? (
        <>
          <h1>Success!</h1>
          <p>
            <a href="#"> Sign In </a>
          </p>
        </>
      ) : (
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

          <label>Confirm Password:</label>
          <input
            type="password"
            {...register("password_repeat", {
              value: matchPw,
              onChange: (e) => setPw(e.target.value),
              required: "You must specify a password",
              validate: (value) =>
                value === pwd || "The passwords do not match",
            })}
          />
          <div className="error">
            {errors.password_repeat && errors.password_repeat.message}{" "}
          </div>

          <button type="sumbit">Sign Up</button>
          <p>
            Already registered? <br /> <a href="#"> Sign In </a>
          </p>
        </form>
      )}
    </section>
  );
}

export default Register;
