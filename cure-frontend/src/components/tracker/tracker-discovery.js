import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions, Snackbar, Container } from '@material-ui/core';
import auth from '../../util/auth';
import api from '../../util/api';
import TrackerUtil from '../../util/tracker';
import LazyLoadingComponent from '../lazy-loading/lazyLoading';
import localization from '../../util/localization';
import Tracker from '../../type/tracker';

class TrackerDiscoveryPreviewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracker: props.tracker,
            joinedSnackbarActive: false,
            erroredSnackbarActive: false,
            redirectToTracker: false
        }
        this.joinBoard = this.joinBoard.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.viewTracker = this.viewTracker.bind(this);
    }

    render() {
        if (!this.state.tracker) {
            return (<div></div>);
        }
        if (this.state.redirectToTracker) {
            return (
                <div>
                    <Redirect to={`/trackers/${this.state.tracker.trackerId}`} />
                </div>
            )
        }
        return (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        {this.state.tracker.getName()}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.state.tracker.getDescription()}
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        {(this.state.tracker.hasJoined() ? 
                            (<div>
                                <Button color="primary" onClick={this.viewTracker}>View Tracker</Button>
                                <Button color="primary">Leave Tracker</Button>
                            </div>) :
                            (<Button color="primary" onClick={this.joinBoard}>Join Tracker</Button>))}
                    </ExpansionPanelActions>
                </ExpansionPanel>
                <Snackbar
                    open={this.state.joinedSnackbarActive}
                    onClose={this.closeSnackbar}
                    message={`Joined ${this.state.tracker.getName()}.`}
                    />
                <Snackbar
                    open={this.state.erroredSnackbarActive}
                    onClose={this.closeSnackbar}
                    message={`Failed to join ${this.state.tracker.getName()}. Try again later.`}
                    />
            </div>
        )
    }

    joinBoard() {
        auth.postWithAuthentication(api.endpoints.TRACKERS_JOIN({
            trackerId: this.state.tracker.trackerId
        }), {}, {}, (data) => {
            if (data.error) {
                this.setState({
                    erroredSnackbarActive: true 
                })
            }
            this.state.tracker.joined = true;
            this.setState({
                joinedSnackbarActive: true,
                erroredSnackbarActive: false
            })
        })
    }

    closeSnackbar() {
        this.setState({
            joinedSnackbarActive: false,
            errorSnackbarActive: false
        })
    }

    viewTracker() {
        this.setState({
            redirectToTracker: true
        })
    }
}

class TrackerListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            errored: false,
            trackers: []
        }
    }

    componentDidMount() {
        TrackerUtil.fetchTrackers(() => {
            if (!TrackerUtil.trackers) {
                this.setState({
                    loading: false,
                    errored: true,
                    trackers: null
                })
                return;
            }
            this.setState({
                loading: false,
                errored: false,
                trackers: TrackerUtil.getAllTrackers()
            })
        })
    }
    
    render() {
        if (this.state.loading) {
            return (<div></div>)
        }
        if (this.state.errored) {
            return (<div>Whoops, an error occurred!</div>)
        }
        return (
            <div>
                {this.state.trackers.map((tracker) => (
                    <TrackerDiscoveryPreviewComponent tracker={tracker} key={tracker.getTrackerId()}></TrackerDiscoveryPreviewComponent>
                ))}
            </div>
        );
    }

}

class TrackerDiscovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldShowCreateTracker: false,
            trackerAlertOpen: false,
            trackerInviteOnlyCheckboxChecked: false,
            trackerPublicCheckboxChecked: false,
            trackerCreatingTracker: false,
            loaded: false
        }
        this.createTracker = this.createTracker.bind(this);
        this.toggleCreateTrackerDialog = this.toggleCreateTrackerDialog.bind(this);
        this.togglePublic = this.togglePublic.bind(this);
        this.toggleInviteOnly = this.toggleInviteOnly.bind(this);
    }

    toggleCreateTrackerDialog() {
        this.setState({
            trackerAlertOpen: !this.state.trackerAlertOpen
        })
    }
    
    doNothing() {
        // a super complex function that does absolutely nothing!
    }

    render() {
        if (this.state.redirectToLogin) {
            return (
                <Redirect to="/login"></Redirect>
            )
        }
        if (!this.state.loaded) {
            return (
                <div>
                    <LazyLoadingComponent width="100" height="200" />
                </div>
            );
        }
        return (
            <div>
                <Container fixed>
                    <h1>{localization.getLocaleString("TRACKERS_HEADER")}</h1>
                    <p>{localization.getLocaleString("TRACKERS_HELP_TEXT")}</p>
                    <br />
                    {this.state.shouldShowCreateTracker && (
                        <Button variant="contained" color="primary" onClick={this.toggleCreateTrackerDialog}>
                            {localization.getLocaleString("TRACKERS_CREATE_TRACKER")}
                        </Button>
                    )}
                    <Dialog
                        open={this.state.trackerAlertOpen}
                        onClose={this.state.trackerCreatingTracker ? this.doNothing : this.state.toggleCreateTrackerDialog}
                        width="200"
                    >
                        <DialogTitle>{localization.getLocaleString("TRACKERS_CREATE_TRACKER")}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {localization.getLocaleString("TRACKERS_CREATE_TRACKER_HELP_TEXT")}
                            </DialogContentText>
                            <TextField
                                required
                                id="create-tracker-name"
                                label={localization.getLocaleString("TRACKERS_TRACKER_NAME")}
                                margin="normal"
                                style={{width: "400px"}}></TextField>
                            <br />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.trackerInviteOnlyCheckboxChecked}
                                        onChange={this.toggleInviteOnly}
                                        />
                                }
                                label={localization.getLocaleString("TRACKERS_INVITE_ONLY")}></FormControlLabel>
                            <br />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.trackerPublicCheckboxChecked}
                                        onChange={this.togglePublic}
                                        />
                                }
                                label={localization.getLocaleString("TRACKERS_PUBLIC")}></FormControlLabel>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.state.trackerCreatingTracker ? this.doNothing : this.toggleCreateTrackerDialog} color="primary">
                                {localization.getLocaleString("COMMON_CANCEL")}
                            </Button>
                            <Button onClick={this.state.trackerCreatingTracker ? this.doNothing : this.createTracker} color="primary">
                                {localization.getLocaleString("TRACKERS_CREATE_TRACKER")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <br />
                    <br />
                    <TrackerListComponent></TrackerListComponent>
                </Container>
            </div>
        );
    }

    toggleInviteOnly() {
        this.setState({
            trackerInviteOnlyCheckboxChecked: !this.state.trackerInviteOnlyCheckboxChecked
        })
    }

    togglePublic() {
        this.setState({
            trackerPublicCheckboxChecked: !this.state.trackerPublicCheckboxChecked
        })
    }

    createTracker() {
        var name = document.getElementById("create-tracker-name").value;
        var inviteOnly = this.state.trackerInviteOnlyCheckboxChecked;
        var trackerPublic = this.state.trackerPublicCheckboxChecked;
        auth.postWithAuthentication(api.endpoints.TRACKERS_ADD, {
            name: name,
            invite_only: inviteOnly,
            public: trackerPublic
        }, {}, (data) => {
            document.getElementById("create-tracker-name").value = "";
            this.setState({
                trackerInviteOnlyCheckboxChecked: false,
                trackerPublicCheckboxChecked: false,
                trackerAlertOpen: false
            })
        })
    }

    componentDidMount() {
        auth.checkCurrentSession((loggedIn) => {
            if (!loggedIn) {
                this.setState({
                    redirectToLogin: true
                })
                return;
            }
            // queue authentication.
            auth.getCurrentUser((user) => {
                if (!user) {
                    this.setState({
                        redirectToLogin: true
                    })
                    return;
                }
                this.setState({
                    shouldShowCreateTracker: user.isGlobalAdmin(),
                    loaded: true
                })
            }, true)
        })
    }
}

export default TrackerDiscovery;