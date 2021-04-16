
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import AddJobForm from './AddJobForm';
import Jobboard from './Jobboard';
import EditJobForm from './EditJobForm';
import Jobstack from './Jobstack';
import './App.css';

class App extends Component {
    //Lifecycle hook
    //we are wiring up action creator with app as many components may need it.
    componentDidMount() {

        //Acessing the action creator through props
        this.props.fetchUser();
    }
    render() {
        return (
            <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
                <div className="app">
                    <div className="main-header">
                        <Header />
                    </div>
                    <div className="lower-content-all-page">
                        <Route exact path="/jobboard" component={Jobboard} />
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/addnewjob" component={AddJobForm} />
                        <Route exact path="/editjob" render={(props) => <EditJobForm {...props} />} />
                        <Route exact path="/myjobstack" component={Jobstack} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
};
// first argument is about map state's of props function and the second argument is to wire up all the action creators with the app
// The actions are assigned to the app component as the props
export default connect(null, actions)(App);