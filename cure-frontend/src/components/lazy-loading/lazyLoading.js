import React, { Component } from 'react';

class LazyLoadingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height,
            width: props.width
        }
    }

    render() {
        // We have to include the <br /> or otherwise the content isn't visible.
        return (
            <div>
                <div style={{ width: this.state.width, height: this.state.height, backgroundColor: "#dddddd"}}>
                    <br />
                </div>
            </div>
        )
    }
}

export default LazyLoadingComponent;