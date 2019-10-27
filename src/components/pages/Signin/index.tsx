import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import * as TodosRepository from '../../../domain/repositories/todos'
import TextField from '../../TextField'
import { Todos } from '../../../domain/entities'
import { HOME } from '../../../constants/path'
import { userContext } from '../../../contexts'
import useTextInput from '../../../lib/hooks/use-TextInput'
import useNetworker from '../../../lib/hooks/use-networker'
import * as LocalStore from '../../../lib/local-store'
import signInWithPasswordToFirebase from '../../../lib/firebase/sign-in-with-password'
import Button from '../../Button'
import SignInWithGoogle from './SignInWithGoogle'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  signInButton: {
    backgroundColor: 'green',
  },
  text: {
    marginVertical: 20,
  },
  button: {
    marginTop: 50,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
})

interface Props {
  actions: {
    setTodos: (todos: Todos.Entity) => void
  }
}

function SignUp(props: Props) {
  const { setUserState } = React.useContext(userContext)
  const { navigate } = useNavigation()
  const networker = useNetworker()
  const mailAddress = useTextInput('')
  const password = useTextInput('')
  const signInWithPassword = React.useCallback(async () => {
    await networker(async () => {
      const userInformation = await signInWithPasswordToFirebase(mailAddress.value, password.value)
      setUserState(userInformation)
      await LocalStore.saveUserInformation(userInformation)
      const todos = await TodosRepository.getAll(userInformation.id)
      props.actions.setTodos(todos)
      navigate(HOME)
    })
  }, [mailAddress.value, password.value])

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <TextField
          label="email"
          value={mailAddress.value}
          onChangeText={mailAddress.onChangeText}
          style={styles.text}
        />
        <TextField label="password" value={password.value} onChangeText={password.onChangeText} style={styles.text} />
      </View>
      <View style={styles.buttonContainer}>
        <SignInWithGoogle {...props} />
        <Button onPress={signInWithPassword} label="SignIn" style={styles.button} />
      </View>
    </View>
  )
}

export default SignUp