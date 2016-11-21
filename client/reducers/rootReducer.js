export default function (state={foo: 'bar'}, action) {
  switch(action.type) {
    case "FOO": {
      return {init: true}
    }
    default: return state
  }

}