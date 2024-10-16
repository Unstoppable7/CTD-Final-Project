import { useState } from "react";
import InputWithLabel from "./InputWithLabel";
import PropTypes from 'prop-types';
import styles from "../css/AddTodoForm.module.css"

export default function AddTodoForm({ onAddTodo }) {
   const [todoTitle, setTodoTitle] = useState("");

   async function handleAddTodo(event) {
      event.preventDefault();
      await onAddTodo({ title: todoTitle });
      setTodoTitle("");
   }

   return (
      <form onSubmit={handleAddTodo} className={styles.addTodoForm}>
         <InputWithLabel todoTitle={todoTitle} handleTitleChange={(e) => setTodoTitle(e.target.value)} ></InputWithLabel>
         <button hidden={true}>Add</button>
      </form>
   );
}

AddTodoForm.propTypes = {
   onAddTodo: PropTypes.func,
}