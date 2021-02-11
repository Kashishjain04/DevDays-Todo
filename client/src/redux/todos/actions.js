import axios from "axios";

const todoActions = {
  getTodo: async () => {
    return await axios
      .get("/todos/")
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },

  // adding data to mongo db only
  addTodo: (todo) => {
    axios
      .post("/todos/", {
        todo: {
          todo,
          check: false,
        },
      })
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },
  checkTodo: async (todo) => {
    return await axios
      .put("/todos/", { todo })
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },

  deleteTodo: async (todo) => {
    return await axios
      .delete("/todos/", { data: todo })
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },
};
export default todoActions;
