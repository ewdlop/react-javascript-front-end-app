import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorderTodos } from '../store/todoSlice';
import TodoItem from './TodoItem';
import './DragDropTodoList.css';

function DragDropTodoList({ todos }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.todos?.theme || 'light');

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (source.index === destination.index) {
      return;
    }

    dispatch(reorderTodos({
      startIndex: source.index,
      endIndex: destination.index
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`drag-drop-list ${snapshot.isDraggingOver ? 'dragging-over' : ''} ${theme}`}
          >
            {todos.map((todo, index) => (
              <Draggable 
                key={todo.id} 
                draggableId={todo.id.toString()} 
                index={index}
                isDragDisabled={todo.completed}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                  >
                    <TodoItem 
                      todo={todo} 
                      index={index}
                      isDragDisabled={todo.completed}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {todos.length === 0 && (
              <div className="empty-list-message">
                No tasks found. Add a new task to get started!
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DragDropTodoList; 