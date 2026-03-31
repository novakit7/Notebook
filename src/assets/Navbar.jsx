import { Link } from "react-router-dom";
import image from '../images/Navtitle.png'

export default function Navbar({isLoggedIn}) {

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={image} alt="Quick Notes Logo" style ={{height: "42px"}} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>


          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {isLoggedIn && (
                  <li className="nav-link text-white fw-medium">
                    <Link className="btn btn-dark" to = '/notes'
                    style={{ cursor: "pointer" }}><i className="fa-solid fa-notes-medical me-1"></i>Notes</Link>
                  </li>
              )}

              <li className="nav-link text-white fw-medium">
                {isLoggedIn ? (
                  <Link to="/profile"
                    className="btn btn-dark"
                    style={{ cursor: "pointer" }}>
                    <i className="fa-solid fa-gear"></i>Account
                  </Link>
                ) : (
                  <Link className="btn btn-dark" to="/login">
                    <i className="fa-solid fa-user me-1"></i>
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
