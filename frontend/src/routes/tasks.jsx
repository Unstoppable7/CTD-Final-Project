import PropTypes from "prop-types";
import TodoList from "../components/TodoList";
import { useState } from "react";
import TaskService from "../TaskService";
import { useLoaderData } from "react-router-dom";

export async function loader() {
   const result = await TaskService.getTasks();
   if (!result.success) {
      throw Error(result.message);
   }
   return result.data;
}

export default function Tasks() {
   const [sort, setSort] = useState({ field: 'title', asc: true });
   const sorter = (objA, objB) => {
      const fieldA = objA[sort.field];
      const fieldB = objB[sort.field];

      if (!fieldA || !fieldB) {
         return;
      }
      if (fieldA < fieldB) {
         return sort.asc ? -1 : 1;
      } else if (fieldA == fieldB) {
         return 0;
      } else {
         return sort.asc ? 1 : -1;
      }
   }
   const loaderData = useLoaderData().sort(sorter);
   return (
      <div>
         <p>Tasks</p>
         <TodoList initialData={loaderData} toggleHandleByParent={false} sorter={sorter} onAddTodoForm={true} />
      </div>
   );
}
