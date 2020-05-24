import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import ScanHome from '../Main/ScanHome';
import DrawerContent from './DrawerContent';
import ExposuresHistory from '../Main/ExposuresHistory/ExposuresHistory';
import ExposuresHistoryEdit from '../Main/ExposuresHistory/ExposuresHistoryEdit';
import ExposureHistoryRelief from '../Main/ExposuresHistory/ExposureHistoryRelief';
import ExposureDetected from '../Main/ExposuresDetected';
import ExposureInstructions from '../Main/ExposureInstructions';
import ExposureRelief from '../Main/ExposureRelief';
import ChangeLanguageScreen from '../ChangeLanguage/ChangeLanguageScreen';
import LocationHistory from '../Main/LocationHistory/LocationHistory';
import FilterDriving from '../Main/FilterDriving/FilterDriving';
import BluetoothModal from '../Main/BluetoothModal';
import ShareLocations from '../ShareLocations/ShareLocations';
import { LocaleReducer, ExposuresReducer, Store, Exposure } from '../../types';
import MapModal from '../Main/MapModal';
import { INIT_ROUTE_NAME, USER_AGREE_BLE } from '../../constants/Constants';


const Stack = createStackNavigator();

const DEFAULT_SCREEN = 'ScanHome';

const DrawerStack = ({ navigation }) => {
  const { exposures } = useSelector<Store, ExposuresReducer>(state => state.exposures);
  const [initialRouteName, setInitialRouteName] = useState('');
  const [showBLEPermission, setBLEPermission] = useState(undefined)

  useEffect(() => {
    AsyncStorage.getItem(INIT_ROUTE_NAME)
      .then(initRouteString => setInitialRouteName(initRouteString ?? DEFAULT_SCREEN))
      .catch(() => setInitialRouteName(DEFAULT_SCREEN));
  }, []);

  useEffect(() => {
    if (exposures.some((exposure: Exposure) => exposure.properties.wasThere === null && initialRouteName !== '')) {
      navigation.navigate('ExposureDetected');
    }
    // if (initialRouteName !== '' && showBLEPermission === undefined) {
    //   AsyncStorage.getItem(USER_AGREE_BLE).then((res) => {
    //     setBLEPermission(res)
    //     if (res !== 'true' && res !== 'shown') {
    //       navigation.navigate('Bluetooth')
    //       AsyncStorage.setItem(USER_AGREE_BLE, 'shown')
    //     }
    //   })
    // }
  }, [exposures, initialRouteName]);

  if (!initialRouteName) return null;

  return (
    <Stack.Navigator mode="modal" headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="ScanHome" component={ScanHome} options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid }} initialParams={{ showBleInfo: showBLEPermission !== 'true' }} />
      <Stack.Screen name="ExposuresHistory" component={ExposuresHistory} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="LocationHistory" component={LocationHistory} options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid }} />
      <Stack.Screen name="FilterDriving" component={FilterDriving} options={{ cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid }} />
      <Stack.Screen name="ShareLocations" component={ShareLocations} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="ChangeLanguageScreen" component={ChangeLanguageScreen} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="ExposureDetected" component={ExposureDetected} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="ExposureInstructions" component={ExposureInstructions} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} initialParams={{ showEdit: false }} />
      <Stack.Screen name="ExposureRelief" component={ExposureRelief} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="ExposuresHistoryEdit" component={ExposuresHistoryEdit} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="ExposureHistoryRelief" component={ExposureHistoryRelief} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name="Bluetooth" component={BluetoothModal} options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const Home = () => {
  const { isRTL } = useSelector<Store, LocaleReducer>(state => state.locale);

  return (
    <>
      <Drawer.Navigator
        drawerType="back"
        screenOptions={{ gestureEnabled: false }}
        drawerContent={props => <DrawerContent {...props} />}
        drawerPosition={isRTL ? 'right' : 'left'}
        drawerStyle={{
          width: '100%'
        }}
      >
        <Drawer.Screen name="DrawerStack" component={DrawerStack} />
      </Drawer.Navigator>

      <MapModal />
    </>
  );
};

export default Home;
