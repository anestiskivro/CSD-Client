import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './appointment.css';

function Appointment({ id, email }) {
  const navigate = useNavigate();
  const handleBook = async () => {
    navigate('book', { state: { id,email } });
  }
  const handleCancel = async () => {
    navigate('cancel', { state: { id,email } });
  }
  const handleReview = async () => {
    navigate('review', { state: { id,email } });
  }
  const handleComment = async () => {
    navigate('addComment', { state: { id,email } });
  }
  const handleReviewComments = async () => {
    navigate('reviewcomments', { state: { id,email } });
  }
  const handleEvaluation = async () => {
    navigate('addeval', { state: { id,email} });
  }
  return (
    <div className="right">
      {id.includes("TA") ? (
        <>
          <div className="btn-group1">
            <button className='button' onClick={handleBook}>
              <i className="fa-solid fa-book" style={{ paddingRight: '8px' }}></i>Book
            </button>
            <button className='button' onClick={handleCancel}>
              <i className="fa-solid fa-xmark" style={{ paddingRight: '8px' }}></i>Cancel
            </button>
          </div>
          <div className="btn-group2">
            <button className='button' onClick={handleReview}>
              <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>Review</button>
            <button className='button' onClick={handleReviewComments}>
              <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>Review Comments from Students</button>
            <button className='button' onClick={handleEvaluation}>
              <i className="fa-solid fa-plus" style={{ paddingRight: '8px' }}></i>Add Evaluation For Students</button>
          </div>
        </>
      ) : (
        <>
          <div className="btn-group1">
            <button className='button' onClick={handleBook}>
              <i className="fa-solid fa-book" style={{ paddingRight: '8px' }}></i>Book
            </button>
            <button className='button' onClick={handleCancel}>
              <i className="fa-solid fa-xmark" style={{ paddingRight: '8px' }}></i>Cancel
            </button>
          </div>
          <div className="btn-group2">
            <button className='button' onClick={handleReview}>
              <i className="fa-solid fa-table" style={{ paddingRight: '8px' }}></i>Review
            </button>
            <button className='button' onClick={handleComment}>
              <i className="fa-solid fa-plus" style={{ paddingRight: '8px' }}></i>Add Comment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Appointment;
