import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todoFilter: Todo[];
  handleUpdateTodo: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<TodoListProps> = ({
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
          isLoading={false}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={() => {}}
          isLoading={true}
        />
      )}
    </section>
  );
};
