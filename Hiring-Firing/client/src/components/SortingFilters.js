import React, { Component } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import { StylesProvider } from "@material-ui/core/styles";
import './SortingFilters.css';

// import './style.css'
import Button from '@material-ui/core/Button'


class Sortingfilters extends Component {
    constructor(props) {
        super(props);
        let filterLocalStore;
        if (localStorage.getItem('filterLocalStore')) {
            const filterString = localStorage.getItem('filterLocalStore');
            filterLocalStore = JSON.parse(filterString);
        }
        this.state = {
            sortBy: filterLocalStore ? filterLocalStore.sortBy : "postedOn",
            comparator: filterLocalStore ? filterLocalStore.comparator : -1,
            checkSort: filterLocalStore ? filterLocalStore.checkSort : "recentpost",
            batch: filterLocalStore ? filterLocalStore.batch : [],
            role: filterLocalStore ? filterLocalStore.role : [],
            selectedCompanies: filterLocalStore ? filterLocalStore.selectedCompanies : [],
            company_list: [],
            isFilterProcessing: false
        }
        this.style = {
            chips: {
                background: "#0099cc"
            },
            searchBox: {
                height: "4rem",
                border: "none",
                "borderBottom": "1px solid blue",
                "borderRadius": "0px"
            },
            multiselectContainer: {
                color: "red"
            }
        };
    }
    async componentDidMount() {
        // var companyList = await axios.get(`${process.env.PUBLIC_URL}/api/company_list`);
        var companyList = this.props.companylist;
        await this.setState({
            company_list: companyList
        });
    }

    async componentDidUpdate(prevProp, prevState, SnapShot) {
        if (this.props.companylist.length !== 0) {
            if (this.state.company_list.length === 0) {
                var ans = this.props.companylist;
                await this.setState({
                    company_list: ans
                });
            }
        }
    }

    sortByHandler = (event) => {
        var val = event.target.value;
        if (val === "recentpost") {
            this.setState({
                sortBy: "postedOn",
                comparator: -1,
            })
        }
        else if (val === "firstpost") {
            this.setState({
                sortBy: "postedOn",
                comparator: 1
            })
        }
        else if (val === "recentexpiry") {
            this.setState({
                sortBy: "jobExpiry",
                comparator: 1
            })
        }
        else if (val === "lastexpiry") {
            this.setState({
                sortBy: "jobExpiry",
                comparator: -1
            })
        }
        else {
            this.setState({
                sortBy: "likersCount",
                comparator: -1
            })
        }
        this.setState({
            checkSort: val
        })
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
        }
        else {
            new_role.push(val);
        }
        this.setState({ role: new_role });
    }
    companyChangeHandler = async (event) => {
        await this.setState({
            selectedCompanies: event
        })
    }
    applyClickHandler = async () => {
        if (!this.state.isFilterProcessing) {
            this.setState({
                isFilterProcessing: true
            }, () => {
                var body = {
                    sortBy: this.state.sortBy,
                    comparator: this.state.comparator,
                    batch: this.state.batch,
                    role: this.state.role,
                    selectedCompanies: this.state.selectedCompanies,
                    checkSort: this.state.checkSort
                }
                let filterLocalStore = body;
                localStorage.setItem('filterLocalStore', JSON.stringify(filterLocalStore));
                this.props.filterHandler(body);
                this.setState({
                    isFilterProcessing: false
                });
            });
        }
    }
    render() {

        return (
            <StylesProvider injectFirst>
                <div style={{ padding: "1rem", }}>
                    <div style={{ marginTop: "1rem" }} className="sorting">
                        <div style={{ textAlign: 'center', color: "rgb(90, 90, 90)" }}><b>Sort By</b></div>
                        <hr style={{ borderTop: "1px solid #33b579", marginTop: "0.3rem", marginBottom: "0.6rem" }} />
                        <br />
                        <label>
                            <input className="with-gap" type="radio"
                                name='sort' value="recentpost"
                                checked={this.state.checkSort === "recentpost"}
                                onChange={this.sortByHandler}
                            />
                            <span >Recent Posted</span>
                        </label>
                        <br />
                        <label>
                            <input className="with-gap" type="radio"
                                name='sort' value="firstpost"
                                checked={this.state.checkSort === "firstpost"}
                                onChange={this.sortByHandler}
                            />
                            <span >First Posted</span>
                        </label>
                        <br />
                        <label>
                            <input className="with-gap" type="radio"
                                name='sort' value="recentexpiry"
                                checked={this.state.checkSort === "recentexpiry"}
                                onChange={this.sortByHandler}
                            />
                            <span >Recent Expiry</span>
                        </label>
                        <br />
                        <label>
                            <input className="with-gap" type="radio"
                                name='sort' value="lastexpiry"
                                checked={this.state.checkSort === "lastexpiry"}
                                onChange={this.sortByHandler}
                            />
                            <span >Late Expiry</span>
                        </label>
                        <br />
                        <label>
                            <input className="with-gap" type="radio"
                                name='sort' value="mostliked"
                                onChange={this.sortByHandler}
                            />
                            <span >Most Liked</span>
                        </label>
                    </div>
                    <br />



                    <div style={{ marginTop: "2rem" }} className="filters">
                        <div style={{ textAlign: "center", color: "rgb(90, 90, 90)" }} ><b>Filters</b></div>
                        <hr style={{ borderTop: "1px solid #33b579", marginTop: "0.3rem", marginBottom: "0.6rem" }} />



                        <div style={{ textAlign: "center", color: "black", marginTop: "0.5rem", marginBottom: "0.5rem" }} >Batch</div>
                        <p>
                            <label>
                                <input type="checkbox" name='batch' value="2020"
                                    checked={this.state.batch.includes("2020")}
                                    onChange={this.batchChangeHandler}
                                />
                                <span>2020</span>
                            </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                <input type="checkbox" name='batch' value="2021"
                                    checked={this.state.batch.includes("2021")}
                                    onChange={this.batchChangeHandler}
                                />
                                <span>2021</span>
                            </label>
                            <br />
                            <label>
                                <input type="checkbox" name='batch' value="2022"
                                    checked={this.state.batch.includes("2022")}
                                    onChange={this.batchChangeHandler}
                                />
                                <span>2022</span>
                            </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                <input type="checkbox" name='batch' value="2023"
                                    checked={this.state.batch.includes("2023")}
                                    onChange={this.batchChangeHandler}
                                />
                                <span>2023</span>
                            </label>
                            <br />
                            <label>
                                <input type="checkbox" name='batch' value="2024"
                                    checked={this.state.batch.includes("2024")}
                                    onChange={this.batchChangeHandler}
                                />
                                <span>2024</span>
                            </label>
                        </p>



                        <div style={{ textAlign: "center", color: "black", marginTop: "0.5rem", marginBottom: "0.5rem" }} >Role</div>
                        <p>
                            <label>
                                <input type="checkbox" name='role' value="Intern"
                                    checked={this.state.role.includes("Intern")}
                                    onChange={this.roleChangeHandler}
                                />
                                <span>Intern</span>
                            </label>&nbsp;&nbsp;&nbsp;
                            <label>
                                <input type="checkbox" name='role' value="Full time"
                                    checked={this.state.role.includes("Full time")}
                                    onChange={this.roleChangeHandler}
                                />
                                <span>Full time</span>
                            </label>&nbsp;&nbsp;&nbsp;
                        </p>
                        <div style={{ textAlign: "center", color: "black", marginTop: "0.5rem", marginBottom: "0.5rem" }} >
                            <p><b>Companies</b> (atmost 5)</p>
                        </div>
                        <div className="multiselect">
                            <Multiselect
                                options={this.state.company_list}
                                style={{
                                    multiselectContainer: { "overflow": "hidden" }, searchBox: { "overflow": "hidden" },
                                    optionListContainer: { "height": "10rem", "zIndex": "1000", "position": "relative" },
                                    optionContainer: { "height": "14rem", "zIndex": "1000", "position": "relative" }
                                }}
                                isObject={false}
                                onSelect={this.companyChangeHandler}
                                onRemove={this.companyChangeHandler}
                                placeholder="Select Companies"
                                selectedValues={this.state.selectedCompanies}
                                selectionLimit="5"
                            />
                        </div>

                        <Button style={{ position: "relative", marginLeft: "50%", left: "-2.5rem", marginTop: "1.5rem", marginBottom: "8rem", width: "5.5rem", backgroundColor: "#33b579" }} onClick={this.applyClickHandler} variant="contained"><b><span style={{ color: "white" }}>Apply</span></b></Button>
                    </div>
                </div >
            </StylesProvider>
        )
    }
};
export default Sortingfilters;
