import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { accessingAllIssues,adminDashboard } from './adminSlice';
import { accessingAllUsers } from './adminSlice';
import { useDispatch, useSelector } from 'react-redux';

const Analytics = () => {
const dispatch = useDispatch();

const {dashboard,users} = useSelector((state)=>state.admin);
const activeUsers = (users)=>{
  let totalactives = 0;
     totalactives = users.map(user=>{
      user.status==="active"? totalactives+=1 : totalactives;
     });

     return totalactives;
}


  useEffect(() => {
    dispatch(adminDashboard());
   }, [])

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-6">
          <h1 className="section-title">Analytics</h1>
          <p className="section-subtitle">Overview of system metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card">
            <p className="text-gray-600">Total Issues</p>
            <h3 className="text-2xl font-bold text-gray-900">{dashboard.totalIssues}</h3>
            <div className="text-sm text-gray-500 mt-2">Resolved: {dashboard.resolved}</div>
            <div className="text-sm text-gray-500">Response Rate: {dashboard.responseRate}%</div>
          </div>

          <div className="dashboard-card">
            <p className="text-gray-600">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{dashboard.totalUsers}</h3>
            <div className="text-sm text-gray-500 mt-2">Active: {dashboard.activeUsers}</div>
          </div>

          <div className="dashboard-card">
            <p className="text-gray-600">Pending Issues</p>
            <h3 className="text-2xl font-bold text-gray-900">{dashboard.pending}</h3>
            <div className="text-sm text-gray-500 mt-2">Use filters for details</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3>Issue Trends</h3>
            </div>
            <div className="card-body text-gray-500">(Chart placeholder — integrate chart components here)</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Resolution Time</h3>
            </div>
            <div className="card-body text-gray-500">(Chart placeholder)</div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/admin/dashboard" className="text-primary-600 hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  )
}

export default Analytics
