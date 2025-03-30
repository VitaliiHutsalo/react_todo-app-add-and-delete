/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Errors } from './types/Errors';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilterTodo, setStatusFilterTodo] = useState(FilterBy.All);
  const [warning, setWarning] = useState<Errors | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setWarning(null);

    const timer = setTimeout(() => {
      setWarning(null);
    }, 3000);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setWarning(Errors.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const todoFilter = todos.filter(todo => {
    if (statusFilterTodo === FilterBy.All) {
      return true;
    }

    if (statusFilterTodo === FilterBy.Active) {
      return !todo.completed;
    }

    if (statusFilterTodo === FilterBy.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setWarning(Errors.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTodoToAdd: Todo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(newTodoToAdd);

    setWarning(null);

    try {
      const todo = await addTodo(newTodoToAdd);

      setTodos(currentTodos => [...currentTodos, todo[0]]);
      setTempTodo(null);
    } catch (error) {
      setWarning(Errors.Add);
      setTempTodo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setWarning(Errors.Delete);
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, isDeleting: false } : todo,
          ),
        );
      });
  };

  const handleCheckCompletedAllTodos = () => {
    const checkCompletedAll = todos.every(todo => todo.completed);

    setTodos(
      todos.map(todo => ({
        ...todo,
        completed: !checkCompletedAll,
      })),
    );
  };

  const handleClearTodo = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);
    setWarning(null);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const failedIds = completedTodos
          .filter((_, i) => results[i].status === 'rejected')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );

        if (failedIds.length > 0) {
          setWarning(Errors.Delete);
        }
      })
      .finally(() => setIsLoading(false));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TodoHeader
              handleCheckCompletedAllTodos={handleCheckCompletedAllTodos}
              todos={todos}
              handleAddTodo={handleAddTodo}
              isLoading={isLoading}
            />
            <TodoList
              tempTodo={tempTodo}
              todoFilter={todoFilter}
              handleUpdateTodo={handleUpdateTodo}
              handleDeleteTodo={handleDeleteTodo}
            />
            <TodoFooter
              todos={todos}
              statusFilterTodo={statusFilterTodo}
              setStatusFilterTodo={setStatusFilterTodo}
              handleClearTodo={handleClearTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification warning={warning} setWarning={setWarning} />
    </div>
  );
};
