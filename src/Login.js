import React, { Component } from 'react'
import './login.css';
import {Link} from 'react-router-dom';

export default class Login extends Component {
   constructor(props){
      super(props);
      this.state = {
         email: '',
         password: '',
      }
   }

   login = (e) => {
      e.preventDefault(); 

      const url = "http://localhost:8000/app/login";
      const logined = {
         mail: this.state.email,
         pwd: this.state.password
      }
      
      fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(logined)
      })
      .then(res => {
         console.log("Response: ", res);
         if(res.status === 200){    
            window.location.href = "/chat";     
         }else{
            alert("You might be already registered, try again.");
         }
      })
      .catch(err => console.log("Error",err));


      this.setState({
         email: '',
         password: '',
      })
   }

   render() {
      return (
        <div className="container">
            <form className="form" onSubmit={this.login}>

               <input type="email" placeholder="Email" className="input" value={this.state.email} onChange={(e)=> this.setState({email: e.target.value})} />
               <input type="password" placeholder="Password" className="input" value={this.state.password} onChange={(e)=> this.setState({password: e.target.value})} />
               <input className="btn" type="submit" value="Login" />                
            </form>
            <p>New user? <Link to="/signup">Signup</Link></p>
        </div>
      )
   }
}
