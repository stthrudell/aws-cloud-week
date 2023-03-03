import React from 'react'

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
}

const useSocket: () => Props = () => {
  const socket = React.useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [chatRows, setChatRows] = React.useState<SocketData[]>([]);

  let userConnected: IUserSocketConnected;

  const onSocketOpen = React.useCallback(() => {
    setIsConnected(true);
    socket.current?.send(JSON.stringify({ action: 'setName', userConnected }));
  }, []);

  const onSocketClose = React.useCallback(() => {
    // setMembers([]);
    // setChatRows([]);
    setIsConnected(false);
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
      userConnected = { name, nickColor }
      socket.current = new WebSocket(URL);
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

  const onSendPrivateMessage = React.useCallback((to: string) => {
    const message = prompt('Mensagem privada para: ' + to);
    if (message !== null && message !== "" && to !== userConnected?.name) {
      socket.current?.send(JSON.stringify({
        action: 'sendPrivate',
        message,
        to,
      }));
    }
  }, []);

  const onSendPublicMessage = React.useCallback((message) => {
    if (message !== null && message !== "") {
      socket.current?.send(JSON.stringify({
        action: 'sendPublic',
        message,
      }));
    }
  }, []);

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
    onDisconnect
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
}

interface IParticipant {
  name: string;
  nickColor: string;
}

export default useSocket;