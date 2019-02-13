import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LogoutIcon from '@material-ui/icons/Lock'
import { Redirect } from 'react-router-dom';
import localization from '../util/localization';


class NavdrawerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            shouldRedirect: false,
            redirectTo: "/"
        }
        this.isActiveDirectory = this.isActiveDirectory.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.open = this.open.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    render() {
        if (this.state.shouldRedirect) {
            return (
                <Redirect to={this.state.redirectTo}></Redirect>
            )
        }
        
        return (
            <div>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <List>
                        <ListItem button onClick={() => this.redirect("/dashboard")}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {localization.getLocaleString("NAVBAR_DASHBOARD")}
                            </ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => this.redirect("/logout")}>
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

    redirect(path) {
        if (this.isActiveDirectory(path))
            return;
        this.setState({
            open: false,
            shouldRedirect: true,
            redirectTo: path
        });
    }

}

export default NavdrawerComponent;