import React, { useState } from 'react'
import img1 from '../images/img1.png';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import { Link } from "react-router-dom";
import ConfirmModal from '../assets/ConfirmModal';

export default function HomePage({isLoggedIn, handleLogout}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <div >
      <div>
        
        <h2 className="mx-5">Stay Focused, Stay Organized!</h2>
        <div className="mx-5 fs-5">Manage your daily noteswithout distractions. — all in one place.</div>

        <div className="container my-4">
          <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel" data-bs-pause="hover" data-bs-interval="3000">
            <div className="carousel-inner rounded overflow-hidden">
              <div className="carousel-item active" style={{ height: "45vh" }}>
                <img src={img1} className="d-block w-100 h-100 object-fit-cover" alt="Slide 1"/>
              </div>
              <div className="carousel-item" style={{ height: "45vh" }}>
                <img src={img2} className="d-block w-100 h-100 object-fit-cover" alt="Slide 2"/>
              </div>
              <div className="carousel-item" style={{ height: "45vh" }}>
                <img src={img3} className="d-block w-100 h-100 object-fit-cover" alt="Slide 3"/>
              </div>
              <div className="carousel-caption d-flex flex-column justify-content-center" 
              style={{background: 'rgba(0, 0, 0, 0.45)',borderRadius: '10px',padding: '20px'}}>
                <h3>A simpler way to manage your thoughts</h3>
                <p>All your notes, thoughtfully organized. Designed to help you focus and get more done every day.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mx-5" style={{ backgroundColor: 'rgba(53, 78, 99, 0.34)' }}>
          <div className="card-body">
            <h5 className="card-title">Start organizing your ideas today...</h5>
            <p className="card-text">NoteBook! is a simple productivity app made to help you keep your notes  in one easy place. Instead of juggling multiple tools, everything you need is brought together in a clean, intuitive interface. It helps you plan your day, stay organized, and get things done—without feeling overwhelmed.
              <br/>Create your account and take control of your notes.</p>
            
            {isLoggedIn ? (
                    <p className='fs-5'>“You’re signed in — jump back into your work.”</p>
                ) : (<Link to="/signup"className="btn btn-dark mx-5">Get Started! </Link>)}
          </div>
        </div>
        
      </div>

      <ConfirmModal
              show={showLogoutModal}
              title="Confirm Logout"
              message="Are you sure you want to logout?"
              onCancel={() => setShowLogoutModal(false)}
              onConfirm={() => {
                handleLogout();
                setShowLogoutModal(false);
              }}
            />
    </div>
  )
}
