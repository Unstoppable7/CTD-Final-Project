import TodoItem from "./TodoItem";

export default function TodoList({ todoList, onCheckedItem, onDeleteItem }) {

   return (
      <div>
         {todoList.map((task) => {
            return (<TodoItem key={task._id} item={task} toggleHandleByParent={false} onCheckedItem={() => onCheckedItem({ _id: task._id, completed: !task.completed })} onDeleteItem={() => onDeleteItem(task._id)}/>);
         })}
      </div>
   );
}