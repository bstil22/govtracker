import React from 'react';
import Hello from './Hello';
import World from './World';

export default class App extends React.Component {
  render () {
    return (
     <div>
       <Hello/>
       <World/>
     </div>
    );
  }
}