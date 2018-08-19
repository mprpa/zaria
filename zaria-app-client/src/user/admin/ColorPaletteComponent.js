import React from 'react';
import ColorPaletteItemComponent from './ColorPaletteItemComponent';

require('./ColorPalette.css');

class ColorPaletteComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="colorpalette-component">
                <div className="color-palette">
                    {this.props.colors.map(color => {
                        return (
                            <ColorPaletteItemComponent
                                key={color.id}
                                code={color.code}
                                selected={color.selected}
                                hovered={color.hovered}
                                onClick={this.props.onColorClick.bind(this, color.id)}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default ColorPaletteComponent;