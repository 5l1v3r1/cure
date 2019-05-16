import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LogoutIcon from '@material-ui/icons/Lock'
import { Redirect } from 'react-router-dom';
import localization from '../util/localization';
import { withRouter } from 'react-router-dom';


class NavdrawerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.isActiveDirectory = this.isActiveDirectory.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.open = this.open.bind(this);
        this.redirect = this.redirectToPath.bind(this);
        
    }

    render() {
        
        return (
            <div>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <List>
                        <ListItem button onClick={() => this.redirectToPath("/dashboard")}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {localization.getLocaleString("NAVBAR_DASHBOARD")}
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => this.redirectToPath("/logout")}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {localization.getLocaleString("NAVBAR_LOGOUT")}
                            </ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }

    isActiveDirectory(pathname) {
        return window.location.pathname === pathname;
    }

    open() {
        this.setState({
            open: true
        })
    }

    closeDrawer() {
        this.setState({
            open: false
        })
    }

    redirectToPath(path) {
        // TODO use react-router-dom
        window.location.pathname = path;
    }

}

export default NavdrawerComponent;