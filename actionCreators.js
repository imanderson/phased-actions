import { createActions } from 'redux-actions'
import PhaseTypes from './PhaseTypes'

const createPhasedAction = type => {
  const actionCreator = phase => [
    payload => payload,
    meta => ({ ...meta, phase, actionName: type })
  ]
  const actionsObject = createActions({
    [type]: {
      [PhaseTypes.START]: actionCreator(PhaseTypes.START),
      [PhaseTypes.SUCCESS]: actionCreator(PhaseTypes.SUCCESS),
      [PhaseTypes.ERROR]: actionCreator(PhaseTypes.ERROR),
      [PhaseTypes.CLEAR]: actionCreator(PhaseTypes.CLEAR)
    }
  })

  const actions = Object.values(actionsObject)[0]

  actions.toString = () => Object.keys(actionsObject)[0]
  actions.actionName = type
  actions.isPhasedAction = true

  const defaultError = actions.error
  actions.error = payload => {
    let generatedAction
    if (payload && payload.error && payload.error instanceof Error) {
      generatedAction = defaultError({
        ...payload,
        errorMessage: payload.error.message
      })
      generatedAction.error = true
    } else {
      generatedAction = defaultError(payload)
    }
    return generatedAction
  }
  actions.error.toString = defaultError.toString

  return actions
}

const createPhasedActions = (...args) => {
  if (!args) return {}

  return args.reduce((accumulator, currentType) => {
    const action = createPhasedAction(currentType)
    return { ...accumulator, [action]: action }
  }, {})
}

export { createPhasedAction, createPhasedActions }
