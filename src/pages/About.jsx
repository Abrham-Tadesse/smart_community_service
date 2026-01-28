const About = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="section-title">About Us</h1>
          <p className="section-subtitle">
            Smart Community Request & Prioritization Platform
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="mb-4">Our Mission</h3>
            <p className="mb-6">
              To create a transparent, efficient, and community-driven system for reporting 
              and resolving public service issues. We bridge the gap between citizens and 
              authorities through smart technology and data-driven decision making.
            </p>

            <h3 className="mb-4">The Problem</h3>
            <p className="mb-4">
              In many communities, especially in developing regions, reporting public service 
              issues is often inefficient:
            </p>
            <ul className="mb-6">
              <li>Manual reporting processes</li>
              <li>No prioritization system - critical issues get delayed</li>
              <li>Lack of transparency in resolution process</li>
              <li>No data analytics to identify recurring problems</li>
              <li>Limited community engagement</li>
            </ul>

            <h3 className="mb-4">Our Solution</h3>
            <p className="mb-6">
              SCRPP uses intelligent algorithms to prioritize issues based on multiple factors:
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-2">Smart Prioritization</h4>
                  <p>Automatic calculation of priority scores based on multiple factors</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-2">Real-time Tracking</h4>
                  <p>Track issue status from submission to resolution</p>
                </div>
              </div>
            </div>

            <div className="alert alert-info">
              <h4 className="mb-2">Technical Architecture</h4>
              <p>
                Built with React for the frontend, Node.js/Express for backend, and PostgreSQL for database. 
                Features real-time updates, geolocation services, and responsive design for mobile access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About