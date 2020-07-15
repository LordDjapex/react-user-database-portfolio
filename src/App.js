import React, { Component } from 'react'
import { findRenderedComponentWithType } from 'react-dom/test-utils';

 class App extends Component {

  state = {
    users: [],
    user: {
      name: 'Name',
      surname: 'Surname',
      email: 'email@example.com'
    }
  }
  
  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    fetch('http://localhost:5000/')
    .then(response => response.json())
    .then(response => { this.setState({ users: response.data}) })
    .catch(err => console.log(err))
  }

  removeUser = (id) => {
    fetch('http://localhost:5000/remove?id=' + id)
    .then(this.getUsers)
    .catch(err => console.error(err))
  }


renderUser = ({_id, name, surname, email}) => <div key={_id}>{name} {surname} {email} <button onClick={() => this.removeUser(_id)}>x</button></div>

  addUser = () => {
    const {user} = this.state
    console.log(user)
    fetch(`http://localhost:5000/add?name=${user.name}&surname=${user.surname}&email=${user.email}`)
      .then(this.getUsers)
      .catch(err => console.error(err))
  }



  render() {
    const { users, user } = this.state
    return (
      <>
      <div> 
        <label>Name:</label>
        <input required value={user.name} onChange={e => this.setState({user: {...user, name:e.target.value}})}></input>
        <label>Surname:</label>
        <input value={user.surname} onChange={e => this.setState({user: {...user, surname:e.target.value}})} required></input>
        <label>Email:</label>
        <input type="email" value={user.email} onChange={e => this.setState({user: {...user, email:e.target.value}})} required></input>
        <button onClick={this.addUser} type="submit">Submit</button>
        <form onSubmit={this.addUser}>
        </form>
      </div>
      


      <div>
        {users.map(this.renderUser)}
      </div>
      </>
    )
  }
}

export default App;
