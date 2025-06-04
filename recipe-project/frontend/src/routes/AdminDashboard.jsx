import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';


import '../styles/AdminDashboard.css'

function AdminDashboard() {
    return (
        <div className="adminFlex">
            <Navbar />
            <div className="adminMain">
                <div className="adminHeader">
                    <div className="adminHeaderText">Admin Dashboard</div>
                    <div className="adminHeaderSubText">Review and manage user-submitted recipes</div>
                </div>
                <div className="adminStatContainer">
                    <div className="adminStatChild">
                        <div className="adminStatChildText">Pending Review</div>
                        <div className="adminStatChildStat">2</div>
                    </div>
                    <div className="adminStatChild">
                        <div className="adminStatChildText">Published</div>
                        <div className="adminStatChildStat">2</div>
                    </div>
                    <div className="adminStatChild">
                        <div className="adminStatChildText">Rejected</div>
                        <div className="adminStatChildStat">2</div>
                    </div>
                </div>
                <div className="adminSubHeader">
                    <div className="adminSubHeaderText">Pending Review</div>
                </div>
                <div className="adminRecipeContainer">
                    <div className="adminRecipeChild"></div>
                </div>
                <div className="adminSubHeader">
                    <div className="adminSubHeaderText">Published Review</div>
                </div>
                <div className="adminRecipeContainer">
                    <div className="adminRecipeChild"></div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;