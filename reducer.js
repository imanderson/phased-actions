import { addActionTo, removeActionFrom } from './reducerUtils'
import PhaseTypes from './PhaseTypes'

const initialState = {
  inProgress: {},
  succeeded: {},
  failed: {}
}

const isValidPhase = ({ meta }) =>
  typeof meta.actionName !== 'undefined' && typeof meta.phase !== 'undefined'

const reducer = (state = initialState, action) => {
  const { meta } = action

  if (
    !meta ||
    !isValidPhase(action) ||
    meta.skipInProgress ||
    meta.skipWithErrors
  ) {
    return state
  }

  const { phase } = meta

  let newInProgress = { ...state.inProgress }
  let newSucceeded = { ...state.succeeded }
  let newFailed = { ...state.failed }

  // This means, this is the initial action
  if (phase === PhaseTypes.START) {
    newInProgress = addActionTo(state.inProgress, action)

    // Clear the action automatically on a new start
    newFailed = removeActionFrom(state.failed, action)
  } else {
    // If the Action phase is not START, then the Action is ending

    // at phase SUCCESS, ERROR or CLEAR, the Action is not anymore in progress, so we remove from "started"
    newInProgress = removeActionFrom(state.inProgress, action)

    if (phase === PhaseTypes.ERROR) {
      newFailed = addActionTo(
        state.failed,
        action,
        currAction => currAction.payload?.errorMessage
      )
    } else if (phase === PhaseTypes.SUCCESS || phase === PhaseTypes.CLEAR) {
      // At phase SUCCESS or CLEAR, the errors are removed from the reducer
      newFailed = removeActionFrom(state.failed, action)

      if (phase === PhaseTypes.SUCCESS) {
        newSucceeded = addActionTo(state.succeeded, action)
      } else if (phase === PhaseTypes.CLEAR) {
        newSucceeded = removeActionFrom(state.succeeded, action)
      }
    }
  }

  return {
    ...state,
    inProgress: newInProgress,
    succeeded: newSucceeded,
    failed: newFailed
  }
}

export default reducer
