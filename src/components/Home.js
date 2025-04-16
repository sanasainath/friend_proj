import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css"; // Import your CSS file for Home

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = localStorage.getItem("token");
    if (storedProfile) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div>
                    <div className="navbar">
                      <div className="navbar-left">
                      <p>RGUKT RK Valley</p>
                      </div>
                      <div className="navbar-right">
                        <Link to="/signup" className="nav-link">
                          Register
                        </Link>
                        <Link to="/signin" className="nav-link">
                          Sign In
                        </Link>
                      </div>
                    </div>

                    <div className="college-info">
      <div className="college-text">
      <h1>RGUKT RK Valley, Idupulapaya</h1>
        <p>
            Rajiv Gandhi University of Knowledge Technologies - RK Valley (Idupulapaya) is an institute of excellence located in Andhra Pradesh. Known for its innovative education model and focus on rural talent, RGUKT aims to provide high-quality technical education to students from diverse backgrounds.
          </p>
      </div>
    </div>







    </div>
  );
}

export default Home;
