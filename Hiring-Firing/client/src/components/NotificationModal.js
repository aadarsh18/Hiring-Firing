import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';
import './Notification.css';
import axios from 'axios';
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    cross: {
        position: 'absolute',
        top: '0',
        right: '0',
    },
}));

export default function NotificationModal(props) {

    const classes = useStyles();
    const hover = `Set reminder`;
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [sucessSnackOpen, setsucessSnackOpen] = React.useState(false);///succes fail snackbar added
    const [failureSnackOpen, setfailureSnackOpen] = React.useState(false);//
    var dt, msg = '';

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setsucessSnackOpen(false);
        setfailureSnackOpen(false);
    };
    const handleSubmit = () => {
        var nDate = dt.substring(0, 14) + "00";
        var nd = new Date(nDate);
        var mlTime = nd.getTime();
    //ml time is currnent time in milliseconds from (UTC)
        var note = {
            time: mlTime,
            message: msg,
            companyName: props.job.companyName,
            jobLink: props.job.jobLink,
            role: props.job.role,
            status: props.job.status
        }
        //error handeling added...
        axios.post(`${process.env.PUBLIC_URL}/api/add_reminder`, note).catch((error)=>{
            console.log("error");
            setfailureSnackOpen(true);
            return Promise.reject(error);
        });
        setOpen(false);
        setsucessSnackOpen(true);
    }
    const dateChange = (e) => {
        dt = e.target.value;
    }
    const messageChange = (e) => {
        msg = e.target.value;
    }
    var t = new Date();
    var r = t.getTime();
    r = r + parseInt(6.5 * 60 * 60 * 1000);
    var date = new Date(r).toISOString();
    date = date.substring(0, 16);
    if (date.substring(14, 16) >= "45") {
        var a = date[11];
        var b = date[12];
        if (a === "2" && b === "4") {
            date = date.substring(0, 11) + "00:";
        }
        else {
            if (b < 9) {
                b = +b + +1;


                date = date.substring(0, 11) + a + b + ":";
            }
            else {
                a = +a + +1;
                date = date.substring(0, 11) + a + "0:";
            }
        }
    }
    date = date.substring(0, 14);
    date = date + "00";
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div className="container" style={{ color: "black" }}>
                <h4>Set Reminder</h4>
                <p><b>Company Name:</b> {props.job.companyName}</p>
                <p><b>Role:</b> {props.job.role}</p>
                <p>Reminder Time (minute not considered)</p>
                <form onSubmit={handleSubmit}>
                    <input onChange={dateChange} type="datetime-local" id="reminder-time"
                        name="reminder-time"
                        min={date}
                        required>
                    </input>
                    <input onChange={messageChange} placeholder="Write your message" type="text"></input>
                    <input style={{ color: "#33b579", width: "7rem", height: "2.5rem", fontWeight: "900" }} type='submit' value="Set Reminder" />
                    {/* <button type="submit" value= "Set Reminder">Set Reminder</button> */}
                </form>
            </div>
            <IconButton aria-label="cancel" onClick={handleClose} className={classes.cross}>
                <CancelIcon style={{ color: "black" }} fontSize="small" />
            </IconButton>
        </div>
    );

    return (
        <div>
            <Tooltip title={hover}>
                <IconButton type="button" onClick={handleOpen}>
                    <AlarmAddIcon style={{ color: '#33b579' }} fontSize="default" />
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
            <div>
            <Snackbar open={sucessSnackOpen} autoHideDuration={6000} onClose={handleClose} >
          <Alert onClose={handleClose} severity="success">
            Your reminder is set
          </Alert>
        </Snackbar>
            </div>
            <div>
            <Snackbar open={failureSnackOpen} autoHideDuration={6000} onClose={handleClose} >
          <Alert onClose={handleClose} severity="error">
            Error: Unable to set reminder
          </Alert>
        </Snackbar>
            </div>
        </div>
    );
}