import React from 'react';

export default class Loading extends React.PureComponent {
    render() {
        return (
            <svg width="100" height="15" viewBox="0 0 415 89" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="loading">
                    <rect id="Rectangle 1" width="415" height="89" fill="transparent" />
                    <circle id="dot1" cx="111" cy="44" r="27" fill="skyblue" />
                    <circle id="dot2" cx="208" cy="44" r="27" fill="skyblue" />
                    <circle id="dot3" cx="305" cy="44" r="27" fill="skyblue" />
                </g>
            </svg>
        );
    }
}
