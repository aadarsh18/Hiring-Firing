import React, { Component } from 'react';
import axios from 'axios';
import Jobcard from './Jobcard';
import Box from '@material-ui/core/Box';
import './Jobboard.css';
import Sortingfilters from './SortingFilters';
import { TouchBallLoading } from 'react-loadingg';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
class Jobboard extends Component {

    constructor(props) {
        var pg = 1, x = localStorage.getItem("page");
        if (x) {
            pg = parseInt(x);
            localStorage.removeItem("page");
        }
        super(props);

        this.myRef = React.createRef();

        let filterLocalStore;
        if (localStorage.getItem('filterLocalStore')) {
            const filterString = localStorage.getItem('filterLocalStore');
            filterLocalStore = JSON.parse(filterString);
        }

        this.state = {
            jobs: [],
            page: pg,
            selectedCompanies: filterLocalStore ? filterLocalStore.selectedCompanies : [],
            role: filterLocalStore ? filterLocalStore.role : [],
            sortBy: filterLocalStore ? filterLocalStore.sortBy : "postedOn",
            comparator: filterLocalStore ? filterLocalStore.comparator : -1,
            batch: filterLocalStore ? filterLocalStore.batch : [],
            jobcount: 1,
            userJobstack: [],
            floatButton: 0,
            sortingClass: "sorting-filters",
            listofcompanies: [],
            paginationItems: [],
            isFetching: true
        }

        this.refJobs = React.createRef();
    }
    async componentDidMount() {
        const userJobstack = await axios.get(`${process.env.PUBLIC_URL}/api/jobstack_userjobs`);
        const comp = await axios.get(`${process.env.PUBLIC_URL}/api/company_list`);
        this.setState({
            userJobstack: userJobstack.data,
            listofcompanies: comp.data
        });
        this.fetchJobs();
    }

    setLocal = (x) => {
        localStorage.setItem("page", this.state.page);
    }
    async fetchJobs() {
        this.setState({ isFetching: true });
        var body = {
            page: this.state.page,
            sortBy: this.state.sortBy,
            comparator: this.state.comparator,
            batch: this.state.batch,
            role: this.state.role,
            companies: this.state.selectedCompanies
        }
        var job = await axios({
            method: 'get',
            url: `${process.env.PUBLIC_URL}/api/page_job?page=${this.state.page}`,
            params: body
        });

        const page_jobs = job.data.page;
        const jc = job.data.count;

        const jobcount = parseInt(jc);

        this.setState({
            jobs: page_jobs,
            jobcount: jobcount
        })
        this.getPagination();
        if (this.refJobs.current)
            this.refJobs.current.scrollTop = 0;
        this.setState({ isFetching: false });
    }

    async clickHandler(p) {
        const newp = parseInt(p);
        this.setState({
            page: newp
        }, async () => {
            await this.fetchJobs();
        })
    }
    filterHandler = async (body) => {
        this.setState({
            page: 1,
            sortBy: body.sortBy,
            comparator: body.comparator,
            batch: body.batch,
            role: body.role,
            selectedCompanies: body.selectedCompanies
        }, () => {
            this.fetchJobs();
        })
    }
    showSorting = () => {
        var cls = this.state.sortingClass
        if (cls === "sorting-filters") {
            cls = cls + " show-sorting";
        }
        else {
            cls = "sorting-filters";
        }
        this.setState({
            sortingClass: cls,
            floatButton: !this.state.floatButton
        });

    }
    removeShowSorting = () => {
        if (this.state.sortingClass !== "sorting-filters") {
            this.setState({
                sortingClass: "sorting-filters",
                floatButton: !this.state.floatButton
            })
        }
    }
    getPagination = () => {
        //Pagination Logic
        var items = [];
        const PAGE_SIZE = 10;
        const jc = this.state.jobcount;//change this accordingly

        var totalPages = parseInt(jc / PAGE_SIZE) + parseInt(((jc % PAGE_SIZE) ? 1 : 0));
        var currentPage = this.state.page;
        var firstPage = Math.max(1, currentPage - 2), lastPage = Math.min(totalPages, currentPage + 2);
        if (currentPage === 1) {
            items.push(
                <button disabled key={-1} style={{ backgroundColor: "white" }
                } className="pagination" >{"<<"}</button>
            )
            items.push(
                <button disabled key={0} style={{ backgroundColor: "white" }
                } className="pagination" >{"<"}</button>
            )
        }
        else {
            items.push(
                <button onClick={() => this.clickHandler(1)} key={-1} style={{ backgroundColor: "white", cursor: "pointer" }
                } className="pagination" > {"<<"}</button>
            )
            items.push(
                <button onClick={() => this.clickHandler(currentPage - 1)} key={0} style={{ backgroundColor: "white", cursor: "pointer" }
                } className="pagination" > {"<"}</button>
            )
        }

        for (let num = firstPage; num <= lastPage; num++) {
            var col = "white";
            if (num === currentPage)
                col = "#33b579";
            items.push(
                <button onClick={() => this.clickHandler(num)} key={num} style={{ backgroundColor: col, cursor: "pointer" }
                } className="pagination" > {num}</button>
            );
        }
        if (currentPage === totalPages) {
            items.push(
                <button disabled key={totalPages + 2} style={{ backgroundColor: "white" }
                } className="pagination" >{">>"}</button>
            )
            items.push(
                <button disabled key={totalPages + 1} style={{ backgroundColor: "white" }
                } className="pagination" >{">"}</button>
            )
        }
        else {
            items.push(
                <button onClick={() => this.clickHandler(currentPage + 1)} key={totalPages + 1} style={{ backgroundColor: "white", cursor: "pointer" }
                } className="pagination" > {">"}</button>
            )
            items.push(
                <button onClick={() => this.clickHandler(totalPages)} key={totalPages + 2} style={{ backgroundColor: "white", cursor: "pointer" }
                } className="pagination" > {">>"}</button>
            )
        }
        this.setState({
            paginationItems: items
        });
    }
    render() {
        var JOBS = this.state.jobs;
        return (
            <div className="jobboard-parent">
                <div className="filter-button">
                    <button className="filterbtn" style={{ backgroundColor: "#4dffa6", width: "4rem", height: "4rem", borderRadius: "50%" }} onClick={this.showSorting}>{this.state.floatButton ? <i className="fa fa-close" style={{ fontSize: "2rem" }}></i> : <i className="fa fa-filter" style={{ fontSize: "2rem" }}></i>}</button>
                </div>
                <div className="jobboard">
                    {
                        this.state.isFetching
                            ?
                            <div className="Loading"> <TouchBallLoading style={{ width: "10rem" }} speed={0} color={"#33b579"} size="large" /></div>
                            :
                            JOBS.length
                                ?
                                <div onClick={this.removeShowSorting} className="jobs" id="jobs" ref={this.refJobs}>
                                    <div>
                                        {
                                            JOBS.map(job => (
                                                //Adding key property here is segregating the the jobs being called and on changing the page calling the,
                                                //child's component again
                                                <Jobcard key={job.jobId} job={job} setLocal={this.setLocal} notButton={this.state.userJobstack.includes(job.jobId)} />
                                            )
                                            )
                                        }
                                        <div className="center pagination-wraper">
                                            {this.state.paginationItems}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div style={{ position: "relative", marginLeft: "50%", left: "-8rem", top: "30%" }}>
                                    <h4 style={{ color: "grey" }}>No matching jobs to show!</h4>
                                    <div style={{ position: "relative", left: "7rem" }}>
                                        <SentimentVeryDissatisfiedIcon style={{ color: "grey" }} fontSize="large" />
                                    </div>
                                </div>
                    }
                </div>
                <div className="filterboard">
                    <Box
                        boxShadow={1}
                        bgcolor="background.paper"
                        m={1}
                        p={1}
                        style={{ margin: "1rem 7rem 8rem 0rem", borderRadius: "5px", padding: "0", backgroundColor: "white" }}
                    >
                        <div className={this.state.sortingClass}>
                            <Sortingfilters companylist={this.state.listofcompanies} filterHandler={this.filterHandler} />
                        </div>
                    </Box>
                </div>
            </div>
        )
    }
}
export default Jobboard;