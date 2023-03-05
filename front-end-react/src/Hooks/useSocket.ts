import React from 'react'
import { v4 as uuid } from 'uuid'

const URL = 'wss://sbitwzz8e9.execute-api.sa-east-1.amazonaws.com/production/';

interface SocketData {
  members?: any
  message: string;
  fromBot?: boolean;
  systemMessage?: boolean;
  from?: {
    name: string
    id?: string
  }
}

interface IUserSocketConnected {
  name: string;
  nickColor: string;
  id: string;
}

interface CustomWebSocket extends WebSocket {
  userConnected?: IParticipant | null
}

const useSocket: () => Props = () => {
  const socket = React.useRef<CustomWebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [actualUserConnected, setActualUserConnected] = React.useState<IParticipant | null>(null);
  const [members, setMembers] = React.useState<IParticipant[]>([]);
  const [chatRows, setChatRows] = React.useState<SocketData[]>([]);
  const [privateTo, setPrivateTo] = React.useState<any>(null);

  let userConnected: IUserSocketConnected | null = null;

  const onSocketOpen = React.useCallback(() => {
    setIsConnected(true);
    setActualUserConnected(userConnected)
    console.log('to setando', actualUserConnected, userConnected)
    socket.current?.send(JSON.stringify({ action: 'setName', userConnected }));
  }, [actualUserConnected, userConnected]);

  const onSocketClose = React.useCallback(() => {
    setMembers([]);
    setPrivateTo(null);
    // setChatRows([]);
    setIsConnected(false);
    setActualUserConnected(null);
    setChatRows(oldArray => [...oldArray, { "systemMessage": true, "message": "Você saiu." }]);
  }, []);

  const onSocketMessage = React.useCallback((dataStr) => {
    const data: SocketData = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else {
      setChatRows(oldArray => [...oldArray, data]);
    }
  }, []);

  const onConnect = React.useCallback(({ name, nickColor }) => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      const id = uuid()
      userConnected = { name, nickColor, id }
      socket.current = new WebSocket(URL);
      socket.current.userConnected = userConnected
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  React.useEffect(() => {
    return () => {
      socket.current?.close();
      // socket.current?.removeEventListener('open', onSocketOpen);
      socket.current?.removeEventListener('close', onSocketClose);
    };
  }, []);

  const onSendPrivateMessage = React.useCallback((message: string) => {
    socket.current?.send(JSON.stringify({
      action: 'sendPrivate',
      message,
      to: privateTo
    }))
  }, [privateTo]);

  const onSendPublicMessage = React.useCallback((message) => {
    if (message !== null && message !== "") {
      privateTo
        ? onSendPrivateMessage(message)
        : socket.current?.send(JSON.stringify({
          action: 'sendPublic',
          message,
        }));
    }
  }, [onSendPrivateMessage, privateTo]);

  const onSendBotMessage = React.useCallback(() => {
    const message = prompt('Mensagem  para BOT ');
    if (message !== null && message !== "") {
      socket.current?.send(JSON.stringify({
        action: 'sendBot',
        message
      }));
    }
  }, []);

  const onDisconnect = React.useCallback(() => {
    if (isConnected) {
      socket.current?.close();
    }
  }, [isConnected]);

  const handleSetPrivateTo = (participant: IParticipant | null) => {
    const hasParticipant = members.filter(member => member.id === participant?.id);
    if (!hasParticipant.length && participant) {
      alert('Membro saiu da sala');
      return;
    }

    setPrivateTo(participant)
  }

  return {
    isConnected,
    members,
    chatRows,
    onSocketOpen,
    onSocketClose,
    onConnect,
    onSendPrivateMessage,
    onSendPublicMessage,
    onSendBotMessage,
    onDisconnect,
    actualUserConnected,
    privateTo,
    setPrivateTo: handleSetPrivateTo,
  }
}

interface Props {
  isConnected: boolean;
  members: IParticipant[];
  chatRows: any;
  onSendPublicMessage: (message) => void;
  onSendPrivateMessage: (to: string) => void;
  onConnect: (props: { name: string, nickColor: string }) => void;
  onDisconnect: () => void;
  onSendBotMessage: () => void;
  actualUserConnected: IParticipant | null;
  privateTo: IParticipant | null;
  setPrivateTo: (value: IParticipant | null) => void;
}

export interface IParticipant extends IUserSocketConnected { }

export default useSocket;