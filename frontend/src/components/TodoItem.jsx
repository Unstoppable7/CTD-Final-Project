import PropTypes from 'prop-types';
import { useState, React, useEffect, useRef } from 'react';
import TodoList from './TodoList';
import styles from "../css/TodoItem.module.css"

export default function TodoItem({ item, toggleHandleByParent, onCheckedItem, onDeleteItem, sorter }) {
   const [toggle, setToggle] = useState(false);
   const [addTodoChild, setAddTodoChild] = useState(false);
   const divRefAddTodoForm = useRef(null);

   const onToggle = () => {
      setToggle((previousState) => !previousState);
   };

   useEffect(() => {
      const handleFocusOut = (event) => {
         if (!divRefAddTodoForm.current.contains(event.relatedTarget)) {
            setAddTodoChild(false);
         }
      };

      const currentDiv = divRefAddTodoForm.current;
      currentDiv.addEventListener("focusout", handleFocusOut);

      return () => {
         currentDiv.removeEventListener("focusout", handleFocusOut);
      };
   }, []);

   return (
      <div className={`${styles.todoItem} ${item.completed ? styles.completed : ""}`} hidden={toggleHandleByParent}>
         <div className={styles.container}>
            <div className={styles.subContainerLeft}>
               <div className={styles.actions}>
                  <button className={styles.toggleButton} type='button' onClick={onToggle}>toggle</button>
               </div>

               <div className={styles.todoContent} onDoubleClick={() => { setAddTodoChild(true); setToggle(true) }} >
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.dueDate}>{item.dueDate}</div>
                  <div className={styles.priority}>{item.priority}</div>
               </div>
            </div>
            <div className={`${styles.actions} ${styles.subContainerRight}`}>
               <button className={styles.checkButton} type='button' onClick={onCheckedItem}>check</button>
               <button className={styles.deleteButton} type='button' onClick={onDeleteItem}>delete</button>
            </div>
         </div>
         <div hidden={!toggle} tabIndex={"0"} ref={divRefAddTodoForm}>
            <TodoList initialData={[]} parentId={item._id} toggleHandleByParent={!toggle} sorter={sorter} onAddTodoForm={addTodoChild} />
         </div>
      </div>
   );
}

TodoItem.propTypes = {
   item: PropTypes.object,
   toggleHandleByParent: PropTypes.bool,
   onCheckedItem: PropTypes.func,
   onDeleteItem: PropTypes.func,
   sorter: PropTypes.func
}