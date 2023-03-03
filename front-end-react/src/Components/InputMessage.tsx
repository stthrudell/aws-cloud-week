import React from "react";
import { Button, Icon, Flex, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react"
import { FaPaperPlane } from 'react-icons/fa';
import { useBetween } from 'use-between';

import useSocket from "../Hooks/useSocket"

const useSharedSocket = () => useBetween(useSocket);

export const InputMessage = () => {
  const [message, setMessage] = React.useState("");

  const { isConnected, onSendPublicMessage, onSendPrivateMessage, onSendBotMessage, onConnect } = useSharedSocket()

  const handleSendMessage = (event) => {
    event.preventDefault()
    onSendPublicMessage(message)
    setMessage("")
  }

  return (
    <VStack>
      {!isConnected && <Button onClick={onConnect}>Entrar no chat</Button>}
      <form onSubmit={handleSendMessage} style={{ width: '100%' }}>
        <InputGroup size='md' shadow="lg" borderRadius="md">
          <Input
            pr='4.5rem'
            type='text'
            placeholder='Enviar mensagem...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            isDisabled={!isConnected}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' variant="ghost" type='submit' isDisabled={!message || !isConnected}>
              <Icon as={FaPaperPlane} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      {/* {isConnected &&
        <>
          <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" onClick={onSendBotMessage}>Mensagem para o Bot</Button>
          <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" onClick={onSendPublicMessage}>Mensagem pública</Button>
          <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" onClick={onDisconnect}>Sair</Button>
        </>
      }*/}
    </VStack>
  )
};