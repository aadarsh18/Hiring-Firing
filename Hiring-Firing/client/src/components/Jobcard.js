import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Tooltip } from '@material-ui/core';
import JobcardDelete from './JobcardDeleteModal';
import CommentBox from './CommentBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Box from '@material-ui/core/Box'
import { StylesProvider } from "@material-ui/core/styles";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './Jobcard.css'
import moment from 'moment';
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


class Jobcard extends Component {
    constructor(props) {
        super(props);
        var hc = 0, h = false;
        this.person = this.props.auth.googleId;
        if (this.props.job.likers.length) {
            hc = this.props.job.likers.length;
            h = this.props.job.likers.includes(this.person);
        }
        this.state = {
            showDelete: false,
            showCard: true,
            redirect: false,
            heart: h,
            heartCount: hc,
            isLikeProcessing: false,
            noAddJobstackButton: this.props.notButton, // This can create problem if constructor is not called again everytime the cards jobId changes
            // If using props to assign state it should be preferably done in the renderer only
            showComments: true,
            startCommentPage: this.props.job.commentCount > 1 ? this.props.job.previewComment._id : null,
            processingComments: false,
            comments: [],
            commentCount: this.props.job.commentCount,
            failureSnackOpen: false
        };
    }
    componentDidMount() {
        let loadPreviewComment = [];
        if (this.props.job.previewComment && !this.props.job.previewComment.isDeleted) {
            loadPreviewComment.push(this.props.job.previewComment);
        }
        this.setState({
            comments: loadPreviewComment
        });
    }
    deleteJobHandler = async () => {
        try{
            await this.setState({
                showCard: false
            });
            var del_link = `${process.env.PUBLIC_URL}/api/delete_job/` + this.props.job.jobId;
            await axios.delete(del_link);
        }
        //handelling error
        catch(error){
            await this.setState({
                showCard: true
            });
            await this.setState({
                failureSnackOpen: true
            });
            console.log(this.state.failureSnackOpen, "fail on error");
        }
    }

    editHandler = async (event) => {
        event.preventDefault();
        this.props.setLocal();
        this.setState({ redirect: true })
    }

    //Like button Handlers
    heartClick = async () => {


        if (!this.state.isLikeProcessing) {
            await this.setState({
                isLikeProcessing: true
            })
            var body = { jobId: this.props.job.jobId };
            if (this.state.heart) {
                this.setState({
                    heart: !this.state.heart,
                    heartCount: this.state.heartCount - 1
                })
                await axios.post(`${process.env.PUBLIC_URL}/api/remove_liker`, body);
                await this.setState({
                    isLikeProcessing: false
                });
            }
            else {
                this.setState({
                    heart: !this.state.heart,
                    heartCount: this.state.heartCount + 1
                })
                await axios.post(`${process.env.PUBLIC_URL}/api/add_liker`, body);
                await this.setState({
                    isLikeProcessing: false
                });
            }
        }
    }
    getHeart = () => {
        if (this.state.heart)
            return <FavoriteIcon fontSize="large" onClick={this.heartClick} style={{ cursor: "pointer", color: "rgb(253, 91, 91)" }} />
        return <FavoriteBorderIcon fontSize="large" onClick={this.heartClick} style={{ cursor: "pointer" }} />
    }

    getJobstackbutton = () => {
        if (!this.state.noAddJobstackButton)
            return <Tooltip title="Add to Jobstack"><AssignmentIcon onClick={this.addJobstackHandler} style={{ fontSize: "2rem", cursor: "pointer", color: "#33b579", marginRight: "1rem" }} /></Tooltip>;
        return <Tooltip title="Added to Jobstack"><AssignmentTurnedInIcon style={{ fontSize: "2rem", color: "#33b579", marginRight: "1rem" }} /></Tooltip>;
    }

    //Jobstack Handlers
    addJobstackHandler = async () => {
        if (!this.state.noAddJobstackButton) {
            this.setState({
                noAddJobstackButton: true
            })
            var add = `${process.env.PUBLIC_URL}/api/addto_jobstack/` + this.props.job.jobId;
            await axios.post(add);
        }
    }
    internFulltime = () => {
        var infl = null;
        var role = this.props.job.role;
        if (role.length === 2) {
            infl = "Intern | Full time";
        }
        else if (role.includes("Intern")) {
            infl = "Intern";
        }
        else
            infl = "Full time";
        return infl;
    }

    //Logic for handling the comments section
    fetchComments = async () => {
        const getCommentsURL = `${process.env.PUBLIC_URL}/api/get_comments/` + this.props.job.jobId;
        const comments = await axios({
            method: 'get',
            url: getCommentsURL,
            params: { startCommentPage: this.state.startCommentPage }
        });
        let loadedNewComments = this.state.comments;
        //obtain new offset
        let offSet = comments.data.pop();
        //add each new data
        comments.data.forEach(comment => {
            loadedNewComments.push(comment);
        });
        this.setState({
            startCommentPage: offSet,
            comments: loadedNewComments
        });
    }
    showCommentsHandler = async (event) => {
        event.preventDefault();
        if (!this.state.processingComments) {
            this.setState({
                processingComments: true
            }, async () => {
                if (!this.state.showComments) {
                    await this.fetchComments();
                    this.setState({
                        showComments: true
                    }, () => {
                        this.setState({
                            processingComments: false
                        });
                    });
                }
                else {
                    this.setState({
                        showComments: false,
                        startCommentPage: 0,
                        comments: []
                    }, () => {
                        this.setState({
                            processingComments: false
                        })
                    })
                }
            });

        }
    }

    //used to take only first 3 words from name
    getPostedbyName = (name) => {
        var r1 = name.split(" ");
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
    //Handle Displayed CommentCount
    commentCountHandler = (diff) => {
        let commentCount = this.state.commentCount;
        this.setState({
            commentCount: commentCount + diff
        });
    }
//closing failuresnack..
    handleClose= async()=>{
        await this.setState({
            failureSnackOpen: false
        });
    }
    render() {
        const job = this.props.job;//this was previously accessed through state and constructor was not getting called again when the component's key attribute was not specified
        const auth = this.props.auth;
        var datePosted = moment(job.postedOn).format("DD-MM-YYYY HH:mm");

        //delete andCompanies (atmost 5) edit job link logic
        var del = null, edit = null;
        if (auth._id && (auth._id === job.postedById)) {
            del = <JobcardDelete deleteJobHandler={this.deleteJobHandler} />;
            edit = <Tooltip title="Edit"><i onClick={this.editHandler} className="fa fa-pencil-square-o" style={{ fontSize: "2.0rem", cursor: "pointer", color: "#33b579", marginRight: "1rem" }}></i></Tooltip>;
        }
        //Comment Section Logic
        var commentText = null;
        if (this.state.showComments) {
            const COMMENTS = this.state.comments;
            commentText = (
                <CommentBox comments={COMMENTS}
                    jobId={this.props.job.jobId}
                    fetchComments={this.fetchComments}
                    offSet={this.state.startCommentPage}
                    commentCountHandler={this.commentCountHandler}
                />
            );
        }
        const url = job.jobLink;
        const date = new Date(job.jobExpiry);
        const default_date = new Date('1970,01,01');
        default_date.setHours(0, 0, 0, 0)
        const jobExpiry_date = new Date(job.jobExpiry);
        jobExpiry_date.setHours(0, 0, 0, 0);
        if (this.state.redirect) {
            return <Redirect push
                to={{
                    pathname: "/editjob",
                    state: { editJob: job }
                }} />;
        }
        if (this.state.showCard) {
            return (
                <div>
                    <StylesProvider injectFirst>
                        <Box
                            boxShadow={1}
                            bgcolor="background.paper"
                            m={1}
                            p={1}
                        >
                            <div className="jobcard">
                                <div style={{ marginTop: "0.5rem", paddingLeft: "1rem", paddingRight: "1rem" }} >
                                    <div style={{ lineHeight: "100%" }}>
                                        <div style={{ lineHeight: "160%" }} className="jobcard-up">
                                            <p style={{ fontFamily: "Times New Roman", fontSize: "2rem", color: "rgb(90, 90, 90)" }} className="jobcard-up-line"><b>{job.companyName}</b></p>
                                        </div>
                                        <div style={{ float: "right", display: "flex" }} className="jobcard-up">
                                            <div className="jobcard-up-line">{edit}</div>
                                            <div className="jobcard-up-line">{del}</div>
                                            <div className="jobcard-up-line">{this.getJobstackbutton()}</div>
                                        </div>
                                        <p style={{ fontSize: "0.8rem", color: "grey" }}>{datePosted}</p>
                                    </div>
                                    <hr style={{ borderTop: "1px solid #33b579", marginTop: "0.3rem", marginBottom: "0.6rem" }} />
                                    <div className="card-content" style={{ paddingLeft: "0.5rem" }}>
                                        <p style={{ display: "inline", color: "black" }}><span style={{ color: "grey" }}><b>Role:</b></span> {this.internFulltime()}</p>
                                        <p style={{ display: "inline", color: "black" }}><span style={{ color: "grey" }}><b>&nbsp;&nbsp;&nbsp;&nbsp;Title:</b></span> {job.jobTitle}</p>
                                        <div style={{ marginTop: "0.5rem" }} className="batch">
                                            <p style={{ display: "inline", color: "black" }}><span style={{ color: "grey" }}><b>Batch Applicable:</b>&nbsp;</span></p>
                                            {job.batch.map(each_batch => (
                                                <p style={{ display: "inline", color: "black" }} key={each_batch}>{each_batch}&nbsp;</p>
                                            ))}
                                        </div>
                                        <p style={{ marginTop: "0.5rem", color: "black" }}><span style={{ color: "grey" }}><b>Apply Before:</b>&nbsp;</span> {date.toLocaleDateString()}</p>
                                        <p style={{ marginTop: "0.5rem", color: "black" }}><span style={{ color: "grey" }}><b>Referral Applicable:</b>&nbsp;</span> {job.isReferral}</p>
                                        <p style={{ marginTop: "0.5rem", color: "black" }}><span style={{ color: "grey" }}><b>Expected Salary:</b>&nbsp;</span> {job.salary ? job.salary : "NA"}</p>
                                        <p style={{ marginTop: "0.5rem", color: "black" }}><span style={{ color: "grey" }}><b>Posted By:</b>&nbsp;</span> {this.getPostedbyName(job.postedBy)}</p>
                                    </div>
                                    <hr style={{ borderTop: "1px solid #33b579", marginTop: "0.6rem", marginBottom: "0.3rem" }} />
                                    <div className="cardlower">
                                        <div style={{ marginLeft: "1rem", display: "flex" }}>
                                            {this.getHeart()}
                                            <p style={{ color: "black" }}>&nbsp;&nbsp;{this.state.heartCount}&nbsp;&nbsp;</p>
                                            <b><a id="lowcard" className="apply_button" target="_blank" rel="noreferrer" href={url} > Apply Here!</a></b>
                                            <p style={{ cursor: "default", justifyContent: "flex-end" }} id="lowcard" onClick={this.showCommentsHandler}><b>Comments ({this.state.commentCount})</b></p>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: "1rem" }}>
                                        {commentText}
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </StylesProvider>
                    <div>
            <Snackbar open={this.state.failureSnackOpen} autoHideDuration={6000} onClose={this.handleClose} >
          <Alert onClose={this.handleClose} severity="error">
            Error: Unable to delete Job Card
          </Alert>
        </Snackbar>
            </div>
                </div>

            )
        }
        else {
            return null;
        }
    }
};
function mapStateToProps({ auth }) {
    return { auth };
}
export default connect(mapStateToProps)(Jobcard);