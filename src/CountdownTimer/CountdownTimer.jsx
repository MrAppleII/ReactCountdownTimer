import React, { Component } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import styled, { keyframes } from "styled-components"
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
    try {
      if (this.props.EpochStartTime !== -1) {
        const timeFormat = "MM DD YYYY, h:mm a"
        var timeTillDate = moment.unix(this.props.EpochStartTime)
        // now lets make it UTC and add 24 hours.
        timeTillDate = moment.utc(timeTillDate, timeFormat).add(1, "day")

        console.log(timeTillDate)
        var now = moment.utc(new Date(), timeFormat)
        console.log("now", now)
        const then = timeTillDate
        if (then.diff(now, "seconds") > 0) {
          this.interval = setInterval(() => {
            now = moment.utc(new Date(), timeFormat)

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
        } else {
          const days = 0
          const hours = 0
          const minutes = 0
          const seconds = 0
          this.setState({ days, hours, minutes, seconds }, function() {
            this.onTimerComplete()
          })
        }
      } else {
        const days = -1
        const hours = -1
        const minutes = -1
        const seconds = -1
        this.setState({ days, hours, minutes, seconds })
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          console.log(
            "Epoch was not set correctly. Epoch:",
            this.props.EpochStartTime
          )
        }
      }
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
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
    try {
      return hours > 0 || minutes > 0 || seconds > 0 ? (
        <Wrapper className="fadeIn">
          <CountDownWrapper>
            <CountdownItem>
              {hours}
              <TimeUnit>hours</TimeUnit>
            </CountdownItem>
            <Separator>:</Separator>

            <CountdownItem>
              {minutes}
              <TimeUnit>minutes</TimeUnit>
            </CountdownItem>
            <Separator>:</Separator>
            <CountdownItem>
              {seconds}
              <TimeUnit>seconds</TimeUnit>
            </CountdownItem>
          </CountDownWrapper>
        </Wrapper>
      ) : hours !== undefined ? (
        <Wrapper>
          <CountDownWrapper>
            <ExpiredText>Expired</ExpiredText>
          </CountDownWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <CountDownWrapper>
            <LoadingText>Loading...</LoadingText>
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
const FadeIn = keyframes`
from{
    opacity:0;
}
to{
    opacity:1;
}
`

const CountdownItem = styled.div`
  color: #111;
  font-size: 20pt;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-around;
  flex-direction: column;
  line-height: 1em;
  margin: 0px 2px;
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
  position: relative;
`
const ExpiredText = styled.span`
  color: #333;
  font-size: 16pt;
  font-weight: 400;
  text-transform: uppercase;
  font-family: system, -apple-system, BlinkMacSystemFont,
      "Helvetica Neue", "Lucida Grande";
`
const LoadingText = styled.p`
  visibility: hidden;
`
const Separator = styled.p`
  font-family: system, -apple-system, BlinkMacSystemFont,
      "Helvetica Neue", "Lucida Grande";
  line-height: 1em;
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
  height: 50px;
  &.fadeIn {
    animation: ${FadeIn} 0.25s;
  }
  font-family: system, -apple-system, BlinkMacSystemFont,
      "Helvetica Neue", "Lucida Grande";
`

const CountDownSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
`
CountdownTimer.propTypes = {
  EpochStartTime: PropTypes.number.isRequired,
}
CountdownTimer.defaultProps = {
  EpochStartTime: -1,
}

export default CountdownTimer
