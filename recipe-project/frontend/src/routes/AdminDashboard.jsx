import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import useCurrentUser from '../components/CurrentUser.jsx'

import { IoIosTimer } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import '../styles/AdminDashboard.css'

function AdminDashboard() {
    const [pending, setPending] = useState([])
    const [published, setPublished] = useState([])
    const [rejected, setRejected] = useState([])

    const { user, profile } = useCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5050/create/user/${user.uid}`);
                const data = response.data;
                if (!data.isAdmin) {
                    navigate(`/my-recipes`)
                }
            } catch (e) {
                console.error("Failed to fetch pending: ", e)
            }
        }
        if (user && !user.isGuest) {
            checkUser();
            fetchPending();
            fetchPublished();
            fetchRejected();
        } else {
            navigate('/my-recipes')
        }
    }, [user, navigate])

    const handlePublish = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5050/admin/publish/${id}`);
            if (response.status === 200) {
                fetchPending();
                fetchPublished();
                fetchRejected();
            }
        } catch (e) {
            console.error("Failed to publish recipe: ", e)
        }
    }

    const handleReject = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5050/admin/reject/${id}`);
            if (response.status === 200) {
                fetchPending();
                fetchPublished();
                fetchRejected();
            }
        } catch (e) {
            console.error("Failed to reject recipe: ", e)
        }
    }

    const fetchPending = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/admin/get/pending`);
            const data = response.data;
            
            setPending(data);
        } catch (e) {
            console.error("Failed to fetch pending: ", e)
        }
    }

    const fetchPublished = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/admin/get/published`);
            const data = response.data;
            
            setPublished(data);
        } catch (e) {
            console.error("Failed to fetch pending: ", e)
        }
    }

    const fetchRejected = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/admin/get/rejected`);
            const data = response.data;
            
            setRejected(data);
        } catch (e) {
            console.error("Failed to fetch pending: ", e)
        }
    }

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
                        {pending ? (
                            <div className="adminStatChildStat">{pending.length}</div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="adminStatChild">
                        <div className="adminStatChildText">Published</div>
                        {pending ? (
                            <div className="adminStatChildStat">{published.length}</div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="adminStatChild">
                        <div className="adminStatChildText">Rejected</div>
                        {pending ? (
                            <div className="adminStatChildStat">{rejected.length}</div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className="adminSubHeader">
                    <div className="adminSubHeaderText">Pending Review</div>
                </div>
                <div className="adminRecipeContainer">
                    {pending && pending.length > 0 ? (
                        pending.map((p, index) => (
                            <div key={index} className="adminRecipeChild">
                                <div className="adminRecipeChildTitle">{p.title}</div>
                                <div className="adminRecipeChildUsername">By {p.username}</div>
                                <div className="adminRecipeChildDescription">{p.description}</div>
                                <div className="adminRecipeNumbersContainer">
                                    <div className="adminRecipeNumbersChild">
                                        <IoIosTimer className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{parseInt(p.prep_time) + parseInt(p.cook_time)} mins</div>
                                    </div>
                                    <div className="adminRecipeNumbersChild">
                                        <IoPersonSharp className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{p.servings} servings</div>
                                    </div>
                                </div>
                                <div className="adminRecipeChildButtons">
                                    <Link to={`/recipeDetail/${p.id}`}>
                                        <button className="adminRecipeChildView" type="button">View Details</button>
                                    </Link>
                                    <button className="adminRecipeChildPublish" type="button" onClick={() => handlePublish(p.id)}>Publish</button>
                                    <button className="adminRecipeChildReject" type="button" onClick={() => handleReject(p.id)}>Reject</button>
                                </div>
                            </div>
                        ))
                        
                    ) : (
                        <></>
                    )}
                </div>
                <div className="adminSubHeader">
                    <div className="adminSubHeaderText">Published</div>
                </div>
                <div className="adminRecipeContainer">
                    {published && published.length > 0 ? (
                        published.map((p, index) => (
                            <div key={index} className="adminRecipeChild">
                                <div className="adminRecipeChildTitle">{p.title}</div>
                                <div className="adminRecipeChildUsername">By {p.username}</div>
                                <div className="adminRecipeChildDescription">{p.description}</div>
                                <div className="adminRecipeNumbersContainer">
                                    <div className="adminRecipeNumbersChild">
                                        <IoIosTimer className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{parseInt(p.prep_time) + parseInt(p.cook_time)} mins</div>
                                    </div>
                                    <div className="adminRecipeNumbersChild">
                                        <IoPersonSharp className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{p.servings} servings</div>
                                    </div>
                                </div>
                                <div className="adminRecipeChildButtons">
                                    <Link to={`/recipeDetail/${p.id}`}>
                                        <button className="adminRecipeChildView" type="button">View Details</button>
                                    </Link>
                                    <button className="adminRecipeChildReject" type="button" onClick={() => handleReject(p.id)}>Reject</button>
                                </div>
                            </div>
                        ))
                        
                    ) : (
                        <></>
                    )}
                </div>
                <div className="adminSubHeader">
                    <div className="adminSubHeaderText">Rejected</div>
                </div>
                <div className="adminRecipeContainer">
                    {rejected && rejected.length > 0 ? (
                        rejected.map((p, index) => (
                            <div key={index} className="adminRecipeChild">
                                <div className="adminRecipeChildTitle">{p.title}</div>
                                <div className="adminRecipeChildUsername">By {p.username}</div>
                                <div className="adminRecipeChildDescription">{p.description}</div>
                                <div className="adminRecipeNumbersContainer">
                                    <div className="adminRecipeNumbersChild">
                                        <IoIosTimer className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{parseInt(p.prep_time) + parseInt(p.cook_time)} mins</div>
                                    </div>
                                    <div className="adminRecipeNumbersChild">
                                        <IoPersonSharp className="adminRecipeNumbersIcon" size={22}/>
                                        <div className="adminRecipeNumbersText">{p.servings} servings</div>
                                    </div>
                                </div>
                                <div className="adminRecipeChildButtons">
                                    <Link to={`/recipeDetail/${p.id}`}>
                                        <button className="adminRecipeChildView" type="button">View Details</button>
                                    </Link>
                                    <button className="adminRecipeChildPublish" type="button" onClick={() => handlePublish(p.id)}>Publish</button>
                                </div>
                            </div>
                        ))
                        
                    ) : (
                        <></>
                    )}
                </div>
                <div className="adminSpacing"></div>
            </div>
        </div>
    )
}

export default AdminDashboard;