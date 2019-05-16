import React, { Component } from 'react';
import { TextField, Button, Snackbar, IconButton, Checkbox, FormControlLabel } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import api from '../../util/api';
import auth from '../../util/auth';
import localization, { locale, getCurrentLocale, formatText } from '../../util/localization'
import LazyLoadingComponent from '../lazy-loading/lazyLoading';
import CloseIcon from '@material-ui/icons/Close';

class RegisterComponent extends Component {

    state = {
        open: false
    };

    constructor(props) {
        super(props);
        this.state = {
            errorSnackbar: {
                open: false,
                message: "no error"
            },
            redirectToLogin: false,
            loading: true,
            boardName: "loading board"
        };
        this.register = this.register.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    handleClose() {
        this.setState({
            errorSnackbar: {
                open: false,
                message: "no error"
            }
        })
    }

    componentDidMount() {
        if (!this.state.loading) {
            return;
        }
        // fetch board name
        api.get(api.endpoints.BOARD_GET, {}, (data) => {
            if (data.error) {
                console.error("Failed to fetch data from backend.")
                return;
            }
            if (data.private) {
                this.setState({
                    redirectToLogin: true
                });
                return;
            }
            console.log(JSON.stringify(data))
            this.setState({
                boardName: data.name,
                loading: false
            })
        })
    }

    render() {
        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login"></Redirect>
            );
        }
        if (this.state.loading) {
            return (
                <div style={{margin: "20px"}}>
                    <LazyLoadingComponent width="400" height="75" />
                    <br />
                    <LazyLoadingComponent width="450" height="50" />
                </div>
            )
        }
        return (
            <div style={{margin: "20px"}}>
                <h1>{this.state.boardName}</h1>
                <p>{localization.getLocaleString("REGISTER_DESCRIPTION", {boardName: this.state.boardName})}</p>
                <TextField 
                    label={localization.getLocaleString("COMMON_USERNAME")}
                    style={{width: "400px"}}
                    margin="normal"
                    id="register-username"
                />
                <br />
                <TextField 
                    label={localization.getLocaleString("COMMON_PASSWORD")}
                    margin="normal"
                    type="password"
                    style={{width: "400px"}}
                    autoComplete="cure-password"
                    id="register-password"
                />
                <br />
                <br />
                <h4>{localization.getLocaleString("REGISTER_LEGAL_MUMBO_JUMBO_HEADER").toUpperCase()}</h4>
                <p>{localization.getLocaleString("REGISTER_LEGAL_MUMBO_JUMBO_DESCRIPTION", {boardName: this.state.boardName})}</p>
                <br />
                <Button variant="contained" onClick={this.register} color="primary">
                    {localization.getLocaleString("REGISTER_BUTTON")}
                </Button>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.errorSnackbar.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={this.state.errorSnackbar.message}
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


    register() {
        console.log(this.passwordRef)
        api.post(api.endpoints.AUTH_REGISTER, {
            username: document.getElementById("register-username").value,
            password: document.getElementById("register-password").value
        }, {}, (data) => {
            if (data.error) {
                this.setState({
                    errorSnackbar: {
                        open: true,
                        message: localization.getLocaleString("REGISTER_FAILED", {error: data.error.friendly_name})
                    }
                })
                return
            }
            console.log("redirecting to login")
            this.setState({
                redirectToLogin: true
            })
        })
    }
}

export default RegisterComponent;