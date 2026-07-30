import { Link, useNavigate } from 'react-router-dom'


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="container text-center">
        <div className="text-primary-600 text-9xl font-bold mb-4">404</div>
        <h1 className="section-title mb-4">Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="space-y-4">
          <Link to="/" className="btn btn-primary btn-large">
            Go to Homepage
          </Link>
          <div className="text-gray-600">
            <button onClick={() => navigate(-1)} className="mr-4 btn-primary">View Issues</button>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound