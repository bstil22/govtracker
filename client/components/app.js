import React from 'react';
import Hello from './hello';
import World from './world';

export default class App extends React.Component {
  render () {
   return (
     <div>
       <Hello/>
       <World/>
     </div>
   )
  }
}