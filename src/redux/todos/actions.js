import axios from "axios";

const todoActions = {
  getTodo: async () => {
    return await axios
      .get(`${process.env.REACT_APP_BASE_URL}/all`)
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },

  // adding data to mongo db only
  addTodo: (todo) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/add`, {
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
      .put(`${process.env.REACT_APP_BASE_URL}/check`, { todo })
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },

  deleteTodo: async (todo) => {
    return await axios
      .delete(`${process.env.REACT_APP_BASE_URL}/delete`, { data: todo })
      .then(({ data }) => data)
      .catch((err) => console.log(err));
  },
};
export default todoActions;
