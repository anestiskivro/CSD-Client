import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/booking.css";
import Info from '../components/info';

function Booking() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const { id } = location.state || {};
  const [selectedHours, setSelectedHours] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examSelected, setExamSelected] = useState(null);
  const [TAs, setTAS] = useState([]);
  const [selectedTA, setTA] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  let examDurationInMinutes = 0;

  useEffect(() => {
    axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant").then((response) => {
      if (response.status === 200) {
        setCourses(response.data.data);
      }
    });
  }, []);

  const handleOptions = (event) => {
    if (event.target.value !== "Select a course...") {
      setSelectedCourse(event.target.value);
      axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/book", {
        params: { selectedCourse: event.target.value }
      }).then((response) => {
        if (response.status === 200) {
          setExams(response.data.exams);
          setExamSelected(null);
        }
      });
    }
  };

  const handleExamChange = (event) => {
    const selectedExamName = event.target.value;
    const foundExam = exams.find(exam => exam.name === selectedExamName);
    setExamSelected(foundExam);
    const duration = parseInt(foundExam.duration);
    examDurationInMinutes = duration;
    const availableHours = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += examDurationInMinutes) {
        let endHour = hour;
        let endMinute = minute + examDurationInMinutes;
        if (endMinute >= 60) {
          endMinute -= 60;
          endHour += 1;
        }
        if (endHour <= 21) {
          availableHours.push({ start: { hour, minute }, end: { hour: endHour, minute: endMinute } });
        }
      }
    }
    setAvailableHours(availableHours);
    axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/findTA", {
      params: { selectedExam: foundExam }
    }).then((response) => {
      if (response.status === 200) {
        setTAS(response.data.teaching_assistants);
      }
    });
  };

  const handleAssistantChange = (event) => {
    const selectedTA = event.target.value;
    setTA(selectedTA);
    if (!email.includes("csdp")) {
      axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getSlots", { params: { date: selectedDate, teaching_assistant: selectedTA } })
        .then((response) => {
          if (response.status === 200) {
            setAvailableSlots(response.data.availableSlots);
          } else {
            alert("We could not get the available slots. Check your connection");
          }
        });
    }
  };

  const handleDateChange = (date) => {
    const selectedDateObject = new Date(date);
    setSelectedDate(selectedDateObject);
    const selectDate = selectedDateObject.toDateString();
    if (!email.includes("csdp")) {
      axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getSlots", { params: { date: selectDate, teaching_assistant: selectedTA } })
        .then((response) => {
          if (response.status === 200) {
            setAvailableSlots(response.data.availableSlots);
          } else {
            alert("We could not get the available slots. Check your connection");
          }
        });
    }
  };

  const handleHourChange = (hour) => {
    const currentDate = selectedDate.toDateString();

    setSelectedHours(prevSelectedHours => {
      const updatedSelectedHours = { ...prevSelectedHours };

      if (!updatedSelectedHours[currentDate]) {
        updatedSelectedHours[currentDate] = [];
      }
      const hourIndex = updatedSelectedHours[currentDate].findIndex(selectedHour =>
        selectedHour.start.hour === hour.start.hour && selectedHour.start.minute === hour.start.minute
      );

      if (hourIndex === -1) {
        updatedSelectedHours[currentDate] = [...updatedSelectedHours[currentDate], hour];
      } else {
        updatedSelectedHours[currentDate] = updatedSelectedHours[currentDate].filter(selectedHour =>
          !(selectedHour.start.hour === hour.start.hour && selectedHour.start.minute === hour.start.minute)
        );
      }
      return updatedSelectedHours;
    });
  };

  const handleHourChangeStud = (start_slot, end_slot) => {
    if (selectedSlot && selectedSlot.start === start_slot && selectedSlot.end === end_slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ start: start_slot, end: end_slot });
    }
  };

  const handleSubmitBook = () => {
    const foundCourse = courses.find(course => course.code === selectedCourse);
    const cid = foundCourse.cid;
    const eid = examSelected.eid;
    const selectDate = selectedDate.toDateString();
    axios.post("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/book", {
      date: selectDate, cid: cid, eid: eid, email: email, FromTime: selectedSlot.start, EndTime: selectedSlot.end, selectedTA: selectedTA
    }).then((response) => {
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    });
  };

  const handleSubmit = () => {
    const foundCourse = courses.find(course => course.code === selectedCourse);
    const cid = foundCourse.cid;
    const eid = examSelected.eid;
    const dates = Object.keys(selectedHours);
    const hours = Object.values(selectedHours);
    console.log(hours)
    axios.post("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/book", { dates: dates, hours: hours, cid: cid, eid: eid, email: email, duration: examSelected.duration }).then((response) => {
      if (response.status === 200) {
        alert(response.data.message);
        
      } else {
        alert(response.data.message);
      }
    });
  };

  const handleBack = () => {
    if (id.includes("TA")) {
      navigate('/tassistant', { state: { id, email } });
    } else {
      navigate('/student', { state: { id, email } });
    }
  };

  return (
    <div className={`home-container ${isMobile ? 'mobile' : 'desktop'}`}>
    <div className="book">
      <Info email={email}></Info>
      <div className="right">
        {id.includes("TA") ? (
          <>
            <h3>Select a Course: {selectedCourse}</h3>
            <select name="course" onChange={handleOptions}>
              <option value="" selected disabled hidden>Select a course...</option>
              {courses.length > 0 && courses.map((opts, i) => <option key={i}>{opts.code}</option>)}
            </select>
            {(selectedCourse) && (
              <>
                <h4>Select Exam:</h4>
                <select name="exams" onChange={handleExamChange}>
                  <option value="" selected disabled hidden>Select an exam...</option>
                  {exams.length > 0 && exams.map((opts, i) => <option key={i}>{opts.name}</option>)}
                </select>
              </>
            )}
            {(selectedCourse && examSelected) && (
              <>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  minDate={new Date(examSelected.FromDate)}
                  maxDate={new Date(examSelected.ToDate)}
                  placeholderText="Select a date..."
                />
                <div className='container'>
                  <h4>Select Available Hours:</h4>
                  {availableHours.map((time, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={`hour-${time.start.hour}-${time.start.minute}`}
                        checked={selectedHours[new Date(selectedDate).toDateString()]?.some(hour => hour.start.hour === time.start.hour && hour.start.minute === time.start.minute) || false}
                        onChange={() => handleHourChange(time)}
                      />
                      <label htmlFor={`hour-${time.start.hour}-${time.start.minute}`}>
                        {`${time.start.hour}:${time.start.minute.toString().padStart(2, '0')} - ${time.end.hour}:${time.end.minute.toString().padStart(2, '0')}`}
                      </label>
                    </div>
                  ))}
                </div>
                <div className='btn-group'>
                  <button className='button' onClick={handleSubmit}>
                    <i className="fa-solid fa-paper-plane" style={{ paddingRight: '8px' }}></i>Submit</button>
                  <button className='button' onClick={handleBack}>
                    <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>Back</button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h3>Select a Course: {selectedCourse}</h3>
            <select name="course" onChange={handleOptions}>
              <option value="" selected disabled hidden>Select a course...</option>
              {courses.length > 0 && courses.map((opts, i) => <option key={i}>{opts.code}</option>)}
            </select>
            {(selectedCourse) && (
              <>
                <h4>Select Exam:</h4>
                <select name="exams" onChange={handleExamChange}>
                  <option value="" selected disabled hidden>Select an exam...</option>
                  {exams.length > 0 && exams.map((opts, i) => <option key={i}>{opts.name}</option>)}
                </select>
              </>
            )}
            {(selectedCourse && examSelected) && (
              <>
                <h5>Select Teaching Assistant:</h5>
                <select name="tassistant" onChange={handleAssistantChange}>
                  <option value="" selected disabled hidden>Select an Assistant...</option>
                  {TAs && TAs.map((opts, i) => <option key={i}>{opts.lastname}</option>)}
                </select>
              </>
            )}
            {(selectedCourse && examSelected && selectedTA) && (
              <>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  minDate={new Date(examSelected.FromDate)}
                  maxDate={new Date(examSelected.ToDate)}
                  placeholderText="Select a date..."
                />
                <div className='container'>
                  <h4>Select Available Slots:</h4>
                  {availableSlots && availableSlots.map((slot, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        id={`time-${slot.fromTime}-${slot.EndTime}`}
                        checked={selectedSlot?.start === slot.fromTime && selectedSlot?.end === slot.EndTime}
                        onChange={() => handleHourChangeStud(slot.fromTime, slot.EndTime)}
                      />
                      <label htmlFor={`hour-${slot.fromTime}-${slot.EndTime}`}>
                        {`${slot.fromTime} - ${slot.EndTime} at ${slot.date}`}
                      </label>
                    </div>
                  ))}
                </div>
                <div className='btn-group'>
                  <button className='button' onClick={handleSubmitBook}>
                    <i className="fa-solid fa-paper-plane" style={{ paddingRight: '8px' }}></i>Submit</button>
                  <button className='button' onClick={handleBack}>
                    <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                    Back</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
}

export default Booking;
