import React, { Component } from 'react';
import { TextField, Button, Snackbar, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { endpoints, post } from './../util/api';
import CloseIcon from '@material-ui/icons/Close';

class MainComponent extends Component {

    state = {
        open: false
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.login = this.login.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            open: false
        })
    }

    render() {
        return (
            <div style={{margin: "20px"}}>
                <center>
                    <p style={{fontSize: "3em"}}>Cure</p>
                    <p>This is a private board. Please login below.</p>
                    <TextField 
                        id="login-field-username"
                        label="Username"
                        magin="normal"
                    />
                    <br />
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
                    <Button onClick={this.login}>
                        Login
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
                        onClick={this.handleClose}
                        >
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
}

export default MainComponent;