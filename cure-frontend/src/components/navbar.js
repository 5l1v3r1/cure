import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import { Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NavdrawerComponent from './navdrawer';
import auth from '../util/auth';


class NavbarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signedIn: auth.currentSession != null
        }

        this.openMenu = this.openMenu.bind(this);
        this.addUpdateHandler = this.addUpdateHandler.bind(this);
        this.addUpdateHandler();
    }

    addUpdateHandler() {
        auth.listenForLogin(() => {
            this.setState({
                signedIn: true
            });
        });

        auth.listenForLogout(() => {
            this.setState({
                signedIn: false
            });
        });
    }

    render() {
        if (!this.state.signedIn) {
            return (
                <div>
                    <NavdrawerComponent ref="navdrawerMain" />
                    <AppBar position="static">
                        <Toolbar className="navbar-header">
                            <Typography variant="h6" color="inherit">
                                Cure
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
            );
        }
        return (
            <div>
                <NavdrawerComponent ref="navdrawerMain" />
                <AppBar position="static">
                    <Toolbar className="navbar-header">
                        <IconButton color="inherit" aria-label="menu" onClick={this.openMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Cure
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    openMenu() {
        this.refs.navdrawerMain.open();
    }

}

export default NavbarComponent;