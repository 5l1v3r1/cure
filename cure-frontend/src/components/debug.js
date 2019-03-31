import React, { Component } from 'react';
import { BaseSettingsSection, CheckboxSetting } from './settings/baseSettingsPanel';
import LazyLoadingComponent from './lazy-loading/lazyLoading';

class DebugComponent extends Component {
    render() {
        return (
            <div>
                <BaseSettingsSection name="Debug Settings">
                    <CheckboxSetting 
                        key="debug"
                        name="Stupid checkbox"
                        description="I'm just testing to see how this would look"/>
                    <CheckboxSetting 
                        key="debug"
                        name="Another stupid checkbox thingy"
                        description="I'm just testing to see how this would look"/>
                </BaseSettingsSection>
                <br />
                <br />
                <center>
                    <LazyLoadingComponent height="10%" width="80%" />
                </center>
            </div>
        );
    }
}

export default DebugComponent;