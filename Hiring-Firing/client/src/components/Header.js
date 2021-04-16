import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../media/logo2.0.png';
import MenuIcon from '@material-ui/icons/Menu';

import './Header.css'


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navClass: "nav-links",
            currPage: ""
        }
    }
    burgerClick = () => {
        var cls = "";
        if (this.state.navClass === "nav-links") {
            cls = "nav-links nav-active";
        }
        else {
            cls = "nav-links";
        }
        this.setState({
            navClass: cls
        })
    }
    getNavElement = () => {
        // var border =
        const auth = this.props.auth;
        var b1 = "none", b2 = "none", b3 = "none";
        if (this.state.currPage === 'jobboard') {
            b1 = "3px solid white";
        }
        else if (this.state.currPage === "addnewjob") {
            b2 = "3px solid white";
        }
        else if (this.state.currPage === "myjobstack") {
            b3 = "3px solid white";
        }
        if (auth === null)
            return;
        if (auth === false)
            return (
                <li><a href={`${process.env.PUBLIC_URL}/auth/google`}>Login With Google</a></li>
            )
        return (
            <>
                {/* <li ><a href={`${process.env.PUBLIC_URL}/jobboard`}>{this.state.currPage === "jobboard" ? <span style={{ borderBottom: "3px solid white", color: "white" }}>Job Board</span> : "Job Board"}</a></li> */}
                {/* <div style={{height:"1rem"}}></div> */}
                <div className="links">
                    <li style={{ borderBottom: b1, display: "block", height: "2.5rem" }}><a href={`${process.env.PUBLIC_URL}/jobboard`}><span style={{ color: "white" }}>Jobboard</span></a></li>
                    <li style={{ borderBottom: b2, display: "block", height: "2.5rem" }}><a href={`${process.env.PUBLIC_URL}/addnewjob`}><span style={{ color: "white" }}>Add Job</span></a></li>
                    <li style={{ borderBottom: b3, display: "block", height: "2.5rem" }}><a href={`${process.env.PUBLIC_URL}/myjobstack`}><span style={{ color: "white" }}>My Jobstack</span></a></li>
                    <li ><a href={`${process.env.PUBLIC_URL}/api/logout`}>Logout</a></li>
                </div>
            </>
        )

    }
    componentDidMount() {
        var pg = window.location.href;
        var index = pg.lastIndexOf('/');
        var page = pg.substring(index + 1);
        if (this.state.currPage !== page) {
            this.setState({
                currPage: page
            })
        };
    }
    render() {
        return (
            <div className="head">
                <div style={{ display: "inline" }} >
                    <Link
                        to='/'
                    >
                        <img src={logo} alt="Hiring-Firing" className="logo-image" />
                    </Link>
                </div>

                <div className="burger">
                    <MenuIcon style={{ color: "white", marginRight: "2rem", fontSize: "2.0rem" }} onClick={this.burgerClick} />
                </div>
                <div className="nav-words">
                    <ul style={{ display: "inline" }} className={this.state.navClass}>
                        {this.getNavElement()}
                    </ul>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);