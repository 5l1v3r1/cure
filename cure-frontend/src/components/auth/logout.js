import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import auth from '../../util/auth';
import CheckIcon from '@material-ui/icons/Check';
import api from '../../util/api';
import localization from '../../util/localization';

class LogoutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            isLoggingOut: true
        }
    }

    render() {
        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login"></Redirect>
            )
        }
        if (!this.state.isLoggingOut) {
            return (
                <div className="logout-panel">
                    <h1><CheckIcon /> {localization.getLocaleString("LOGOUT_SUCCESS")}</h1>
                    <p>{localization.getLocaleString("LOGOUT_CLOSE_TIP")}</p>
                </div>
            )
        }
        return (
            <div className="logout-panel">
                <h1>{localization.getLocaleString("LOGOUT_LOGGING_OUT")}</h1>
                <p>{localization.getLocaleString("LOGOUT_PLEASE_WAIT")}</p>
            </div>
        );
    }

    componentDidMount() {
        if (!auth.authenticated) {
            this.setState({
                redirectToLogin: true
            })
            return;

        }
        auth.checkCurrentSession((authenticated) => {
            if (!authenticated) {
                this.setState({
                    redirectToLogin: true
                });
                return;
            }
            auth.logout();
            this.setState({
                isLoggingOut: false
            })
        })
    }
}

export default LogoutComponent;