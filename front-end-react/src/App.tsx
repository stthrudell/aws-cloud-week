import './App.css';
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { ChatClient } from './Components/ChatClient';

const App = () => {
  return (
    <ChakraProvider>
      <ChatClient />;
    </ChakraProvider>
  )
}

export default App;
