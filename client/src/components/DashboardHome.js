import React from 'react';
import '../styles/Dashboard.css';
import depressionImg from '../assets/depression.jpg';
import angerImg from '../assets/anger.jpg';
import personalityImg from '../assets/personality.jpg';
import traumaImg from '../assets/trauma.jpg';
import gadImg from '../assets/gad7.jpg';        // New image
import phqImg from '../assets/phq9.jpg';        // New image

const DashboardHome = ({ userName }) => {
  return (
    <div className="dashboard-home-container">
      <div className="dashboard-welcome-container">
        <div className="dashboard-welcome-box">
          <h1 className="dashboard-welcome-heading">
            Welcome, {userName ? userName.toUpperCase() : "employee"}
          </h1>
          <p className="dashboard-welcome-subtext">
            Your mental wellness journey starts here 🌿
          </p>
        </div>
      </div>

      <div className="svg-header">
        <svg viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path
            d="M0,0 C300,150 900,0 1200,120 L1200,0 L0,0 Z"
            fill="#e6f2ff"
          />
        </svg>
        <h1 className="svg-title">Psychological Issues That We Deal With</h1>
      </div>

      <div className="issue-card image-left">
        <div className="image-container">
          <img src={depressionImg} alt="Depression" />
          <div className="badge">DEPRESSION FREE LIFE!</div>
        </div>
        <div className="text-container">
          <h3>Depression</h3>
          <p>
            Feeling emotionally low, unmotivated, or losing interest in daily activities?
            Our platform provides tools to uplift and empower you through expert guidance and self-help support.
          </p>
          <a
            href="https://www.who.int/news-room/fact-sheets/detail/depression"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="issue-card image-right">
        <div className="image-container">
          <img src={personalityImg} alt="Personality Disorder" />
          <div className="badge">IMPROVED PERSONALITY</div>
        </div>
        <div className="text-container">
          <h3>Personality Disorder</h3>
          <p>
            Struggling with behavior patterns that affect your relationships or self-perception?
            We provide emotional insight and support resources to build stability.
          </p>
          <a
            href="https://www.verywellmind.com/personality-disorders-4157284"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="issue-card image-left">
        <div className="image-container">
          <img src={angerImg} alt="Anger Management" />
          <div className="badge">STRESS FREE LIFE!</div>
        </div>
        <div className="text-container">
          <h3>Anger Management</h3>
          <p>
            Learn how to handle frustration constructively, improve communication, and develop inner peace.
            Gain emotional tools for a calmer, healthier life.
          </p>
          <a
            href="https://www.apa.org/topics/anger/control"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="issue-card image-right">
        <div className="image-container">
          <img src={traumaImg} alt="Lost & Trauma" />
          <div className="badge">HEALING TRAUMA</div>
        </div>
        <div className="text-container">
          <h3>Lost & Trauma</h3>
          <p>
            Whether due to grief, abuse, or difficult life changes, we’re here to guide your healing journey.
            Find safe space and practical strategies to regain strength.
          </p>
          <a
            href="https://www.mhanational.org/trauma"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* GAD-7 Awareness Card */}
      <div className="issue-card image-left">
        <div className="image-container">
          <img src={gadImg} alt="GAD-7" />
          <div className="badge">ANXIETY AWARENESS</div>
        </div>
        <div className="text-container">
          <h3>GAD-7 Assessment</h3>
          <p>
            The GAD-7 tool helps identify signs of generalized anxiety disorder through 7 simple questions.
            Understand your anxiety levels and explore self-care strategies.
          </p>
          <a
            href="https://adaa.org/understanding-anxiety/generalized-anxiety-disorder-gad"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* PHQ-9 Awareness Card */}
      <div className="issue-card image-right">
        <div className="image-container">
          <img src={phqImg} alt="PHQ-9" />
          <div className="badge">DEPRESSION SCREENING</div>
        </div>
        <div className="text-container">
          <h3>PHQ-9 Assessment</h3>
          <p>
            The PHQ-9 is a clinical tool that helps screen and measure the severity of depression symptoms.
            Take charge of your emotional health with this self-assessment.
          </p>
          <a
            href="https://www.apa.org/depression-guideline/patient-health-questionnaire.pdf"
            className="learn-more"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
