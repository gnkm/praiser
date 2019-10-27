import createReducer from './create-reducer'
import { Todo, Todos } from '../domain/entities'

export const SET = 'todo/set' as const
export const ADD = 'todo/add' as const
export const UPDATE = 'todo/update' as const
export const REMOVE = 'todo/remove' as const
export const TOGGLE = 'todo/toggle' as const

type Types = typeof SET | typeof ADD | typeof UPDATE | typeof REMOVE | typeof TOGGLE

export const createInitialState = () => ({} as Todos.Entity)
export type State = ReturnType<typeof createInitialState>

export const set = (todos: Todos.Entity) => ({
  type: SET,
  payload: {
    todos,
  },
})

export const add = (todo: Todo.Entity) => ({
  type: ADD,
  payload: {
    todo,
  },
})

export const update = (id: string, todo: Todo.Values) => ({
  type: UPDATE,
  payload: {
    id,
    todo,
  },
})

export const remove = (id: string) => ({
  type: REMOVE,
  payload: {
    id,
  },
})

export const toggle = (id: string) => ({
  type: TOGGLE,
  payload: {
    id,
  },
})

type SetAction = ReturnType<typeof set>
type AddAction = ReturnType<typeof add>
type UpdateAction = ReturnType<typeof update>
type RemoveAction = ReturnType<typeof remove>
type ToggleAction = ReturnType<typeof toggle>
export type Actions = SetAction | AddAction | UpdateAction | RemoveAction | ToggleAction

export default createReducer<State, Types, Actions>(createInitialState(), {
  [SET]: (_state, action) => (action as SetAction).payload.todos,
  [ADD]: (state, action) => Todos.add(state, (action as AddAction).payload.todo),
  [UPDATE]: (state, action) => {
    const { payload } = action as UpdateAction
    return Todos.update(state, payload.id, payload.todo)
  },
  [REMOVE]: (state, action) => Todos.remove(state, (action as RemoveAction).payload.id),
  [TOGGLE]: (state, action) => Todos.toggle(state, (action as ToggleAction).payload.id),
})