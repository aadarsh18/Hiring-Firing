import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './AddJobForm.css'


class AddJobForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            jobTitle: '',
            jobLink: '',
            batch: [],
            isReferral: '',
            jobExpiry: '',
            role: [],
            redirect: false,
            failureSnack: false,
            salary: '',
        };

        //In JavaScript, class methods are not bound by default. 
        //If you forget to bind this.myChangeHandler and pass it to onChange, this will be undefined when the function is actually called.
        //But it works as the syntax we are using namely "Public Class Field Syntax" allows class fields to correctly bind callbacks.

    }
    // This syntax ensures `this` is bound within myChangeHandler and submitHandler.
    // We are using the experimental public class fields syntax, We can use class fields to correctly bind callbacks
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    batchChangeHandler = (event) => {
        let val = event.target.value;
        var new_batch = this.state.batch;
        const index = this.state.batch.indexOf(val);
        if (index > -1) {
            new_batch.splice(index, 1);
            this.setState({ batch: new_batch });
        }
        else {
            new_batch.push(val);
            this.setState({ batch: new_batch });
        }
    }
    roleChangeHandler = (event) => {
        let val = event.target.value;
        var new_role = this.state.role;
        const index = this.state.role.indexOf(val);
        if (index > -1) {
            new_role.splice(index, 1);
            this.setState({ role: new_role });
        }
        else {
            new_role.push(val);
            this.setState({ role: new_role });
        }
    }
    submitHandler = async (event) => {
        event.preventDefault();
        const job = {
            companyName: this.state.companyName,
            jobTitle: this.state.jobTitle,
            jobLink: this.state.jobLink,
            batch: this.state.batch,
            isReferral: this.state.isReferral,
            jobExpiry: this.state.jobExpiry,
            role: this.state.role,
            salary: this.state.salary

        }
        try {
            await axios.post(`${process.env.PUBLIC_URL}/api/add_job`, job);
            this.setState({ redirect: true });
        }
        catch (error) {
            this.setState({
                failureSnack: true
            });
        }
    }
    handleCloseFailureSnack = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            failureSnack: false
        });
    };
    render() {
        //button logic
        var x = this.state.companyName && this.state.jobLink && this.state.batch.length && this.state.role.length && this.state.isReferral;
        let sumbitButton = x ? <input style={{ color: "#33b579", width: "6rem", height: "3rem", fontWeight: "900" }}
            type='submit' /> : <p style={{ color: "red" }}>fill the mandatory * fields first</p>;


        const { redirect } = this.state;
        if (redirect) {
            return <Redirect push to="/jobboard" />;
        }


        return (
            <div className="addform">
                <div className="container">
                    <div className="addfo">
                        <div style={{ color: "grey", marginTop: '2rem' }}>
                            <span style={{ color: "grey", fontSize: "2rem", fontWeight: "500" }}>Add a Job</span>
                        </div>
                        <div style={{ overflow: "scroll" }} className="form">
                            <form onSubmit={this.submitHandler}>
                                <p style={{ color: "black" }}><b>Company Name* :</b></p>
                                <input
                                    type='text'
                                    name='companyName'
                                    onChange={this.myChangeHandler}
                                />
                                <p style={{ color: "black" }}><b>Role* :</b></p>
                                <p>
                                    <label>
                                        <input type="checkbox" name='role'
                                            onChange={this.roleChangeHandler} value="Intern"
                                        />
                                        <span>Intern</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input type="checkbox" name='role'
                                            onChange={this.roleChangeHandler} value="Full time"
                                        />
                                        <span>Full time</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                        </p>
                                <p style={{ marginTop: "1rem", color: "black" }}><b>Job Title:</b> (e.g. Frontend dev, SDE-1, Tester)</p>
                                <input
                                    type='text'
                                    name='jobTitle'
                                    onChange={this.myChangeHandler}
                                />
                                <p style={{ color: "black" }}><b>Job Link* :</b></p>
                                <input
                                    type='text'
                                    name='jobLink'
                                    onChange={this.myChangeHandler}
                                />
                                <p style={{ color: "black" }}><b>Batch* :</b></p>
                                <p>
                                    <label>
                                        <input type="checkbox" name='batch'
                                            onChange={this.batchChangeHandler} value="2020"
                                        />
                                        <span>2020</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input type="checkbox" name='batch'
                                            onChange={this.batchChangeHandler} value="2021"
                                        />
                                        <span>2021</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input type="checkbox" name='batch'
                                            onChange={this.batchChangeHandler} value="2022"
                                        />
                                        <span>2022</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input type="checkbox" name='batch'
                                            onChange={this.batchChangeHandler} value="2023"
                                        />
                                        <span>2023</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input type="checkbox" name='batch'
                                            onChange={this.batchChangeHandler} value="2024"
                                        />
                                        <span>2024</span>
                                    </label>
                                </p>

                                <p style={{ marginTop: "1rem", color: "black" }}><b>Referral Applicable* :</b></p>
                                <p>
                                    <label>
                                        <input className="with-gap" type="radio"
                                            name='isReferral' value="Yes"
                                            onChange={this.myChangeHandler}
                                        />
                                        <span>Yes</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input className="with-gap" type="radio"
                                            name='isReferral' value="No"
                                            onChange={this.myChangeHandler}
                                        />
                                        <span>No</span>
                                    </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                        <input className="with-gap" type="radio"
                                            name='isReferral' value="Maybe"
                                            onChange={this.myChangeHandler}
                                        />
                                        <span>Maybe</span>
                                    </label>
                                </p>
                                <p style={{ marginTop: "1rem", color: "black" }}><b>Expected Salary :</b></p>
                                <input
                                    type='text'
                                    name='salary'
                                    onChange={this.myChangeHandler}
                                />
                                <p style={{ marginTop: "1rem", color: "black" }}><b>Job Expiry Date (if known):</b></p>
                                <input
                                    type='date'
                                    name='jobExpiry'
                                    onChange={this.myChangeHandler}
                                />
                                <div>
                                    {sumbitButton}
                                </div>
                                <Snackbar open={this.state.failureSnack} autoHideDuration={6000} onClose={this.handleCloseFailureSnack} >
                                    <Alert onClose={this.handleCloseFailureSnack} severity="error" elevation={6} variant="filled">
                                        Failed to add your job.
                                    </Alert>
                                </Snackbar>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddJobForm;