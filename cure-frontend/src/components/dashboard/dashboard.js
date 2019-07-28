import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../../util/auth';
import api from '../../util/api';

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            username: "loading user"
        }
    }

    render() {
        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login"></Redirect>
            )
        }
        return (
            <div className="dashboard">
                <h1>Welcome, {this.state.username}</h1>
            </div>
        );
    }

    componentDidMount() {
        auth.checkCurrentSession((loggedIn) => {
            if (!loggedIn) {
                this.setState({
                    redirectToLogin: true
                })
                return;
            }
            auth.getCurrentUser((user) => {
                this.setState({
                    username: user.username
                })
            })
        })
    }
}

export default DashboardComponent;