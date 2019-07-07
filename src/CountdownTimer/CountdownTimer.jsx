import React, { Component } from "react"
import moment from "moment"
import styled from "styled-components"
/*
    Display a timer countdown. It requires however Moment.js to use. At the end of the countdown 
    it fires a function. 

    Takes Epoch as a prop.

*/
class CountdownTimer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      functionFired: false,
    }
    this.onTimerComplete = this.onTimerComplete.bind(this)
  }
  componentDidMount() {
    const timeFormat="MM DD YYYY, h:mm a"
    const timeTillDate = moment.unix(this.props.EpochStartTime).format(timeFormat)
    
    
    var now = moment(new Date(), timeFormat)
    const then = moment(timeTillDate, timeFormat)
    if(then.diff(now, "seconds")>0){
        this.interval = setInterval(() => {
          
           
             now = moment(new Date(), timeFormat)
           
            // const dateDiff = b.diff(a, 'days');
      
            const countdown = moment(then - now)
            // Set the days
            const days = then.diff(now, "days")
      
            const hours = moment.duration(then.diff(now)).hours()
            const minutes = moment.duration(then.diff(now)).minutes()
            const seconds = countdown.format("ss")
           // console.log("diff", moment.duration(then.diff(now)))
            if (then.diff(now, "seconds") === 0) {
              if (this.state.functionFired !== true) {
                this.onTimerComplete()
                if (this.interval) {
                  clearInterval(this.interval)
                }
              }
            }
            // If we are out of time then we call this function
      
            this.setState({ days, hours, minutes, seconds })
          }, 1000)

    }else{
        const days = 0
        const hours =0
        const minutes =0
        const seconds = 0
        this.setState({ days, hours, minutes, seconds },
            function(){
                this.onTimerComplete()
            }
            )
       
    }
    
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
  onTimerComplete = function() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Out of time!!")
      }
   
    this.setState({
      functionFired: true,
    })
  }
  

  render() {
    const { days, hours, minutes, seconds } = this.state
    // Mapping the date values to radius values
    const daysRadius = mapNumber(days, 30, 0, 0, 360)
    const hoursRadius = mapNumber(hours, 24, 0, 0, 360)
    const minutesRadius = mapNumber(minutes, 60, 0, 0, 360)
    const secondsRadius = mapNumber(seconds, 60, 0, 0, 360)
   
    try {
      return (
        <Wrapper>
          <CountDownWrapper>
            {hours && (
              <CountdownItem>
              
                {hours}
                <TimeUnit>hours</TimeUnit>
              </CountdownItem>
            )}
            {minutes && (
              <CountdownItem>
                
                {minutes}
                <TimeUnit>minutes</TimeUnit>
              </CountdownItem>
            )}
            {seconds && (
              <CountdownItem>
              
                {seconds}
                <TimeUnit>seconds</TimeUnit>
              </CountdownItem>
            )}
          </CountDownWrapper>
        </Wrapper>
      )
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
const SVGCircle = ({ radius }) => (
  <CountDownSVG>
    <path
      fill="none"
      stroke="#333"
      strokeWidth="4"
      d={describeArc(50, 50, 48, 0, radius)}
    />
  </CountDownSVG>
)

// From StackOverflow: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle)
  var end = polarToCartesian(x, y, radius, startAngle)

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ")

  return d
}

// From StackOverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function mapNumber(number, in_min, in_max, out_min, out_max) {
  return ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

// Here is our CSS / Styled Components
const CountdownItem = styled.div`
  color: #111;
  font-size: 20pt;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  line-height: 1em;
  margin: 2px;
  padding-top: 10px;
  position: relative;
  width: 40px;
  height: 100px;
`
const CountDownWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const TimeUnit = styled.span`
  color: #333;
  font-size: 6pt;
  font-weight: 600;
  text-transform: uppercase;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`

const CountDownSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
`

export default CountdownTimer
