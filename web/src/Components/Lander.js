import React, { Component } from 'react';
import '../assets/Lander.css';
import logoText from '../assets/GitTogetherLogoText.png';
import logo from '../assets/GitTogetherLogo.png';
import logoBlack from '../assets/GitTogetherLogoBlack.png';
import landerBackground from '../assets/landerBackground.png';


export default class extends Component {
  render() {
    return  (
      <div>
        <div className="content-wrapper">
          {/* <header className="header-simple">
            <div className="header-content">
              <div className="row">
                <div className="col-6 col-sm-3 col-md-3">
                  <div>
                    <a href="/" className="navbar-brand">
                      <img src={logoText}
                        alt="GitTogether"
                        className="logo"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header> */}
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 px-4 px-md-0 col-text white-text">
                <h1 className="big">You brought the<br/>code, right?</h1>
                <p className="large">
                  <strong>Join now</strong>
                  {" - you won't regret it."}
                </p>
              </div>
              <div className="col-12 col-md-6 pt-md-5 pb-5">
                <div className="form-wrapper">
                  <div className="register">
                    <h2 className="weighted text-center">
                      {"Sign up and let's GitTogether."}
                    </h2>
                  </div>
                    <div className="register-info">
                      <p>
                        Here you can connect and stay up-to-date with other
                        Hackathon participants & event sponsors.
                      </p>
                      <p>
                        See what the world creates, grab ideas for your next
                        project, and meet local recruits for your team.
                      </p>
                  </div>
                  <div className="register-button centered-button">
                    <a href="/login" className="btn btn-secondary btn-lg active"
                      role="button"
                      aria-pressed="true">
                      {"Let's Go"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
