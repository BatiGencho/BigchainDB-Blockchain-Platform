import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Sidebar from 'components/Sidebar/Sidebar';
import Footer from 'components/Footer/Footer'
import appRoutes from 'routes/app.jsx';

class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount(){

    }
    componentDidUpdate(e){
        if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }
    render() {
        return (
        <div className="wrapper">
            <Sidebar {...this.props} />
            <div id="main-panel" className="main-panel">
                    <Switch>
                        {
                            appRoutes.map((prop,key) => {
                                if(prop.redirect) {
                                    return (
                                        <Redirect from={prop.path} to={prop.to} key={key}/>
                                    );
                                }
                                return (
                                    <Route path={prop.path} component={prop.component} key={key}/>
                                );
                            })
                        }
                    </Switch>
            </div>
        </div>
        );
    }
}

export default App;
