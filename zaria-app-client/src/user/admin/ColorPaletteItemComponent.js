import React from 'react';
import classNames from 'classnames';

require('./ColorPalette.css');

class ColorPaletteItemComponent extends React.Component {
    render() {
        let className = classNames(
            'colorpaletteitem-component',
            {
                'colorpaletteitem-component_state_selected': this.props.selected
            },
            {
                'colorpaletteitem-component_state_hovered': this.props.hovered
            }
        );

        return (
            <span
                className={className}
                style={{
                    color: this.props.code,
                    backgroundColor: this.props.code
                }}
                onClick={this.props.onClick}
            />
        );
    }
}


export default ColorPaletteItemComponent;