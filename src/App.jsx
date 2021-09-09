import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTodo from "./components/AddTodo/AddTodo";
import ShowTodo from "./components/ShowTodo/ShowTodo";
import { setTodo, selectTodos } from "./redux/todos/todoSlice";
import todoActions from "./redux/todos/actions";
import "./App.css";
import Pusher from "pusher-js";
// import { pusher_key } from "./pusherConfig";
import style from "./styles.module.css";

function App() {
  const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: "ap2",
  });

  const channel = pusher.subscribe("todos");

  const todos = useSelector(selectTodos),
    dispatch = useDispatch();

  useEffect(() => {
    fetchTodos();
    //eslint-disable-next-line
  }, []);

  const fetchTodos = async () => {
    const todosData = await todoActions.getTodo();
    dispatch(setTodo(todosData));
  };

  useEffect(() => {
    channel.bind("inserted", ({ todoDetails }) => {
      // dispatch(pusherTodo(todoDetails));
      fetchTodos();
    });
    channel.bind("updated", () => {
      fetchTodos();
    });
    channel.bind("deleted", () => {
      fetchTodos();
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
    //eslint-disable-next-line
  }, [todos]);

  const addTodo = (todo) => {
    todoActions.addTodo(todo);
  };

  return (
    <div className="app">
      <div className={style.navbar}>
        <h1>Todo Web App</h1>
      </div>

      <div className={style.appContainer}>
        <div className="bg" />
        <div className="bg bg2" />
        <div className="bg bg3" />
        <div className="container">
          <AddTodo addTodo={addTodo} />
          <ShowTodo todos={todos} />
        </div>
      </div>
    </div>
  );
}

export default App;
