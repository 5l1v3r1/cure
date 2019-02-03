import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import { Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


class NavbarComponent extends Component {

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar className="navbar-header">
                        <IconButton color="inherit" aria-label="menu">
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

}

export default NavbarComponent;