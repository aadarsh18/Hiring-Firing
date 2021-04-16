import React, { Component } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import { StylesProvider } from "@material-ui/core/styles";
import { Multiselect } from 'multiselect-react-dropdown';

import NotificationModal from './NotificationModal';
import JobstackModal from './JobstackModal';
import Giphy from './Giphy';
import './Jobstack.css';
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);

  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class Jobstack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_jobs: [],
      jobs: [],
      page: 0,
      rowsPerPage: 6,
      snackOpen: false,
      deleteOpen: false,
      failSnack: false,
      current_row: 0,
      sortBy: "addTime",
      comparator: -1,
      filterOpen: false,
      role: '',
      status: [],
      company_list: [],
      selectedCompanies: [],
      giphy: false,
      stat: 'Not Applied',
    }
  }
  handleChangeStatus = async (row, event) => {
    const i = this.state.jobs.indexOf(row);
    const val = event.target.value;
    var ch = this.state.jobs;
    ch[i].status = val;
    this.setState({ jobs: ch });
    if (val !== "Not Applied")
      await this.setState({ giphy: true, stat: val });
  };
  handleChangeFollowUp = (row, event) => {
    const i = this.state.jobs.indexOf(row);
    const val = event.target.value;
    var ch = this.state.jobs;
    ch[i].followUp = val;
    this.setState({ jobs: ch });
  };
  handleChange = (row, event) => {
    const i = this.state.jobs.indexOf(row);
    const val = event.target.value;
    const nam = event.target.name;
    var ch = this.state.jobs;
    ch[i][nam] = val;
    this.setState({ jobs: ch });
  };
  handleClickOpen = (row, event) => {
    const i = this.state.jobs.indexOf(row);
    this.setState({ deleteOpen: true, current_row: i });
  };
  handleDeleteClose = () => {
    this.setState({ deleteOpen: false, current_row: 0 });
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackOpen: false });
  };
  handleFailSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ failSnack: false });
  };
  handleClickFilterOpen = () => {
    this.setState({ filterOpen: true });
  }
  handleFilterClose = () => {
    this.setState({ filterOpen: false });
  }
  handleGiphyClose = () => {
    this.setState({ giphy: false });
  }
  roleChangeHandler = (event) => {
    let val = event.target.value;
    this.setState({ role: val });
  }
  statusChangeHandler = (event) => {
    let val = event.target.name;
    var new_status = this.state.status;
    const index = this.state.status.indexOf(val);
    if (index > -1) {
      new_status.splice(index, 1);
    }
    else {
      new_status.push(val);
    }
    this.setState({ status: new_status });
  }
  submitHandler = async (row, event) => {
    event.preventDefault();
    const i = this.state.jobs.indexOf(row);
    const job = {
      status: this.state.jobs[i].status,
      followUp: this.state.jobs[i].followUp,
      comment: this.state.jobs[i].comment
    }
    const res = await axios.patch(`${process.env.PUBLIC_URL}/api/update_jobstack/` + this.state.jobs[i].jobId, job);
    if (res.status === 200)
      this.setState({ snackOpen: true });
    else
      this.setState({ failSnack: true });
  }
  deleteHandler = async (row, event) => {
    event.preventDefault();
    const i = this.state.jobs.indexOf(row);
    const id = this.state.jobs[i].jobId;
    var ch = this.state.jobs;
    await axios.delete(`${process.env.PUBLIC_URL}/api/delete_jobstack/` + this.state.jobs[i].jobId);
    ch.splice(i, 1);
    var j = this.state.all_jobs;
    j = j.filter(function (j) {
      return j.jobId !== id;
    });
    this.setState({ jobs: ch, all_jobs: j });
    this.setState({ deleteOpen: false });
  }
  handleChangePage = async (event, newPage) => {
    this.setState({ page: newPage });
  };
  applyClickHandler = async () => {
    this.filterJobstack();
    this.setState({ filterOpen: false });
  }
  companyChangeHandler = async (event) => {
    await this.setState({
      selectedCompanies: event
    })
  }
  clearFilter = async () => {
    this.setState({
      role: [],
      status: [],
      selectedCompanies: [],
    });
  }

  async filterJobstack() {
    const body = {
      role: this.state.role,
      status: this.state.status,
      selectedCompanies: this.state.selectedCompanies,
    }
    if (body.role.length === 0)
      body.role = ["Intern", "Full time"];

    if (body.status.length === 0)
      body.status = ["Not Applied", "Applied", "Asked for Referral", "Interview Scheduled", "Fod diya re!", "Hiring test done!", "Better luck next time!"];

    if (body.selectedCompanies.length === 0) {
      let companies = [];
      companies = this.state.all_jobs.map(company => { return company.companyName })
      body.selectedCompanies = companies;
    }
    var list_job = [];
    var job = this.state.all_jobs;
    list_job = job.reduce((result, j) => {
      if (j.role.some(item => body.role.includes(item)) && body.status.includes(j.status) && body.selectedCompanies.includes(j.companyName)) {
        result.push(j);
      }
      return result;
    }, []);

    this.setState({
      role: body.role,
      status: body.status,
      selectedCompanies: [],
      jobs: list_job,
    })
  }
  changeGiphy = () => {
    this.setState({ giphy: false });
  }
  handleChangeSort = async (event) => {
    const val = event.target.value;
    if (val === "addTime") {
      var job = this.state.jobs;
      job.sort(function (a, b) {
        return new Date(b[val]) - new Date(a[val]);
      });
      await this.setState({
        sortBy: val,
        jobs: job,
        all_jobs: job,
      })
    }
    else if (val === "jobExpiry") {
      var jobb = this.state.jobs;
      jobb.sort(function (a, b) {
        return new Date(a[val]) - new Date(b[val]);
      });
      await this.setState({
        sortBy: "jobExpiry",
        jobs: jobb,
      })
    }
  };


  async componentDidMount() {
    const body = {
      sortBy: this.state.sortBy,
      comparator: this.state.comparator,
    }
    const st = await axios({
      method: 'get',
      url: `${process.env.PUBLIC_URL}/api/jobstack`,
      params: body
    });
    const jobs = st.data;
    await this.setState({
      jobs: jobs,
      all_jobs: jobs,
    })
    let companies = [];
    companies = this.state.jobs.map(company => { return company.companyName; })
    this.setState({ company_list: companies });
  }

  render() {
    const save_hover = `Save changes`;
    return (
      <StylesProvider injectFirst>
        <div className='jobstack' style={{ marginTop: "0.5rem" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableHead">Company</TableCell>
                  <TableCell className="tableHead">Status</TableCell>
                  <TableCell className="tableHead">Follow-up</TableCell>
                  <TableCell className="tableHead">Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(this.state.rowsPerPage > 0
                  ? this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  : this.state.jobs
                ).map((row) => (
                  <TableRow key={row.jobId}>
                    <TableCell align="center"><a href={row.jobLink}>{row.companyName}</a></TableCell>
                    <TableCell align="center">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={row.status}
                        onChange={this.handleChangeStatus.bind(this, row)}
                      >
                        <MenuItem value={"Not Applied"} > Not Applied</MenuItem>
                        <MenuItem value={"Asked for Referral"} >Asked for Referral</MenuItem>
                        <MenuItem value={"Applied"} >Applied</MenuItem>
                        <MenuItem value={"Hiring test done!"} >Hiring test done!</MenuItem>
                        <MenuItem value={"Interview Scheduled"} name="status">Interview Scheduled</MenuItem>
                        <MenuItem value={"Better luck next time!"} >Better luck next time!</MenuItem>
                        <MenuItem value={"Fod diya re!"} >Fod diya re!</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell align="center">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={row.followUp}
                        onChange={this.handleChangeFollowUp.bind(this, row)}
                      >
                        <MenuItem value={"No"} > No</MenuItem>
                        <MenuItem value={"Yes"} >Yes</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell align="center">
                      <TextField id="standard-multiline-flexible" fullWidth label="Add a comment" multiline rowsMax={3} name="comment" value={row.comment}
                        onChange={this.handleChange.bind(this, row)} />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title={save_hover}>
                        <IconButton aria-label="save" onClick={this.submitHandler.bind(this, row)} >
                          <SaveIcon style={{ color: '#33b579' }} fontSize="default" />
                        </IconButton>
                      </Tooltip>
                      <Snackbar open={this.state.snackOpen} autoHideDuration={6000} onClose={this.handleClose} >
                        <Alert onClose={this.handleClose} severity="success">
                          Job details updated!
                      </Alert>
                      </Snackbar>
                      <Snackbar open={this.state.failSnack} autoHideDuration={6000} onClose={this.handleFailSnackClose} >
                        <Alert onClose={this.handleFailSnackClose} severity="error">
                          Job update failed!
                      </Alert>
                      </Snackbar>
                    </TableCell>

                    <TableCell >
                      <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={this.handleClickOpen.bind(this, row)}>
                          <DeleteIcon style={{ color: '#33b579' }} fontSize="default" />
                        </IconButton>
                      </Tooltip>
                      <Dialog
                        open={this.state.deleteOpen}
                        onClose={this.handleDeleteClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle style={{ color: "black" }} id="alert-dialog-title">{"Are you sure you want to delete?"}</DialogTitle>
                        <DialogActions>
                          <Button style={{ backgroundColor: "#33b579" }} onClick={this.handleDeleteClose} color="primary" autoFocus >
                            No
                        </Button>
                          <Button style={{ backgroundColor: "#dfe6e3" }} onClick={this.deleteHandler.bind(this, this.state.jobs[this.state.current_row])} >
                            Yes
                        </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>

                    <TableCell align="center">
                      <NotificationModal job={row} />
                    </TableCell>


                    <TableCell align="center">
                      <JobstackModal job={row} />
                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <Table aria-label="custom pagination table">
              <TableFooter>
                <TableRow>
                  <TableCell> Sort By: &nbsp;
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.state.sortBy}
                      onChange={this.handleChangeSort}
                    >
                      <MenuItem value={"addTime"} > Recent Added</MenuItem>
                      <MenuItem value={"jobExpiry"} >Job Expiry</MenuItem>
                    </Select>

                  &nbsp;
                  <div style={{ display: "inline" }}>
                      <Button onClick={this.handleClickFilterOpen}>Filter</Button>
                      <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.filterOpen} onClose={this.handleFilterClose}>
                        <DialogTitle style={{ color: "black" }} >Select Filter</DialogTitle>
                        <DialogContent>
                          <form >
                            <FormControl style={{ color: "black" }} component="fieldset">
                              <FormLabel component="legend">Role</FormLabel>
                              <RadioGroup name="role" value={this.state.role} onChange={this.roleChangeHandler}>
                                <FormControlLabel style={{ color: "black" }} value="Intern" checked={this.state.role === "Intern"} control={<Radio />} label="Intern" />
                                <FormControlLabel value="Full time" checked={this.state.role === "Full time"} control={<Radio />} label="Full time" />
                              </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset">
                              <FormLabel component="legend">Status</FormLabel>
                              <FormGroup>
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Not Applied")}
                                    onChange={this.statusChangeHandler} name="Not Applied" />}
                                  label="Not Applied"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Asked for Referral")}
                                    onChange={this.statusChangeHandler} name="Asked for Referral" />}
                                  label="Asked for Referral"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Applied")}
                                    onChange={this.statusChangeHandler} name="Applied" />}
                                  label="Applied"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Hiring test done!")}
                                    onChange={this.statusChangeHandler} name="Hiring test done!" />}
                                  label="Hiring test done!"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Interview Scheduled")}
                                    onChange={this.statusChangeHandler} name="Interview Scheduled" />}
                                  label="Interview Scheduled"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Better luck next time!")}
                                    onChange={this.statusChangeHandler} name="Better luck next time!" />}
                                  label="Better luck next time!"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={this.state.status.includes("Fod diya re!")}
                                    onChange={this.statusChangeHandler} name="Fod diya re!" />}
                                  label="Fod diya re!"
                                />
                              </FormGroup>
                            </FormControl>

                            <FormControl component="fieldset">
                              <FormLabel component="legend">Companies (at most 5)</FormLabel>
                              <Multiselect
                                options={this.state.company_list}
                                isObject={false}
                                onSelect={this.companyChangeHandler}
                                onRemove={this.companyChangeHandler}
                                placeholder="Select Companies"
                                // selectedValues={this.state.selectedCompanies}
                                selectionLimit="5"
                              />
                            </FormControl>
                            <Button className='clear-filter' style={{ backgroundColor: "#33b579" }} onClick={this.clearFilter} >
                              Clear Filter
                          </Button>
                          </form>
                        </DialogContent>
                        <DialogActions>
                          <Button style={{ backgroundColor: "#dfe6e3" }} onClick={this.handleFilterClose} >
                            Cancel
                      </Button>
                          <Button style={{ backgroundColor: "#33b579" }} onClick={this.applyClickHandler} >
                            Apply
                      </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </TableCell>

                  <TablePagination
                    rowsPerPageOptions={[6]}
                    colSpan={3}
                    count={this.state.jobs.length}
                    rowsPerPage={6}
                    page={this.state.page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={this.handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <div>

            {this.state.giphy ? <Giphy isOpen={this.state.giphy} status={this.state.stat} changeGiphyInJobstack={this.changeGiphy} /> : null}
          </div>
        </div>
      </StylesProvider>
    );
  }
}


export default Jobstack;