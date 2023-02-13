import React, { Component } from 'react'

//component
import Item from './component/Item'

//style
import styles from './Style.module.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      food: this.getRandomCell(),
      segments: [this.getRandomCell()],
      speed: {
        x: 1,
        y: 0,
      },
      direction: 'right',
      forbiden_direction: 'left',
      buffered: null,
    }
  }

  getRandomCell() {
    return {
      column: Math.floor(Math.random() * 20),
      row: Math.floor(Math.random() * 20),
    }
  }

  draw() {
    var items = []
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        if (i === this.state.food.row && j === this.state.food.column) {
          items.push(<Item className={styles.food} />)
        }
        items.push(<Item className={styles.item} />)
      }
    }

    for (var k = 0; k < this.state.segments.length; k++) {
      var segment = this.state.segments[k]
      items[segment.row * 20 + segment.column] = (
        <Item className={styles.snack} />
      )
    }

    return items
  }

  setOnBox(cell) {
    if (cell.row < 0) {
      cell.row = 19
    } else if (cell.row > 19) {
      cell.row = 0
    }

    if (cell.column < 0) {
      cell.column = 19
    } else if (cell.column > 19) {
      cell.column = 0
    }

    return cell
  }

  eat() {
    var head = this.state.segments[this.state.segments.length - 1]
    if (
      head.row === this.state.food.row &&
      head.column === this.state.food.column
    ) {
      return true
    }
    return false
  }

  end() {
    var head = this.state.segments[this.state.segments.length - 1]
    for (var z = 0; z < this.state.segments.length - 1; z++) {
      var segment = this.state.segments[z]
      if (segment.row === head.row && segment.column === head.column) {
        return true
      }
      return false
    }
  }

  update() {
    if (this.state.buffered !== null) {
      this.setState(function (state, props) {
        if (state.direction !== state.buffered.direction) {
          state.direction = state.buffered.direction
          state.speed = state.buffered.speed
          state.forbiden_direction = state.buffered.forbiden_direction
        }
        return null
      })
    }
    var segments = this.state.segments
    var head = segments[segments.length - 1]
    var food = this.state.food
    if (this.eat()) {
      segments.push(head)
      food = this.getRandomCell()
    }
    segments.shift()
    segments.push(
      this.setOnBox({
        row: head.row + this.state.speed.y,
        column: head.column + this.state.speed.x,
      }),
    )

    if (this.end()) {
      segments = [segments[segments.length - 1]]
      food = this.getRandomCell()
    }

    this.setState({
      segments: segments,
      food: food,
      buffered: null,
    })
  }

  handleKey = (event) => {
    var direction = this.state.direction
    var forbiden_direction = this.state.forbiden_direction

    switch (event.keyCode) {
      case 37:
        direction = 'left'
        forbiden_direction = 'right'
        break

      case 38:
        direction = 'up'
        forbiden_direction = 'down'
        break

      case 39:
        direction = 'right'
        forbiden_direction = 'left'
        break

      case 40:
        direction = 'down'
        forbiden_direction = 'up'
        break

      default:
    }

    if (
      direction !== this.state.direction &&
      direction !== this.state.forbiden_direction
    ) {
      this.setState(function (state, props) {
        state.buffered = {
          direction: direction,
          speed: {
            x: direction === 'right' ? 1 : direction === 'left' ? -1 : 0,
            y: direction === 'down' ? 1 : direction === 'up' ? -1 : 0,
          },
          forbiden_direction: forbiden_direction,
        }

        return null
      })
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.update()
    }, 300)

    document.addEventListener('keydown', this.handleKey)
  }

  render() {
    return <div className={styles.container}>{this.draw()}</div>
  }
}

export default App
