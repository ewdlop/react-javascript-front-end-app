import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Calendar.css';

function Calendar() {
  const todos = useSelector((state) => state.todos.items);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTodosForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === date &&
             todoDate.getMonth() === currentDate.getMonth() &&
             todoDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const todosForDay = getTodosForDate(day);
      const isToday = day === new Date().getDate() && 
                     currentDate.getMonth() === new Date().getMonth() &&
                     currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <span className="day-number">{day}</span>
          <div className="day-todos">
            {todosForDay.map(todo => (
              <div 
                key={todo.id} 
                className={`todo-dot ${todo.priority} ${todo.completed ? 'completed' : ''}`}
                title={todo.text}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            &lt;
          </button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            &gt;
          </button>
        </div>
        <div className="calendar-grid">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="container">
        <h1>Calendar View</h1>
        {renderCalendar()}
        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Calendar; 