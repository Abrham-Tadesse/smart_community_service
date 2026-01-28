import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="text-center">
            <h1 className="hero-title">Smart Community Service Platform</h1>
            <p className="hero-subtitle">
              Report, prioritize, and resolve community issues efficiently
            </p>
            <div className="hero-buttons">
              <Link to="/issues/create" className="btn btn-primary btn-large">
                Report an Issue
              </Link>
              <Link to="/about" className="btn btn-outline btn-large">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Our Platform Works</h2>
            <p className="section-subtitle">
              A smart system designed to address community needs efficiently
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Smart Reporting</h3>
              <p className="feature-description">
                Report issues with photos, location, and severity level
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Automatic Prioritization</h3>
              <p className="feature-description">
                Issues are prioritized based on severity and impact
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community Focus</h3>
              <p className="feature-description">
                Collective problem-solving for better neighborhoods
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Data Analytics</h3>
              <p className="feature-description">
                Track resolution times and identify problem areas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-content">
            <div>
              <h2 className="stats-title">Ready to improve your community?</h2>
              <p className="mb-6">
                Join thousands of citizens who are making their neighborhoods better places to live.
              </p>
              <div className="stats-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/about" className="btn btn-outline btn-large">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home