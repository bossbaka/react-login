import React, { useState, useEffect, useRef } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";

function Register() {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();

  let pwd = watch("password");

  const onSubmit = (values) => console.log(values);

  return (
    <section>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username:</label>
        <input
          type="text"
          {...register("user", {
            onChange: (e) => console.log(e),
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
            required: "You must specify a password",
            validate: (value) => value === pwd || "The passwords do not match",
          })}
        />
        <div className="error">
          {errors.password_repeat && errors.password_repeat.message}{" "}
        </div>

        <button type="sumbit">Sign Up</button>
        <p>
          Already registered? <br /> Sign In
        </p>
      </form>
    </section>
  );
}

export default Register;
