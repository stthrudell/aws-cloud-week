import React from 'react'
import useSocket from '../Hooks/useSocket';
import { Flex, Container, Grid, List, ListItem, Button, Text, GridItem, Divider, Icon, HStack } from '@chakra-ui/react'
import { InputMessage } from './InputMessage';
import { useBetween } from 'use-between';
import { IoExitOutline } from 'react-icons/io5';
import { ChatMessage } from './ChatMessage';

const useSharedSocket = () => useBetween(useSocket);

export const ChatClient = () => {
  const { isConnected, members, chatRows, onConnect, onDisconnect } = useSharedSocket()

  return (
    <Flex
      backgroundColor="#EDEDEF"
      width='100%'
      height='100%'
      alignItems='center'
    >
      <Container height="90%" maxW='1200px'>
        <Grid height="100%" templateColumns='1fr 4fr'>
          {/** Grid com os contatos conectados */}
          <GridItem
            backgroundColor="#2D46C9"
            color='white'
            padding="20px"
            overflowY="scroll"
            borderRadius="10px 0 0 10px"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#24388766',
                borderRadius: '24px',
              },
            }}
          >
            <List>
              <HStack justifyContent="space-between">
                <Text>Participantes</Text>
                {isConnected && <Button size='sm' variant="ghost" color="orange" onClick={onDisconnect}><Icon as={IoExitOutline} /></Button>}
              </HStack>
              <Divider mb="15px" opacity="0.2" />
              {!members.length && <Text fontSize='sm' as='i' fontWeight="thin" opacity="0.3">Nenhum participante</Text>}
              {members.map((member, index) =>
                <ListItem key={index} onClick={() => console.log("mandar msg para ", member)}>
                  <Text style={{ fontWeight: 800 }}>{member}</Text>
                </ListItem>
              )}
            </List>
          </GridItem>
          {/* Grid das mensagens enviadas  */}
          <GridItem
            position="relative"
            overflow="hidden"
          >
            <Grid
              templateRows='10fr 1fr'
              background="white"
              padding="20px"
              borderRadius="0 10px 10px 0"
              height="100%"
            >
              <Grid
                overflowY="scroll"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '10px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#24388766',
                    borderRadius: '24px',
                  },
                }}
              >
                <List display="flex" flexDir="column" justifyContent="end">
                  {chatRows.map((message, index) =>
                    <ListItem key={index}>
                      <ChatMessage message={message} />
                    </ListItem>
                  )}
                </List>
                {/* Botões de envio de mensagem */}

              </Grid>
              <Grid style={{ margin: 10 }}>
                <InputMessage />
              </Grid>
            </Grid>
            <div style={{
              position: 'absolute',
              right: 9,
              top: 8,
              width: 12,
              height: 12,
              backgroundColor: isConnected ? '#00da00' : '#e2e2e2',
              borderRadius: 50,
            }} />
          </GridItem>
        </Grid>
      </Container>
    </Flex >
  )
};