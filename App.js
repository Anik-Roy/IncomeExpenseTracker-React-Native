import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import store from './src/redux/store';
import Main from './src/Main';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PapperProvider} from 'react-native-paper';

const App = () => {
  // console.log("App > store",store);
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <PapperProvider>
          <Main />
        </PapperProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}

export default App;
