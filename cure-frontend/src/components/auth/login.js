import React, { Component } from 'react';
import { TextField, Button, Snackbar, IconButton, Checkbox, FormControlLabel } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import api from '../../util/api';
import auth from '../../util/auth';
import localization, { locale, getCurrentLocale, formatText } from '../../util/localization'
import CloseIcon from '@material-ui/icons/Close';

// TODO rename this to LoginComponent
class LoginComponent extends Component {

    state = {
        open: false
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            redirectToRegister: false,
            boardName: "Unknown",
            boardPrivate: true,
            snackbarText: "",
            redirectToDashboard: false
        };
        this.login = this.login.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.register = this.register.bind(this);
    }

    handleClose() {
        this.setState({
            open: false,
            redirectToRegister: false
        })
    }

    componentDidMount() {
        // fetch board name
        api.get(api.endpoints.BOARD_GET, {}, (data) => {
            if (data.error) {
                console.error("Failed to fetch data from backend.")
                return;
            }
            this.setState({
                boardName: data["name"],
                boardPrivate: data["private"]
            })
        })
        auth.checkCurrentSession((loggedIn)=> {
            if (loggedIn) {
                this.setState({
                    redirectToDashboard: true
                })
            }
        })
    }

    render() {
        if (this.state.redirectToRegister) {
            return (
                <Redirect to="/register"></Redirect>
            );
        }
        if (this.state.redirectToDashboard) {
            return (
                <Redirect to="/dashboard"></Redirect>
            );
        }
        // TODO make enter submit form
        return (
            <div style={{margin: "20px"}}>
                <center>
                    <form>
                        <h1>{this.state.boardName}</h1>
                        <p>{localization.getLocaleString(
                            this.state.private ? "BOARD_WELCOME_SIGN_IN" : "BOARD_WELCOME_SIGN_IN_OR_REGISTER", {
                                boardName: this.state.boardName
                            })}</p>
                        <TextField 
                            id="login-field-username"
                            label={localization.getLocaleString("COMMON_USERNAME")}
                            margin="normal"
                        />
                        <br />
                        <TextField 
                            id="login-field-password"
                            label={localization.getLocaleString("COMMON_PASSWORD")}
                            margin="normal"
                            type="password"
                            autoComplete="cure-password"
                        />
                        <br />
                        <FormControlLabel
                            control={<Checkbox
                                id="login-field-remember-me"
                                margin="normal" />}
                            label={localization.getLocaleString("REMEMBER_ME")} />
                        <br />
                        <Button variant="contained" onClick={this.login} color="primary">
                            {localization.getLocaleString("LOGIN_BUTTON")}
                        </Button>
                        <span>&nbsp;</span>
                        <Button variant="contained" onClick={this.register} color="secondary">
                            {localization.getLocaleString("REGISTER_BUTTON")}
                        </Button>
                    </form>
                </center>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={this.state.snackbarText}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                    />
            </div>
        );
    }

    login() {
        var username = document.getElementById("login-field-username").value;
        var password = document.getElementById("login-field-password").value;
        var rememberMe = document.getElementById("login-field-remember-me").checked;
        if (username === "") {
            this.setState({
                open: true,
                snackbarText: localization.getLocaleString("LOGIN_FAIL_USERNAME_REQUIRED")
            });
            return;
        } else if (password === "") {
            this.setState({
                open: true,
                snackbarText: localization.getLocaleString("LOGIN_FAIL_PASSWORD_REQUIRED")
            });
            return;
        }
        auth.login(username, password, rememberMe, (data) => {
            if (!data.success) {
                this.setState({
                    open: true,
                    snackbarText: localization.getLocaleString("LOGIN_FAIL_INVALID_PASSWORD")
                })
            } else {
                this.setState({
                    open: false,
                    redirectToDashboard: true
                });
            }
        });
    }

    register() {
        this.setState({
            redirectToRegister: true
        });
    }
}

export default LoginComponent;