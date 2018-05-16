import React, {Component} from 'react';
import $ from 'jquery'

class Secure extends Component {

  constructor(props) {
    super()
    this.state = {
      isUserAuthenticated : false,
      loginTokenMessage: "Unauthorized access"
    }
  }

  componentDidMount() {

    let request = {
        url: 'http://localhost:9000/login',
        method: 'GET'
    };
    $.ajax(request)
        .done((serverToken) => {
            console.log(serverToken)
            this.setState({isUserAuthenticated: (serverToken.status < 400), loginTokenMessage: serverToken.responseText})                        
          })
          .fail((err) => { 
            console.log(err)   
            this.setState({isUserAuthenticated: false, loginTokenMessage: 'Could not request authorization.' + JSON.stringify(err)})
          });
  }

  render() {

    const welcomeMessage = (this.state.isUserAuthenticated) ? "Welcome, " : null;

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

export default Secure;