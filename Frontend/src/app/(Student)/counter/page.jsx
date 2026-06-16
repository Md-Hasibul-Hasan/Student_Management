"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


import { increment, decrement, customInc } from "@/features/count/countSlice";

import { fetchUsers, } from "@/features/count/countThunk";

export default function Home() {

  const dispatch = useDispatch();

  const {
    value,
    users,
    loading,
  } = useSelector(
    (state) => state.counter
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-10">

      <h1>
        Counter: {value}
      </h1>

      <button
        onClick={() =>
          dispatch(increment())
        }
      >
        +
      </button>

      <button
        onClick={() =>
          dispatch(decrement())
        }
      >
        -
      </button>

      <button
        onClick={() =>
          dispatch(customInc(5))
        }
      >
        +5
      </button>

      <hr />

      <h2>Users</h2>

      {loading && (
        <p>Loading...</p>
      )}

      {users.map((user) => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}

    </div>
  );
}