import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const CoolTitle = styled.h1`
    color: blue
`;

@observer
export default class App extends Component {
    render() {
        return <CoolTitle>This is a cool title</CoolTitle>;
    }
}
