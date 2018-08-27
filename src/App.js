import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import * as queryString from 'qs'
import { default_state, default_state_string, filterState } from './State'
import StateNumberInput from './StateNumberInput'
import StateAddCounter from './StateAddCounter'
import StateDeleteCounter from './StateDeleteCounter'
import StateDeleteSubCounter from './StateDeleteSubCounter'
import StateAddSubCounter from './StateAddSubCounter'
import StateRange from './StateRange'
import { languages } from './Constants'
import StateCheckbox from './StateCheckbox'
import StateSelector from './StateSelector'

let default_readout = 'Click button below to start count'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storage_buster: 0,
      ww: window.innerWidth,
      readout: default_readout,
      pause: false,
    }
  }

  componentDidMount() {
    let dirty_url_state = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    })
    let dirty_url_state_string = queryString.stringify(dirty_url_state, {
      encode: false,
    })
    let filtered_url_state = filterState(dirty_url_state)
    if (dirty_url_state_string !== default_state_string) {
      let updated_state = Object.assign({}, default_state, filtered_url_state)
      let updated_search = queryString.stringify(updated_state, {
        encode: false,
      })
      this.props.history.replace({
        pathname: process.env.PUBLIC_URL,
        search: updated_search,
      })
    }
    let synth = window.speechSynthesis
    this.setState({ synth: synth })
    window.setTimeout(() => {
      let voices = synth.getVoices()
      this.setState({ voices })
    }, 0)

    window.addEventListener('resize', this.updateWindowWidth.bind(this))
  }

  updateWindowWidth() {
    this.setState({ ww: window.innerWidth })
  }

  componentWillUnmount() {
    this.state.synth.cancel()
    window.removeEventListener('resize', this.updateWindowWidth.bind(this))
  }

  speak() {
    let me = this
    let url_state = filterState(
      queryString.parse(this.props.location.search, { ignoreQueryPrefix: true })
    )
    // Clear it all out
    this.setState({ pause: false }, () => {
      this.state.synth.resume()
      this.state.synth.cancel()
      let voices = this.state.voices
      if (url_state.c) {
        let { rl, cv, cr, sv, sr } = url_state
        for (let i = 0; i < url_state.c.length; i++) {
          let utterThis = new SpeechSynthesisUtterance(`Round ${i + 1}.`)
          utterThis.onstart = function(e) {
            me.setState({ readout: `Round ${i + 1}` })
          }
          this.state.synth.speak(utterThis)
          let round_voice
          if (rl === 'y' && voices.length > 0) {
            round_voice = voices[Math.floor(Math.random() * voices.length)]
            let round_language = languages[round_voice.lang.slice(0, 2)]
            let utterThis = new SpeechSynthesisUtterance(
              `${round_language} as spoken by`
            )
            utterThis.onstart = function(e) {
              me.setState({
                readout: `${round_language} as spoken by ${round_voice.name}`,
              })
            }
            this.state.synth.speak(utterThis)
            let utterName = new SpeechSynthesisUtterance(`${round_voice.name}`)
            utterName.voice = round_voice
            this.state.synth.speak(utterName)
            let utterStart = new SpeechSynthesisUtterance(`start`)
            this.state.synth.speak(utterStart)
          }
          for (let j = 0; j < url_state.c[i].to; j++) {
            // Speak count
            let utterThis = new SpeechSynthesisUtterance(`${j + 1}.`)
            utterThis.onstart = function(e) {
              window.setTimeout(() => {
                me.setState({ readout: `Round ${i + 1}: Count ${j + 1}` })
              }, 0)
            }
            if (
              i === url_state.c.length - 1 &&
              j === url_state.c[i].to - 1 &&
              url_state.c[i].sc === undefined
            ) {
              utterThis.onend = function(e) {
                me.setState({ readout: default_readout })
              }
            }
            if (rl === 'y' && voices.length > 0) {
              utterThis.voice = round_voice
            }
            utterThis.volume = cv
            utterThis.rate = cr
            this.state.synth.speak(utterThis)
            if (url_state.c[i].sc) {
              let pause = ''
              if (url_state.sp === 's') pause = ','
              if (url_state.sp === 'l') pause = '.'
              let subcounter_string = ''
              for (let k = 0; k < url_state.c[i].sc; k++) {
                subcounter_string += `${k + 1}${pause} `
              }
              // Speak subcount
              let utterThis = new SpeechSynthesisUtterance(subcounter_string)
              utterThis.onstart = function(e) {
                me.setState({ readout: `Round ${i + 1}: Count ${j + 1}` })
              }
              if (i === url_state.c.length - 1 && j === url_state.c[i].to - 1) {
                utterThis.onend = function(e) {
                  me.setState({ readout: default_readout })
                }
              }
              utterThis.volume = sv
              utterThis.rate = sr
              this.state.synth.speak(utterThis)
            }
          }
        }
      }
    })
  }

  cancelSpeech() {
    this.setState({ pause: false, readout: default_readout }, () => {
      this.state.synth.resume()
      this.state.synth.cancel()
    })
  }

  storageBust() {
    let me = this
    setTimeout(() => {
      me.setState({ storage_buster: me.state.storage_buster + 1 })
    }, 0)
  }

  pauseSpeech() {
    console.log('pause')
    this.setState({ pause: true }, () => {
      this.state.synth.pause()
    })
  }

  resumeSpeech() {
    this.setState({ pause: false }, () => {
      this.state.synth.resume()
    })
  }

  render() {
    let me = this
    let url_state = filterState(
      queryString.parse(this.props.location.search, { ignoreQueryPrefix: true })
    )
    return (
      <div
        className="App"
        style={{
          display: 'grid',
          height: '100vh',
          gridTemplateRows: '19px 1fr',
        }}
      >
        <div style={{ borderBottom: 'solid 1px black' }}>SET COUNTER</div>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            height: 'calc(100vh - 19px)',
          }}
        >
          <div
            style={{
              borderBottom: 'solid 1px black',
              padding: '0.5em 0',
            }}
          >
            <div style={{ height: 18, marginBottom: 8 }}>
              {this.state.readout}
            </div>
            <button
              onClick={this.speak.bind(this)}
              style={{ background: 'yellow' }}
            >
              Count it out loud
            </button>{' '}
            {this.state.synth ? (
              this.state.pause ? (
                <button onClick={this.resumeSpeech.bind(this)}>Resume</button>
              ) : (
                <button
                  disabled={this.state.synth.speaking ? false : true}
                  onClick={this.pauseSpeech.bind(this)}
                >
                  Pause
                </button>
              )
            ) : null}
            <button onClick={this.cancelSpeech.bind(this)}>Cancel</button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: this.state.ww > 600 ? '1fr 1fr' : '1fr',
              gridTemplateRows: this.state.ww > 600 ? '1fr' : 'auto 1fr',
            }}
          >
            <div
              style={{
                overflow: 'auto',
                borderBottom: this.state.ww > 600 ? '' : 'solid 1px black',
              }}
            >
              <div>SETTINGS</div>
              <div>COUNTER</div>
              <div>
                <StateCheckbox
                  state_key="rl"
                  label="random language for each counter"
                  url_state={url_state}
                  value={url_state.rl}
                />
              </div>
              <div>
                Counter rate:{' '}
                <StateRange
                  value={url_state.cr}
                  min={0.1}
                  max={4}
                  step={0.1}
                  prop_key="cr"
                />
              </div>
              <div>
                Counter volume:{' '}
                <StateRange
                  value={url_state.cv}
                  min={0.1}
                  max={1}
                  step={0.05}
                  prop_key="cv"
                />
              </div>
              <div>SUBCOUNTER</div>
              <div>
                Subcounter pauses:{' '}
                <StateSelector
                  options={[
                    { label: 'none', value: 'n' },
                    { label: 'short', value: 's' },
                    { label: 'long', value: 'l' },
                  ]}
                  state_key="sp"
                  value={url_state.sp}
                />
                <div>
                  Subcounter rate:{' '}
                  <StateRange
                    value={url_state.sr}
                    min={0.1}
                    max={4}
                    step={0.1}
                    prop_key="sr"
                  />
                </div>
                <div>
                  Subcounter volume:{' '}
                  <StateRange
                    value={url_state.sv}
                    min={0.1}
                    max={1}
                    step={0.05}
                    prop_key="sv"
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                overflow: 'auto',
              }}
            >
              <div>COUNTERS</div>
              <ol>
                {url_state.c
                  ? url_state.c.map((counter, index) => (
                      <li>
                        <div>
                          Count to{' '}
                          <StateNumberInput
                            value={counter.to}
                            update_array_key="c"
                            update_array={url_state.c}
                            update_key="to"
                            update_index={index}
                          />
                          <StateDeleteCounter
                            array_key="c"
                            update_array={url_state.c}
                            update_index={index}
                          />
                          {counter.sc ? null : (
                            <StateAddSubCounter
                              array={url_state.c}
                              array_key="c"
                              update_index={index}
                            />
                          )}
                        </div>
                        {counter.sc ? (
                          <div style={{ marginLeft: '1em' }}>
                            Subcount to{' '}
                            <StateNumberInput
                              value={counter.sc}
                              update_array_key="c"
                              update_array={url_state.c}
                              update_key="sc"
                              update_index={index}
                            />
                            <StateDeleteSubCounter
                              array_key="c"
                              array={url_state.c}
                              update_index={index}
                            />
                          </div>
                        ) : null}
                      </li>
                    ))
                  : null}
              </ol>
              <div>
                <StateAddCounter array={url_state.c} array_key="c" />
              </div>
            </div>
          </div>
          <div style={{ borderTop: 'solid 1px black' }}>
            This is a set counter I (
            <a href="http://feed.grantcuster.com/info" target="_blank">
              Grant
            </a>
            ) made to do a warm up count for{' '}
            <a href="http://www.bkwingtsun.com/" target="_blank">
              Wing Tsun
            </a>
            . You can add counters and subcounters and adjust their speed. In
            class we often do each new set in a different language. I added that
            option here as well--though it does not always work on mobile. All
            the settings are contained in the URL, so if you make a set-up you
            like you can get to it anytime by copying the URL.{' '}
            <a href="http://grantcuster.github.io/set-counter?c[0][to]=10&c[1][to]=10&c[1][sc]=2&c[2][to]=10&c[2][sc]=3&c[3][to]=10&c[3][sc]=4&c[4][to]=10&c[4][sc]=5&c[5][to]=10&c[5][sc]=6&c[6][to]=10&c[7][to]=10&c[7][sc]=7&c[8][to]=10&c[8][sc]=8&c[9][to]=10&c[9][sc]=9&c[10][to]=10&c[10][sc]=10&c[11][to]=10&c[11][sc]=9&c[12][to]=10&c[12][sc]=8&c[13][to]=10&c[13][sc]=7&c[14][to]=10&c[14][sc]=6&c[15][to]=10&c[15][sc]=5&c[16][to]=10&c[16][sc]=4&c[17][to]=10&c[17][sc]=3&c[18][to]=10&c[18][sc]=2&c[19][to]=10&sp=s&cv=1&cr=1&sv=0.5&sr=1.25&rl=y">
              This, for example,
            </a>{' '}
            is the full warm-up set we do.{' '}
            <a
              href="https://github.com/GrantCuster/set-counter"
              target="_blank"
            >
              Code
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(App)
