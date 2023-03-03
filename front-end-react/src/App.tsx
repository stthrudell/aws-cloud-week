import './App.css';
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { ChatClient } from './chat-client';

const App = () => {
  return (
    <ChakraProvider>
      <ChatClient />;
    </ChakraProvider>
  )
}

export default App;
