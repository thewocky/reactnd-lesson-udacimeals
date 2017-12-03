import React, { Component } from 'react';
import { addRecipe, removeFromCalendar } from '../actions';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calendar: null,
      days:[],
      meals:[],
      day: 'sunday',
      meal: 'breakfast'
    }

    this.handleChangeDay = this.handleChangeDay.bind(this);
    this.handleChangeMeal = this.handleChangeMeal.bind(this);
  }


  componentDidMount () {
    const { store } = this.props
    const daysofWeek = [];
    const meals = [];
    for( let i in store.getState() ) {
      daysofWeek.push( i );
      if( !meals.length ) {
        for( let j in store.getState()[i] ) {
          // console.log( j );
          meals.push( j );
        }
      }
    }
    this.setState({ days: daysofWeek });
    this.setState({ meals: meals });

    // get from store
    store.subscribe(() => {
      this.setState(() => ({
        calendar: store.getState()
      }))
    })
  }
  submitFood = () => {
    this.props.store.dispatch(addRecipe({
      day: this.state.day,
      meal: this.state.meal,
      recipe: {
        label: this.input.value
      },
    }))

    this.input.value = ''
  }
  deleteMeal( day, meal ) {
    this.props.store.dispatch(removeFromCalendar({
      day,
      meal
    }))
  }
  handleChangeDay( event ) {
    const partialState = this.state;
    partialState.day = event.target.value;
    this.setState(partialState);
  }
  handleChangeMeal( event ) {
    const partialState = this.state;
    partialState.meal = event.target.value;
    this.setState(partialState);
  }
  render() {
    return (
      <div>
        <div>
          <select onChange={this.handleChangeDay}>
            { this.state.days.map( (day) => (
              <option
                key={day}
                value={day}
              >{ day }</option>
              )) }
          </select>
        </div>
        <div>
          <select onChange={this.handleChangeMeal}>
            { this.state.meals.map( (meal) => (
              <option
                key={meal}
                value={meal}
              >{ meal }</option>
              )) }
          </select>
        </div>
        <input
          type='text'
          ref={(input) => this.input = input}
          placeholder={`${this.state.day}'s ${this.state.meal}`}
        />
        <button onClick={this.submitFood}>Submit</button>

        <ul>
          { this.state.days.map( (day) => (
            <li key={day}><span style={{fontWeight:'bold'}}>{ day }</span>
            <ul>
              { this.state.meals.map( (meal) => (
                <li key={`${day}-${meal}`}>{ meal }: {this.state.calendar && this.state.calendar[day][meal] && <span>{this.state.calendar[day][meal]}</span>}
                  {this.state.calendar && this.state.calendar[day][meal] && <span className="btn-remove" onClick={this.deleteMeal.bind(this, day, meal)}>x</span>}
                </li>
                )) }
            </ul></li>
            )) }
        </ul>
      </div>
    )
  }
}


export default App;
