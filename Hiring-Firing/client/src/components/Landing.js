import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EcoIcon from '@material-ui/icons/Eco';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import IconButton from '@material-ui/core/IconButton';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Tooltip from '@material-ui/core/Tooltip';
import logo from '../media/logo2.0.png';
import image1 from '../media/img1.png';
import image2 from '../media/img2.png';
import image3 from '../media/img3.png';
import image4 from '../media/img4.png';
import './Landing.css'

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostLikedJob: '',
            recentJob: ''
        }
    }
    getJob = async () => {
        if (this.props.auth && !this.state.mostLikedJob) {
            const jobs = await axios.get(`${process.env.PUBLIC_URL}/api/jobs_landingpage`);
            this.setState({
                mostLikedJob: jobs.data.mostLikedJob,
                recentJob: jobs.data.recentJob
            })
        }
    }
    //used to take only first 3 words from name
    getPostedbyName = (name) => {
        var r1 = name.split(" ");
        // console.log(r1);
        var res = '';
        if (r1.length > 0) {
            res = r1[0];
        }
        if (r1.length > 1) {
            res = res + ' ' + r1[1];
        }
        if (r1.length > 2) {
            res = res + ' ' + r1[2];
        }
        return res;
    }
    render() {
        this.getJob();
        const ml = this.state.mostLikedJob;
        const rc = this.state.recentJob;
        const hover = `Send feedback`;
        return (
            <div style={{ height: "88.5vh" }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: "30px", marginTop: "50px", color: "#808080", fontWeight: "bold" }} >Welcome to the Hiring Firing!!</div>
                </div>
                <img className="img1" src={image1} alt="img"></img>
                <img className="img2" src={image2} alt="img"></img>
                <img className="img3" src={image3} alt="img"></img>
                <img className="img4" src={image4} alt="img"></img>
                {
                    this.props.auth
                        ?
                        <>
                            {
                                ml && rc
                                    ?
                                    <div className="lower">
                                        <div className="r1">
                                            <Box
                                                boxShadow={1}
                                                bgcolor="background.paper"
                                                m={1}
                                                p={1}
                                                style={{ width: "20rem", height: "15rem", borderRadius: "5px", padding: "10px", backgroundColor: "#ffebe6" }}
                                            >
                                                {/* <div className="mostliked-internal"> */}
                                                <p style={{ color: "rgb(90, 90, 90)", marginTop: "0.1rem", marginLeft: "5rem" }}><b>Most Liked Job</b><span><FavoriteIcon style={{ color: "#ff6666" }} fontSize="small" /></span></p>
                                                <hr />
                                                <p style={{ color: "grey", fontSize: "1.2rem", marginLeft: "6rem" }}><b>{ml.companyName}</b></p>
                                                <p style={{ color: "grey" }}><b>Batch: </b><span>{ml.batch.map(e => (<span key={e} style={{ color: "grey" }}>{e} </span>))}</span></p>
                                                <p style={{ color: "grey" }}><b>Referral: </b>{ml.isReferral}</p>
                                                <p style={{ color: "grey" }}><b>Posted By: </b>{this.getPostedbyName(ml.postedBy)}</p>
                                                <p style={{ color: "grey" }}><b>Job Link: </b><a style={{ color: "grey", cursor: "pointer" }} target="_blank" rel="noreferrer" href={ml.jobLink}>Apply Here!</a></p>
                                                <p style={{ color: "grey" }}><b>Apply Before: </b>{(new Date(ml.jobExpiry)).toLocaleDateString()}</p>
                                                {/* </div> */}
                                            </Box>
                                        </div>
                                        <div className="r2">
                                            <Box
                                                boxShadow={1}
                                                bgcolor="background.paper"
                                                m={1}
                                                p={1}
                                                style={{ width: "20rem", height: "15rem", borderRadius: "5px", padding: "10px", backgroundColor: "#ddffcc" }}
                                            >
                                                <div className="recent-internal">
                                                    <p style={{ color: "rgb(90, 90, 90)", marginTop: "0.1rem", marginLeft: "5rem" }}><b>Most Recent Job</b><span><EcoIcon style={{ color: "#80ff80" }} fontSize="small" /></span></p>
                                                    <hr />
                                                    <p style={{ color: "grey", fontSize: "1.2rem", marginLeft: "6rem" }}><b>{rc.companyName}</b></p>
                                                    <p style={{ color: "grey" }}><b>Batch: </b><span>{rc.batch.map(e => (<span key={e} style={{ color: "grey" }}>{e} </span>))}</span></p>
                                                    <p style={{ color: "grey" }}><b>Referral: </b>{rc.isReferral}</p>
                                                    <p style={{ color: "grey" }}><b>Posted By: </b>{this.getPostedbyName(rc.postedBy)}</p>
                                                    <p style={{ color: "grey" }}><b>Job Link: </b><a style={{ color: "grey", cursor: "pointer" }} target="_blank" rel="noreferrer" href={rc.jobLink}>Apply Here!</a></p>
                                                    <p style={{ color: "grey" }}><b>Apply Before: </b>{(new Date(rc.jobExpiry)).toLocaleDateString()}</p>
                                                </div>
                                            </Box>
                                        </div>
                                        <div className="features">
                                            <Box
                                                boxShadow={1}
                                                bgcolor="background.paper"
                                                m={1}
                                                p={1}
                                                style={{ width: "20rem", height: "13rem", borderRadius: "5px", padding: "10px", backgroundColor: "#ffe6cc" }}
                                            >
                                                <div className="features-internal">
                                                    <p style={{ color: "rgb(90, 90, 90)", marginLeft: "5rem" }}><b>New Features</b><span><WhatshotIcon style={{ color: "#ffa366" }} fontSize="small" /></span></p>
                                                    <hr />
                                                    <div>
                                                        <p style={{ color: "grey" }}><b>Jobstack: </b>1. Personal job collection <br />&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Track active jobs</p>
                                                        <p style={{ color: "grey" }}><b>Reminder: </b>Set mail reminder for jobs</p>
                                                        <p style={{ color: "grey" }}><b>Comment: </b>Ask and Reply for doubts</p>
                                                        <p style={{ color: "grey" }}><b>Responsive</b> for small screen</p>
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </>
                        :
                        this.props.auth === false ?
                            <div className="login-landing">
                                <Box
                                    boxShadow={1}
                                    bgcolor="background.paper"
                                    m={1}
                                    p={1}
                                    style={{ width: "23rem", height: "28rem", borderRadius: "5px", padding: "10px", backgroundColor: "white" }}
                                >
                                    <img style={{ marginLeft: "8rem", height: "8rem" }} src={logo} alt="Hiring-Firing" className="logo-image" />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <p style={{ marginTop: "2.5rem", color: "#33b579", marginLeft: "3.2rem", fontSize: "2.5rem", fontWeight: "900", fontFamily: "Times New Roman" }}>Hiring Firing</p>
                                    <div style={{ marginTop: "5rem", marginLeft: "3.7rem" }}>
                                        <a style={{ cursor: "pointer" }} href={`${process.env.PUBLIC_URL}/auth/google`}><p style={{ width: "13rem" }} className="loginBtn loginBtn--google">Login with Google</p></a>
                                    </div>
                                </Box>

                            </div>
                            :
                            null
                }
                <Tooltip title={hover}>
                    <IconButton type="button" style={{ position: 'absolute', right: '1rem', bottom: '3rem' }} onClick={() => window.open('https://forms.gle/hKkcD9UG15FZ6C7KA')}>
                        <FeedbackIcon style={{ color: '#33B579' }} fontSize="large" />
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
};

function mapStateToProps({ auth }) {
    return { auth };
}
export default connect(mapStateToProps)(Landing);
