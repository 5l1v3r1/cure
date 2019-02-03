import React, { Component } from 'react';
import { TextField, Button, Snackbar, IconButton } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { endpoints, post } from './../util/api';
import CloseIcon from '@material-ui/icons/Close';

// TODO rename this to LoginComponent
class MainComponent extends Component {

    state = {
        open: false
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            redirectToRegister: false
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

    render() {
        if (this.state.redirectToRegister) {
            return (
                <Redirect to="/register"></Redirect>
            );
        }
        return (
            <div style={{margin: "20px"}}>
                <center>
                    <p style={{fontSize: "2.5em"}}>insert board name</p>
                    <p>Welcome to board name!</p>
                    <TextField 
                        id="login-field-username"
                        label="Username"
                        magin="normal"
                    />
                    <br />
                    <TextField 
                        id="login-field-password"
                        label="Password"
                        magin="normal"
                        type="password"
                        autoComplete="cure-password"
                    />
                    <br />
                    <br />
                    <Button variant="contained" onClick={this.login} color="primary">
                        Login
                    </Button>
                    <span>&nbsp;</span>
                    <Button variant="contained" onClick={this.register} color="secondary">
                        Register
                    </Button>
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
                    message={<span id="message-id">Failed to login: Invalid Password</span>}
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
        if (username === "" || password === "") {
            // TODO update snackbar text
        }
        post(endpoints.AUTH_LOGIN, {
            username: username,
            password: password
        }, {}, (data)=> {
            if (data.error) {
                this.setState({
                    open: true
                });
            }
        })
    }

    register() {
        this.setState({
            redirectToRegister: true
        });
    }
}

export default MainComponent;