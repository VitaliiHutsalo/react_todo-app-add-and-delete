import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  deletedIds: number[];
  todoFilter: Todo[];
  handleUpdateTodo: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<TodoListProps> = ({
  deletedIds,
  todoFilter,
  handleUpdateTodo,
  handleDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoFilter.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={deletedIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <>
          <TodoItem
            key="tempTodo"
            todo={tempTodo}
            handleUpdateTodo={() => {}}
            handleDeleteTodo={() => {}}
            isLoading={true}
          />
        </>
      )}
    </section>
  );
};
