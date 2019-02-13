import React, { Component } from 'react';
import { Card, CardContent } from '@material-ui/core';

class BaseSettingsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            visible: props.visible
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default BaseSettingsPanel;