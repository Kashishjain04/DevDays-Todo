import { IconButton } from "@material-ui/core";
import { Clear, Delete, Done } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import todoActions from "../../redux/todos/actions";
import { setTodo } from "../../redux/todos/todoSlice";
import "./ShowTodo.css";

function ShowTodo({ todos }) {
  const dispatch = useDispatch();

  const checkHandler = async (todo) => {
    await todoActions.checkTodo(todo).then(async (res) => {
      if (res === "Todo Updated successfully !!") {
        const todosData = await todoActions.getTodo();
        dispatch(setTodo(todosData));
      }
    });
  };
  const deleteHandler = async (todo) => {
    await todoActions.deleteTodo(todo).then(async (res) => {
      if (res === "Todo Deleted successfully !!") {
        const todosData = await todoActions.getTodo();
        dispatch(setTodo(todosData));
      }
    });
  };
  return (
    <ul className="todos">
      {todos?.map((todo, index) => (
        <li
          key={index}
          className={todo.check ? "todos__item checked" : "todos__item"}
        >
          <h3>{todo.todo}</h3>
          {todo.check ? (
            <IconButton onClick={() => checkHandler(todo)}>
              <Clear />
            </IconButton>
          ) : (
            <IconButton onClick={() => checkHandler(todo)}>
              <Done />
            </IconButton>
          )}
          <IconButton onClick={() => deleteHandler(todo)}>
            <Delete />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
export default ShowTodo;
