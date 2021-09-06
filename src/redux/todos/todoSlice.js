import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodo: (state, { payload }) => {
      state.todos = payload;
    },
    pusherTodo: (state, action) => {
      state.todos.push(action.payload);
    },
  },
});

export const { setTodo, pusherTodo } = todoSlice.actions;

export const selectTodos = (state) => state.todos.todos;

export default todoSlice.reducer;
