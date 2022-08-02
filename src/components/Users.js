import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hook/useAxiosPrivate";
//import axios from "../api/axios";
//import useRefreshToken from "../hook/useRefreshToken";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState();
  //const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        console.log(err);
        //navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h2>Users List</h2>

      {users?.length ? (
        <ul>
          {users?.map((user, index) => (
            <li key={index}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      {/* <button onClick={() => refresh()}>Refresh</button> */}
    </div>
  );
};

export default Users;
