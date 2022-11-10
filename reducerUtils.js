const getKeyFromAction = (action, id) => {
  const {
    payload,
    meta: { actionName }
  } = action

  const internId = typeof id === 'undefined' ? payload?.id : id

  return internId !== undefined ? internId : actionName
}

const addActionTo = (state, action, valueCreatorFn = () => true) => {
  const {
    meta: { actionName }
  } = action

  const newState = { ...state }
  const actionKey = getKeyFromAction(action)

  const prevActionOrEmpty = Object.prototype.hasOwnProperty.call(
    newState,
    actionName
  )
    ? newState[actionName]
    : {}

  prevActionOrEmpty[actionKey] = valueCreatorFn(action)

  newState[actionName] = prevActionOrEmpty

  return newState
}

const removeActionFrom = (state, action, id) => {
  const {
    meta: { actionName }
  } = action

  if (Object.prototype.hasOwnProperty.call(state, actionName)) {
    const newState = { ...state }

    const prevActionMap = newState[actionName]

    const actionKey = getKeyFromAction(action, id)

    delete prevActionMap[actionKey]

    // TODO: check if this is necessary or a waste
    if (Object.keys(prevActionMap).length === 0) {
      delete newState[actionName]
    }

    return newState
  }

  return state
}

export { addActionTo, removeActionFrom }
