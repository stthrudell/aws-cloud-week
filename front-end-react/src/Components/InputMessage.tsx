import React from "react";
import { Button, Icon, Flex, Input, InputGroup, InputRightElement, VStack, AlertDialog, useDisclosure, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Text, HStack } from "@chakra-ui/react"
import { FaPaperPlane } from 'react-icons/fa';
import { useBetween } from 'use-between';

import useSocket from "../Hooks/useSocket"
import { ColorPicker } from "chakra-color-picker";



export const InputMessage = () => {
  const [message, setMessage] = React.useState("");

  const useSharedSocket = () => useBetween(useSocket);
  const { isConnected, onSendPublicMessage, onSendPrivateMessage, onSendBotMessage, onConnect } = useSharedSocket()

  const handleSendMessage = (event) => {
    event.preventDefault()
    onSendPublicMessage(message)
    setMessage("")
  }

  const handleJoinChat = ({ name, nickColor }) => {
    onConnect({ name, nickColor })
  }

  return (
    <VStack>
      {!isConnected && <ModalSetName onConfirm={handleJoinChat} />}
      {/* {!isConnected && <Button onClick={onConnect}>Entrar no chat</Button>} */}

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

const colorsNick = [
  "black",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e74c3c",
  "#273c75",
  "#9c88ff"
]

const ModalSetName = ({ onConfirm }) => {
  const [name, setName] = React.useState('')
  const [nickColor, setNickColor] = React.useState(colorsNick[0])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<any>()

  return (
    <>
      <Button onClick={onOpen}>Entrar no chat</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Entrar no bate papo</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems="flex-start">
              <Text>Para conversar com os participantes, insira seu nome.</Text>
              <HStack w="100%">
                <Input placeholder='Informe seu nome ou apelido' onChange={(e) => setName(e.target.value)} />
                <ColorPicker onChange={setNickColor} placement="left" colors={colorsNick} />
              </HStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme='blue' ml={3} onClick={() => {
              onConfirm({ name, nickColor })
              onClose()
            }} isDisabled={!name}>
              Entrar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}