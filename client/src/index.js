import React from 'react';
import ReactDom from 'react-dom';
 

import App from './App'
import { contextProvider } from './SocketContext';
import './styles.css'

ReactDom.render(
    <contextProvider>
        <App/>
    </contextProvider>
)

ReactDom.render(<App/>,document.getElementById('root'))