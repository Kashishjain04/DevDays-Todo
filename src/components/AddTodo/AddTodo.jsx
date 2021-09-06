import React, { useState } from "react";
import "./AddTodo.css";
import Send from "@material-ui/icons/Send";

function AddTodo({ addTodo }) {
  const [todo, setTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(todo);
    setTodo("");
  };
  return (
    <div className="addTodo">
      <form className="addTodo__container" onSubmit={handleSubmit}>
        <input
          className="addTodo__input"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          placeholder="Todo"
          required
        />
        <button className="addTodo__btn" type="submit">
          {/* Add Todo */}
          <Send />
        </button>
      </form>
    </div>
  );
}

export default AddTodo;
