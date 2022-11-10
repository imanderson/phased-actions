import PhaseTypes from './PhaseTypes'

// TODO: Use reselect to improve performance

const throwOnInvalidState = state => {
  if (typeof state !== 'object' || typeof state.phasedActions !== 'object') {
    throw new Error(
      `Your state doesn't seem to implement the createPhasedActions' reducer`
    )
  }
}

const checkInSubstate = (state, action, id) => {
  let exists = false

  if (
    typeof id !== 'undefined' &&
    Object.prototype.hasOwnProperty.call(state, action.actionName)
  ) {
    exists = Object.prototype.hasOwnProperty.call(state[action.actionName], id)
  } else {
    exists = Object.prototype.hasOwnProperty.call(state, action.actionName)
  }

  return exists
}

const getInSubstate = (state, action, id) => {
  let value

  if (Object.prototype.hasOwnProperty.call(state, action.actionName)) {
    if (typeof id !== 'undefined') {
      value = state[action.actionName][id]
    } else {
      value = state[action.actionName][action.actionName]
    }
  }

  return value
}

const actionInProgress = (state, action, id) => {
  throwOnInvalidState(state)

  return checkInSubstate(state.phasedActions.inProgress, action, id)
}

const actionSucceeded = (state, action, id) => {
  throwOnInvalidState(state)

  return checkInSubstate(state.phasedActions.succeeded, action, id)
}

const actionFailed = (state, action, id) => {
  throwOnInvalidState(state)

  return checkInSubstate(state.phasedActions.failed, action, id)
}

const actionIsComplete = (state, action, id) => {
  throwOnInvalidState(state)

  return (
    checkInSubstate(state.phasedActions.succeeded, action, id) !== false &&
    checkInSubstate(state.phasedActions.failed, action, id) !== false
  )
}

const getErrorMessage = (state, action, id) => {
  throwOnInvalidState(state)

  return getInSubstate(state.phasedActions.failed, action, id)
}

const getAllErrorMessages = (state, action) => {
  return getInSubstate(state.phasedActions.failed, action)
}

const getStatus = (state, action, id) => {
  let status = PhaseTypes.CLEAR

  if (actionInProgress(state, action, id)) {
    status = PhaseTypes.START
  } else if (actionSucceeded(state, action, id)) {
    status = PhaseTypes.SUCCESS
  } else if (actionFailed(state, action, id)) {
    status = PhaseTypes.ERROR
  }

  return status
}

export {
  actionInProgress,
  actionIsComplete,
  actionSucceeded,
  actionFailed,
  getErrorMessage,
  getAllErrorMessages,
  getStatus
}
