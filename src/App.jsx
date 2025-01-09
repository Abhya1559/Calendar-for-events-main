import React, { useState } from "react";

function App() {
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    start: "",
    end: "",
    description: "",
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [sidePanelVisible, setSidePanelVisible] = useState(false);

  const handleDayClick = (day) => {
    if (isPastDate(day)) return; // Prevent setting events on past dates
    setSelectedDay(day);
    setModalVisible(true);
  };

  const handleEventSave = () => {
    if (!selectedDay || isPastDate(selectedDay)) return; // Don't allow saving events for past dates

    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    setEvents((prev) => {
      const updatedEvents = { ...prev };
      if (editingEventIndex !== null) {
        updatedEvents[dateKey][editingEventIndex] = newEvent;
      } else {
        updatedEvents[dateKey] = [...(updatedEvents[dateKey] || []), newEvent];
      }
      return updatedEvents;
    });

    setNewEvent({
      name: "",
      start: "",
      end: "",
      description: "",
    });
    setEditingEventIndex(null);
    setModalVisible(false);
  };

  const handleEditEventClick = (eventIndex) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    setNewEvent(events[dateKey][eventIndex]);
    setEditingEventIndex(eventIndex);
  };

  const handleDeleteEvent = (eventIndex) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    setEvents((prev) => {
      const updatedEvents = { ...prev };
      updatedEvents[dateKey].splice(eventIndex, 1);
      if (updatedEvents[dateKey].length === 0) delete updatedEvents[dateKey];
      return updatedEvents;
    });
  };

  const isPastDate = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return selectedDate < new Date(); // Compare with current date
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);

    const calendar = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(null); // Empty cells for alignment
    }
    for (let day = 1; day <= totalDays; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const handleMonthChange = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
    setSelectedDay(null); // Clear selection when switching months
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calendar = generateCalendar();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Event Planner</h1>
        <button
          onClick={() => setSidePanelVisible(!sidePanelVisible)}
          className="lg:hidden text-white text-3xl"
        >
          &#9776;
        </button>
      </header>

      <div className="flex flex-1 gap-8 p-6">
        {/* Calendar Section */}
        <div className="bg-white shadow-xl rounded-xl p-8 w-2/3">
          <div className="flex justify-between items-center mb-6">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
              onClick={() => handleMonthChange(-1)}
            >
              Previous
            </button>
            <h2 className="text-2xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
              onClick={() => handleMonthChange(1)}
            >
              Next
            </button>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                  day
                    ? "bg-white hover:bg-indigo-100 cursor-pointer text-center"
                    : "bg-transparent"
                } ${selectedDay === day ? "bg-indigo-500 text-white" : ""}`}
                onClick={() => day && handleDayClick(day)}
                style={
                  isPastDate(day)
                    ? { pointerEvents: "none", backgroundColor: "#f3f4f6" }
                    : {}
                }
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel Section */}
        <div
          className={`w-1/3 bg-white p-6 shadow-xl h-full transform transition-transform ease-in-out lg:translate-x-0 ${
            sidePanelVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">
            Events on {selectedDay}
          </h3>
          {(
            events[
              `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`
            ] || []
          ).map((event, index) => (
            <div key={index} className="p-4 border-b">
              <h4 className="font-semibold">{event.name}</h4>
              <p className="text-gray-500">
                {event.start} - {event.end}
              </p>
              <p className="text-gray-600">{event.description}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleEditEventClick(index)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-full flex items-center"
                >
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full flex items-center"
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalVisible && selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-6">
              {editingEventIndex !== null ? "Edit Event" : "Add Event"}
            </h3>
            <input
              type="text"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              className="block w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="time"
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
              className="block w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="time"
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
              className="block w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="block w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-400 transition duration-200"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                disabled={isPastDate(selectedDay)}
                className={`${
                  isPastDate(selectedDay)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 text-white"
                } px-5 py-2 rounded-full hover:bg-indigo-700 transition duration-200`}
                onClick={handleEventSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-200 py-4 text-center">
        <p className="text-gray-600">
          © 2025 Event Planner. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
