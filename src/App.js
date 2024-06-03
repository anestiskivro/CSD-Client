import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import SetExams from './components/setExams';
import Teachingassistant from './components/setTAs';
import AddComment from './pages/AddComment';
import AddEvaluation from './pages/AddEvaluation';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import Cancellation from './pages/Cancellation';
import Home from './pages/Home';
import NotesTA from './pages/NotesTA';
import Review from './pages/Review';
import ReviewComments from './pages/Review_Comments';
import Student from './pages/Student';
import StudentsSlots from './pages/StudentsSlots';
import TASlots from './pages/TASlots';
import TAssistant from './pages/TAssistant';
import Teacherinstud from './pages/Teacher_ins_stud';
import Teacherpage from './pages/Τeacher_page';
function App() {
  axios.defaults.withCredentials = true
  return (
    <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path ='/tassistant' element = {<TAssistant/>}/>
        <Route path='/tassistant/book' element={<Booking/>}/>
        <Route path='/tassistant/review' element={<Review/>}/>
        <Route path='/tassistant/reviewcomments' element={<ReviewComments/>}/>
        <Route path='/tassistant/cancel' element={<Cancellation/>}/>
        <Route path='/tassistant/addeval' element={<AddEvaluation/>}/>
        <Route path='/student' element={<Student/>}/>
        <Route path='/student/book' element={<Booking/>}/>
        <Route path='/student/review' element={<Review/>}/>
        <Route path='/student/cancel' element={<Cancellation/>}/>
        <Route path='/student/addComment' element={<AddComment/>}/>
        <Route path="/teacher" element={<Teacherpage/>}/>
        <Route path="/teacher/insertstud" element={<Teacherinstud />}/>
        <Route path="/teacher/SetTAs" element={<Teachingassistant />}/>
        <Route path="/teacher/setExams" element={<SetExams />}/>
        <Route path='/teacher/reviewcomments' element={<ReviewComments/>}/>
        <Route path='/teacher/getNotes' element={<NotesTA/>}/>
        <Route path='/teacher/TAslots' element={<TASlots/>}/>
        <Route path='/teacher/Studslots' element={<StudentsSlots/>}/>
        </Routes>
      </div>
  );
}

export default App;
