import React from 'react'
import useSocket from '../Hooks/useSocket';
import { Flex, Container, Grid, List, ListItem, Button, Text, GridItem, Divider, Icon, HStack, useMediaQuery, Box } from '@chakra-ui/react'
import { InputMessage } from './InputMessage';
import { useBetween } from 'use-between';
import { IoExitOutline, IoEye, IoEyeOff } from 'react-icons/io5';
import { ChatMessage } from './ChatMessage';

const useSharedSocket = () => useBetween(useSocket);

export const ChatClient = () => {
  const [showParticipants, setShowParticipants] = React.useState(true)
  const { isConnected, members, chatRows, onDisconnect, setPrivateTo } = useSharedSocket()

  const [isLargerThan767] = useMediaQuery('(min-width: 767px)')

  React.useEffect(() => {
    setShowParticipants(isLargerThan767)
  }, [isLargerThan767])

  const handleShowParticipants = () => {
    setShowParticipants(show => !show)
  } 

  return (
    <Flex
      backgroundColor="#EDEDEF"
      width='100%'
      height='100%'
      alignItems='center'
    >
      <Container height="90%" maxW='1200px'>
        <Grid height="100%" templateColumns={['1fr', '1fr', '1fr 4fr']}>
          {/** Grid com os contatos conectados */}
          <GridItem
            backgroundColor="#2D46C9"
            color='white'
            padding="20px"
            overflowY="scroll"
            borderRadius={["10px 10px 0 0", "10px 10px 0 0", "10px 0 0 10px"]}
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
                <HStack>
                  <Text>Participantes</Text>
                  {!isLargerThan767 && isConnected && <Icon as={showParticipants ? IoEye : IoEyeOff} onClick={handleShowParticipants} />}
                </HStack>
                {isConnected && <Button size='sm' variant="ghost" color="orange" onClick={onDisconnect}><Icon as={IoExitOutline} /></Button>}
              </HStack>
              <Divider mb="15px" opacity="0.2" />
              {!isConnected && <Text fontSize='sm' as='i' fontWeight="thin" opacity="0.3">Entre no chat para ver os participantes</Text>}
              {!members.length && isConnected && <Text fontSize='sm' as='i' fontWeight="thin" opacity="0.3">Nenhum participante</Text>}
              <Box hidden={!showParticipants}>
                {members.map((member, index) =>
                  <ListItem key={index} onClick={() => setPrivateTo(member)} cursor="pointer" _hover={{ background: '#3950c7' }} borderRadius="md" paddingX="10px">
                    <Text style={{ fontWeight: 800 }}>{member?.name}</Text>
                  </ListItem>
                )}
              </Box>
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
              borderRadius={["0 0 10px 10px", "0 0 10px 10px", "0 10px 10px 0"]}
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