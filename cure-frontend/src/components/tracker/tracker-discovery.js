import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../../util/auth';
import api from '../../util/api';
import LazyLoadingComponent from '../lazy-loading/lazyLoading';


class TrackerDiscovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login"></Redirect>
            )
        }
        if (!this.state.trackers || !this.state.me) {
            return (
                <div>
                    <LazyLoadingComponent width="100" height="200" />
                </div>
            );
        }
        return (
            <div className="tracker-discovery">
                <h1>Trackers</h1>
                
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
            // queue authentication.
            auth.getWithAuthentication(api.endpoints.USERS_ME, {}, (data) => {
                this.setState({
                    me: data
                })
            })
            auth.getWithAuthentication(api.endpoints.TRACKERS_GET_ALL, {}, (data) => {
                this.setState({
                    trackers: data.trackers
                })
            })
        })
    }
}

export default TrackerDiscovery;