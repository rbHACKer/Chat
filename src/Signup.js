import React, { Component } from 'react'
import { Link, } from 'react-router-dom';
import './login.css';


export default class Signup extends Component {
   constructor(props){
      super(props)
      this.state = {
         userName: '',
         email: '',
         password: '',
         res: '',
      }
   }


   handleUNameChange=(e)=>{
      this.setState({userName: e.target.value})
   }
   handleEmailChange=(e)=>{
      this.setState({email: e.target.value})
   }
   handlePasswordChange=(e)=>{
      this.setState({password: e.target.value})
   }

   handleSubmit = (e) => {
      e.preventDefault();  

      const url = "http://localhost:8000/app/signup";
      const registered = {
         username: this.state.userName,
         email: this.state.email,
         password: this.state.password
      }
      
      fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(registered)
      })
      .then(res => {
         console.log("Response: ", res);
         if(res.status === 200){    
            window.location.href = "/";        
         }else{
            alert("You might be already registered, try again.");
         }
      })
      .catch(err => console.log("Error",err, registered));


      this.setState({
         userName: '',
         email: '',
         password: '',
      })
   }

   render() {
      return (
        <div className="container">
            <form className="form" onSubmit={this.handleSubmit}>
               <input type="text" placeholder="Username" className="input" value={this.state.userName} onChange={this.handleUNameChange} />
               <input type="email" placeholder="Email" className="input" value={this.state.email} onChange={this.handleEmailChange}/>
               <input type="password" placeholder="Password" className="input" value={this.state.password} onChange={this.handlePasswordChange } />
               <input className="btn" type="submit" value="Signup" />                
            </form>
            
            <p>Have an account? <Link to="/">Login</Link></p>
        </div>
      )
   }
}