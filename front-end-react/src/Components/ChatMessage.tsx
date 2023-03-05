import React from "react";
import { Text, Icon, HStack, Tooltip, Box } from "@chakra-ui/react"
import { useBetween } from "use-between";
import useSocket from "../Hooks/useSocket";
import { BiReply } from 'react-icons/bi'
import { BsFillInfoCircleFill } from 'react-icons/bs'

const useSharedSocket = () => useBetween(useSocket);

export const ChatMessage = ({ message }) => {

  const { actualUserConnected } = useSharedSocket()

  const elRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    elRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [message])

  console.log(actualUserConnected, message)

  if (message.privateMessage) {
    const forMe = actualUserConnected?.id === message.to.id
    return (
      <Box
        my="5px"
        paddingBottom="10px"
        padding="4px 10px 0px"
        backgroundColor={forMe && message.from.nickColor}
        borderRadius="md"
        _hover={{
          background: forMe ? `${message.from.nickColor}EE` : '#f7f7f7'
        }}
        transition="all .3s ease"
        data-group
      >
        <HStack
          justifyContent="space-between"
        >
          <Text
            ref={elRef}
            paddingBottom={2}
            as={message.systemMessage && "i"}
            opacity={message.systemMessage && "0.5"}
            color={forMe ? 'white' : 'black'}
          >
            {message.from &&
              <span style={{ fontWeight: 800, color: forMe ? 'white' : message.from.nickColor }}>
                {actualUserConnected?.id === message.from.id ? 'Eu' : message.from.name}:
              </span>
            } {message.message}
          </Text>
          <Tooltip label='Esta é uma mensagem privada' fontSize='sm' hasArrow placement='left-start'
          >
            <span>
              <Icon
                as={BsFillInfoCircleFill}
                color={forMe ? 'white' : 'black'}
                opacity="0"
                _groupHover={{ opacity: '1' }}
                transition="all .3s ease" />
            </span>
          </Tooltip>
        </HStack>
        {message.to && !forMe && (
          <Text fontSize="xs" mt="-13px" paddingBottom='5px'>
            <Icon as={BiReply} transform="rotate(180deg)" />
            para: <span style={{ fontWeight: 800, color: message.to.nickColor || 'black' }}>{message.to.name}</span>
          </Text>
        )}

      </Box>
    )
  }

  return (
    <Text
      ref={elRef}
      paddingBottom={2}
      as={message.systemMessage && "i"}
      opacity={message.systemMessage && "0.5"}
      padding="3px 10px 6px"
      borderRadius="md"
      _hover={{
        background: '#f7f7f7'
      }}
    >
      {message.from &&
        <span style={{ fontWeight: 800, color: message.from.nickColor || 'black' }}>
          {actualUserConnected?.id === message.from.id ? 'Eu' : message.from.name}:
        </span>
      } {message.message}
    </Text>
  )
};