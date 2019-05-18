import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LogoutIcon from '@material-ui/icons/Lock'
import TrackerIcon from '@material-ui/icons/List';
import { Link, withRouter } from 'react-router-dom';
import localization from '../util/localization';


class NavdrawerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.isActiveDirectory = this.isActiveDirectory.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.open = this.open.bind(this);
        this.redirectToPath = this.redirectToPath.bind(this);
        
    }

    render() {
        
        return (
            <div>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <List>
                        <ListItem button component={Link} to="/dashboard" onClick={this.closeDrawer}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {localization.getLocaleString("NAVBAR_DASHBOARD")}
                            </ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/trackers" onClick={this.closeDrawer}>
                            <ListItemIcon>
                                <TrackerIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {localization.getLocaleString("NAVBAR_TRACKERS")}
                            </ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/logout" onClick={this.closeDrawer}>
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