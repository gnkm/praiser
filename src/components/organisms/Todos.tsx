import * as React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import Todo from '../molecules/Todo'
import { Actions as TodoActions, State as TodoState } from '../../lib/useToggle'
import { COLOR } from '../../constants/theme'
import useToggle from '../../lib/useToggle'

export type Actions = TodoActions
export type State = TodoState[]
type OnPress = (
  params: {
    forbiddenEdit: boolean
  } & TodoState,
) => void
interface Props {
  todos: State
  actions: Actions
  forbiddenEdit: boolean
  useToggle: typeof useToggle
  onPress: OnPress
}
interface ItemProps {
  state: TodoState
  actions: Actions
  onPress: OnPress
  useToggle: typeof useToggle
  forbiddenEdit: boolean
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  separator: {
    height: 1,
    backgroundColor: COLOR.SECONDARY,
  },
})

function Item(props: ItemProps) {
  const { state, actions, onPress, useToggle, forbiddenEdit } = props
  const { toggleTodo, rowRef, removeTodo } = useToggle({
    state,
    actions,
    forbiddenEdit,
  })
  return (
    <Todo
      state={state}
      onDone={toggleTodo}
      onDelete={removeTodo}
      rowRef={rowRef}
      forbiddenEdit={false}
      onPress={onPress}
    />
  )
}

export default function Todos(props: Props) {
  const { todos, onPress, useToggle, actions, forbiddenEdit } = props

  return (
    <FlatList
      style={styles.container}
      data={todos}
      renderItem={({ item }) => (
        <Item state={item} actions={actions} forbiddenEdit={forbiddenEdit} onPress={onPress} useToggle={useToggle} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={item => item.id}
    />
  )
}
