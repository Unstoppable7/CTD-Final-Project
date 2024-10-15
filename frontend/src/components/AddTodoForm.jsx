import { useState } from "react";
import InputWithLabel from "./InputWithLabel";
import PropTypes from 'prop-types';

export default function AddTodoForm({ onAddTodo }) {
   const [todoTitle, setTodoTitle] = useState("");

   async function handleAddTodo(event) {
      event.preventDefault();
      await onAddTodo({ title: todoTitle });
      setTodoTitle("");
   }

   function handleTitleChange(event) {
      let newTodoTitle = event.target.value;
      setTodoTitle(newTodoTitle);
   }

   return (
      <form onSubmit={handleAddTodo}>
         <InputWithLabel todoTitle={todoTitle} handleTitleChange={handleTitleChange} >Title: </InputWithLabel>
         <button >Add</button>
      </form>
   );
}

AddTodoForm.propTypes = {
   onAddTodo: PropTypes.func,
}