import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Notification.css';

function getModalStyle() {
    const top = 50;
    const left = 50;

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
    margin: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      },
    cross: {
        position: 'absolute',
        top: '0',
        right: '0',
    },
}));

export default function JobstackModal(props) {
    var job = props.job;
    const classes = useStyles();
    const hover = `More info`;
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    var date = job.jobExpiry;
    date = date.substring(0, 10);
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div className="container" style={{ color: "black" }}>
                <p><b>Company Name:</b> {job.companyName}</p>
                <p><b>Role:</b> {job.role.join(", ")}</p>
                <p><b>Job Title:</b> {job.jobTitle}</p>
                <p><b>Batch:</b> {job.batch.join(", ")}</p>
                <p><b>Expires On:</b> {date}</p>
                <p><b>Referral Required:</b> {job.isReferral}</p>
            </div>
            <IconButton aria-label="cancel" onClick={handleClose} className={classes.cross}>
                <CancelIcon style={{color: "black"}} fontSize="small" />
            </IconButton>
        </div>
    );

    return (
        <div>
            <Tooltip title={hover}>
                <IconButton aria-label="info" onClick={handleOpen} >
                    <MoreHorizIcon style={{color: '#33b579'}} fontSize="default" />
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
        </div>
    );
}