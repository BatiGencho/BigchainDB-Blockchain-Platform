import React, {Component} from 'react';
import $ from 'jquery'

class Home extends Component {

  constructor(props) {
    super()
    this.state = {
      isUserAuthenticated : false,
      loginTokenMessage: "Unauthorized access"
    }
  }

  componentDidMount() {

    let data = {
        name: 'd91204',
        pass: 'some_pass',
    };

    let request = {
        url: 'http://localhost:9000/login',
        method: 'POST',
        data: data,
        async: true,
        dataType: 'json'
    };
    console.log('Request Sent: ' + JSON.stringify(request))
    $.ajax(request)
        .done((serverToken) => {
          console.log(serverToken)            
          this.setState({isUserAuthenticated: serverToken.isAuthenticated,
                         loginTokenMessage: serverToken.message})
        })
        .fail((err) => { 
          this.setState({isUserAuthenticated: false,
            loginTokenMessage: 'Could not request authorization.' + JSON.stringify(err)})
        });
  }

  render() {

    const welcomeMessage = (this.state.isUserAuthenticated) ? "Welcome to Home" : null;

    return (
      <div className="content">
        <p>{this.state.loginTokenMessage}</p>
        {
          welcomeMessage
        }
      </div>
    )
  }

}

export default Home;