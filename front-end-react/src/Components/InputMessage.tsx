import React from "react";
import { Button, Icon, Flex, Input, InputGroup, InputRightElement, VStack, AlertDialog, useDisclosure, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Text, HStack, position, InputLeftElement, Tag, TagLabel, TagRightIcon, CheckboxIcon } from "@chakra-ui/react"
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useBetween } from 'use-between';
import Select, { StylesConfig } from 'react-select';

import useSocket, { IParticipant } from "../Hooks/useSocket"
import { ColorPicker } from "chakra-color-picker";
import { ColourOption, colourOptions } from "./data";

const useSharedSocket = () => useBetween(useSocket);

export const InputMessage = () => {
  const [message, setMessage] = React.useState("");
  const [dropDownUserOpen, setDropDownUserOpen] = React.useState(false);

  const { isConnected, onSendPublicMessage, onConnect, members, actualUserConnected, privateTo, setPrivateTo } = useSharedSocket()
  const inputChatRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleSendMessage = (event) => {
    event.preventDefault()
    console.log(message)
    onSendPublicMessage(message)
    setMessage("")
    inputChatRef.current?.focus()
  }

  const handleJoinChat = ({ name, nickColor }) => {
    onConnect({ name, nickColor })
  }

  const handleSelectPrivateTo = (value) => {
    setPrivateTo({
      name: value.name,
      nickColor: value.nickColor,
      id: value.id
    })
    setDropDownUserOpen(false)
    setMessage("")
    inputChatRef.current?.focus()
  }

  const handleClearPrivateTo = (event) => {
    if (!privateTo || event.key !== 'Escape') return;
    setPrivateTo(null)
  }

  const transformParticipantToSelectOption = React.useCallback((participants: IParticipant[]) => {
    if (!participants) return [];
    return participants.filter(participant => participant?.id !== actualUserConnected?.id).map(participant => ({
      label: participant.name,
      value: participant.name,
      color: participant.nickColor,
      ...participant
    }))
  }, [])

  React.useEffect(() => {
    if (!message) {
      setDropDownUserOpen(false)
      return;
    };
    if (!message.startsWith('/')) return;

    setDropDownUserOpen(true)
    selectRef.current?.focus()
  }, [message])

  React.useEffect(() => {
    selectRef.current?.focus()
  }, [privateTo])

  return (
    <VStack>
      {!isConnected && <ModalSetName onConfirm={handleJoinChat} />}
      {/* {!isConnected && <Button onClick={onConnect}>Entrar no chat</Button>} */}

      <form onSubmit={handleSendMessage} style={{ width: '100%' }}>
        <InputGroup size='md' borderRadius="md" flexDir="column" paddingTop="30px" alignItems="center">
          <Select
            //@ts-ignore
            ref={selectRef}
            defaultValue={transformParticipantToSelectOption(members)[0]}
            isSearchable={true}
            closeMenuOnSelect
            menuPlacement="top"
            menuIsOpen={dropDownUserOpen}
            inputValue={message.replace('/', '')}
            onInputChange={(value) => setMessage(value && `/${value}`)}
            onKeyDown={handleClearPrivateTo}
            onChange={handleSelectPrivateTo}
            options={transformParticipantToSelectOption(members)}
            styles={colourStyles}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
          />
          {privateTo && (
            <Text
              position="absolute"
              background={privateTo.nickColor || 'green'}
              top={0} width="99%"
              padding="5px 10px"
              borderTopRadius="md"
              color="white"
            >
              Enviar mensagem para {privateTo?.name}
            </Text>
          )}
          <Input
            ref={inputChatRef}
            pr='4.5rem'
            type='text'
            placeholder='Enviar mensagem...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleClearPrivateTo}
            isDisabled={!isConnected}
            background="white"
            shadow="lg"
          />
          <InputRightElement width='4.5rem' bottom={0} top="unset">
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

const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({ ...styles, backgroundColor: 'white', width: '100%', border: "none", visibility: 'hidden', position: 'absolute' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color;
    return {
      ...styles,
      backgroundColor: undefined,
      color: isFocused ? 'black' : '#ccc',
      cursor: isDisabled ? 'not-allowed' : 'default',
      fontSize: isFocused ? '18px' : '14px',
      fontWeight: isFocused ? 'bold' : 'normal',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color
          : undefined,
      },
    };
  },
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px"
    },
    "::-webkit-scrollbar-track": {
      background: "white"
    },
    "::-webkit-scrollbar-thumb": {
      background: "#ccc",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#979797"
    }
  }),
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  container: (styles) => ({ ...styles, width: '100%' }),
};

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

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