import React, { Component } from 'react';
import { Card, CardContent, Divider, FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import Settings from './../../util/settings';

class BaseSettingsSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name.toUpperCase(),
            visible: props.visible
        }
    }

    render() {
        return (
            <div style={{margin: 10}}>
                    <Card>
                        <CardContent>
                            <Typography color="textPrimary" variant="overline">{this.state.name}</Typography>
                            <Divider />
                            {this.props.children}
                        </CardContent>
                    </Card>
            </div>
        );
    }

}

class CheckboxSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: props.key,
            name: props.name,
            description: props.description,
            checked: Settings.getSetting(props.key)
        }
        this.checkbox = React.createRef();
        this.render = this.render.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        return (
            <div>
                <FormControlLabel 
                control={<Checkbox
                    margin="normal"
                    ref={this.checkbox}
                    checked={this.state.checked}
                    onChange={this.onUpdate} />}
                label={this.state.name} />
                <Typography color="textSecondary" variant="caption">{this.state.description}</Typography>
            </div>
        );
    }

    onUpdate() {
        Settings.setSetting(this.key, this.checkbox.checked);
        this.setState({
            checked: this.checkbox.checked
        })
    }
}

export { BaseSettingsSection, CheckboxSetting }