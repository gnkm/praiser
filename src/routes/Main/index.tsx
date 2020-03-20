import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  CHOOSE_LOGIN,
  HOME,
  INITIAL,
  LOADING,
  SIGN_IN,
  SIGN_UP,
  STATISTICS,
  USER_INFO,
  INPUT,
} from '../../constants/path';
import Home from './Home';
import UserInfo from './UserInfo';
import Statistics from './Statistics';
import { ChooseLogin, Initial } from '../../components/pages';
import { Loading, SignIn, SignUp, Input } from '../../containers';
import { headerStyle, headerTintColor } from '../Header';
import * as UiContext from '../../contexts/ui';
import { createStackNavigator, StackCardInterpolationProps } from '@react-navigation/stack';
import { COLOR } from '../../constants/theme';

const Drawer = createDrawerNavigator();
const drawerStyle = {
  backgroundColor: COLOR.MAIN,
};
const drawerContentOptions = {
  activeTintColor: COLOR.PRIMARY,
  inactiveTintColor: COLOR.WHITE,
};
function HomeWithDrawer() {
  return (
    <Drawer.Navigator drawerStyle={drawerStyle} drawerContentOptions={drawerContentOptions} initialRouteName={HOME}>
      <Drawer.Screen name={HOME} component={Home} />
      <Drawer.Screen name={USER_INFO} component={UserInfo} />
    </Drawer.Navigator>
  );
}
function StatisticsWithDrawer() {
  return (
    <Drawer.Navigator
      drawerStyle={drawerStyle}
      drawerContentOptions={drawerContentOptions}
      initialRouteName={STATISTICS}
    >
      <Drawer.Screen name={STATISTICS} component={Statistics} />
      <Drawer.Screen name={USER_INFO} component={UserInfo} />
    </Drawer.Navigator>
  );
}
const cardStyle = {
  backgroundColor: COLOR.MAIN,
};
const getActiveRouteName = (state: any): string => {
  if (!state || !state.routes) {
    return '';
  }
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      initialRouteName={HOME}
      tabBarOptions={{
        inactiveTintColor: COLOR.WHITE,
        activeTintColor: COLOR.PRIMARY,
        style: {
          backgroundColor: COLOR.MAIN,
        },
      }}
      screenOptions={(props: any) => {
        const routeName = getActiveRouteName(props.route.state);
        return {
          tabBarVisible: routeName !== USER_INFO,
        };
      }}
    >
      <Tab.Screen name={HOME} component={HomeWithDrawer} />
      <Tab.Screen name={STATISTICS} component={StatisticsWithDrawer} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function TabWithModalRoutes() {
  return (
    <Stack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        cardStyle,
      }}
      initialRouteName={HOME}
    >
      <Stack.Screen name={HOME} component={TabRoutes} />
      <Stack.Screen name={INPUT} component={Input} />
    </Stack.Navigator>
  );
}

function ChooseLoginNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle,
        headerStyle,
        headerTintColor,
      }}
      initialRouteName={CHOOSE_LOGIN}
    >
      <Stack.Screen name={CHOOSE_LOGIN} component={ChooseLogin} />
      <Stack.Screen name={SIGN_IN} component={SignIn} options={{ title: 'SignIn' }} />
      <Stack.Screen name={SIGN_UP} component={SignUp} options={{ title: 'SignUp' }} />
    </Stack.Navigator>
  );
}

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function switchingAuthStatus(status: UiContext.Status) {
  switch (status) {
    case UiContext.Status.UN_AUTHORIZED:
      return <Stack.Screen name={CHOOSE_LOGIN} component={ChooseLoginNavigator} />;
    case UiContext.Status.AUTHORIZED:
      return <Stack.Screen name={HOME} component={TabWithModalRoutes} />;
    case UiContext.Status.FIRST_OPEN:
    default:
      return <Stack.Screen name={INITIAL} component={Initial} />;
  }
}
function AuthWithRoutes() {
  const uiContext = React.useContext(UiContext.Context);
  return (
    <Stack.Navigator initialRouteName={LOADING} headerMode="none" screenOptions={{ cardStyleInterpolator: forFade }}>
      {uiContext.applicationState !== UiContext.Status.LOADING ? (
        switchingAuthStatus(uiContext.applicationState)
      ) : (
        <Stack.Screen name={LOADING} component={Loading} />
      )}
    </Stack.Navigator>
  );
}

export default AuthWithRoutes;
