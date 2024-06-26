import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';
import Info from '../components/info';
import '../components/review.css';

function Review() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const { id } = location.state || {};
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [TAs, setTAs] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (id.includes("TA")) {
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getSlots", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedSlots(response.data.slots);
                        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getStudents").then((response) => {
                            if (response.status === 200) {
                                setStudents(response.data.students);
                                axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/tassistant/getappointments")
                                    .then((response) => {
                                        if (response.status === 200) {
                                            setAppointments(response.data.appointments);
                                        } else {
                                            alert("We could not get the appointments. Check your connection");
                                        }
                                    });
                            } else {
                                alert("We could not get the students. Check your connection");
                            }
                        });
                    } else {
                        alert("We could not get the slots. Check your connection");
                    }
                });
        } else {
            axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getappointments", { params: { email } })
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedAppointments(response.data.appointments);
                    } else {
                        alert("We could not get the appointments. Check your connection");
                    }
                });
        }
    }, [email, id]);

    useEffect(() => {
        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getcourses")
            .then((response) => {
                setSelectedCourses(response.data.courses);
                return axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/teacher/getTAs", { params: { selectedCourse: response.data.courses } });
            })
            .then((response) => {
                if (response.status === 200) {
                    setTAs(response.data.TAs);
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the courses or TAs!", error);
            });

        axios.get("https://rendezvous-csd-106ea9dcba7a.herokuapp.com/student/getExams")
            .then((response) => {
                if (response.status === 200) {
                    setExams(response.data.exams);
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the exams!", error);
            });
    }, []);

    const handleBack = () => {
        const path = id.includes("TA") ? '/tassistant' : '/student';
        navigate(path, { state: { id, email } });
    };

    const taColumns = React.useMemo(
        () => [
            { Header: 'Exam', accessor: 'exam' },
            { Header: 'Date', accessor: 'date' },
            { Header: 'AM', accessor: 'am' },
            { Header: 'FromTime', accessor: 'fromTime' },
            { Header: 'EndTime', accessor: 'endTime' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Message', accessor: 'message' },
        ],
        []
    );

    const taData = React.useMemo(
        () => selectedSlots.map((val) => {
            const matched_exam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
            const slotAppointment = appointments.find(appointment => appointment.slotId === val.slotid);
            const student = slotAppointment ? students.find(student => student.id === slotAppointment.studentId) : null;
            return {
                exam: matched_exam ? matched_exam.name : '',
                date: val.date,
                am: student ? student.student_number : '',
                fromTime: val.fromTime,
                endTime: val.endTime,
                status: val.status,
                message: student ? <a href={`mailto:${student.email}`}>Send Message</a> : ''
            };
        }),
        [selectedSlots, exams, appointments, students]
    );

    const studentColumns = React.useMemo(
        () => [
            { Header: 'Course', accessor: 'course' },
            { Header: 'Exam', accessor: 'exam' },
            { Header: 'TA', accessor: 'ta' },
            { Header: 'Date', accessor: 'date' },
            { Header: 'FromTime', accessor: 'fromTime' },
            { Header: 'EndTime', accessor: 'endTime' },
        ],
        []
    );

    const studentData = React.useMemo(
        () => selectedAppointments.map((val) => {
            const matchedCourse = selectedCourses.find(course => course.cid === val.cid);
            const matchedExam = exams.find(exam => exam.cid === val.cid && exam.eid === val.eid);
            const matched_TA = TAs.find(ta => ta.taid === val.taid);
            return {
                course: matchedCourse ? matchedCourse.code : 'N/A',
                exam: matchedExam ? matchedExam.name : 'N/A',
                ta: matched_TA ? matched_TA.lastname : 'N/A',
                date: val.date,
                fromTime: val.FromTime,
                endTime: val.EndTime
            };
        }),
        [selectedAppointments, selectedCourses, exams, TAs]
    );

    const tableInstance = useTable({
        columns: id.includes("TA") ? taColumns : studentColumns,
        data: id.includes("TA") ? taData : studentData
    });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const renderMobileTable = () => {
        return (
            <div className="mobile-table">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="mobile-row">
                        {row.cells.map((cell, cellIndex) => (
                            <div key={cellIndex} className="mobile-cell">
                                <strong>{headerGroups[0].headers[cellIndex].Header}:</strong> {cell.render('Cell')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`home-container ${windowWidth <= 428 ? 'mobile' : 'desktop'}`}>
            <Info email={email} />
            <div className="right">
                <div className="table-container">
                    {windowWidth <= 428 ? (
                        renderMobileTable()
                    ) : (
                        <table {...getTableProps()}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className='btn-group3'>
                    <button className="button" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left" style={{ paddingRight: '8px' }}></i>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Review;