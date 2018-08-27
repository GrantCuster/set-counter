import * as queryString from 'qs'

export let default_state = {
  c: [{ to: 10 }, { to: 10, sc: 10 }],
  sp: 's',
  cv: 1,
  cr: 1,
  sv: 0.5,
  sr: 1.25,
  rl: 'y',
}
export let default_state_string = queryString.stringify(default_state, {
  encode: false,
})

export let valid_state_keys = Object.entries(default_state).map(
  array => array[0]
)

// Adapted from https://stackoverflow.com/a/38750895
export function filterState(state_object) {
  return Object.keys(state_object)
    .filter(key => valid_state_keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = state_object[key]
      return obj
    }, {})
}
