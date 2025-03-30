import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  handleCheckCompletedAllTodos: () => void;
  handleAddTodo: (title: string) => void;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  handleCheckCompletedAllTodos,
  handleAddTodo,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleCheckCompletedAllTodos}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();
          if (inputRef.current) {
            handleAddTodo(inputRef.current.value);
            inputRef.current.value = '';
          }
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
