import React from 'react'

const URL = 'wss://sbitwzz8e9.execute-api.sa-east-1.amazonaws.com/production/';

interface SocketData {  
  members?: any
  message: string;
  fromBot?: boolean;
  systemMessage?: boolean;
  from: {
    name: string
    id?: string
  }
}

const partic = [
  "jean1",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean33",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean11",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean3",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean334",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean4",
  "jean",
  "jean",
  "jean",
  "jean123",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean354",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean",
  "jean13",
]

const messagesDefault = [
  { message: "testeinicio", from: { name: "jean" } }
]

const useSocket: () => Props = () => {
  const socket = React.useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [members, setMembers] = React.useState(partic);
  const [chatRows, setChatRows] = React.useState<SocketData[]>(messagesDefault);
  let name;

  const onSocketOpen = React.useCallback(() => {
    setIsConnected(true);
    name = prompt('Informe o seu nome:');
    if (name !== null && name !== "") {

      socket.current?.send(JSON.stringify({ action: 'setName', name }));
    }
  }, []);

  const onSocketClose = React.useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);

  const onSocketMessage = React.useCallback((dataStr) => {
    const data: SocketData = JSON.parse(dataStr);
    console.log(data)
    if (data.members) {
      setMembers(data.members);
    } else {
      setChatRows(oldArray => [...oldArray, data]);
    }
  }, []);

  const onConnect = React.useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
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
    };
  }, []);

  const onSendPrivateMessage = React.useCallback((to: string) => {
    const message = prompt('Mensagem privada para: ' + to);
    if (message !== null && message !== "" && to !== name) {
      socket.current?.send(JSON.stringify({
        action: 'sendPrivate',
        message,
        to,
      }));
    }
  }, []);

  const onSendPublicMessage = React.useCallback(() => {
    const message = prompt('Mensagem pública');
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
  members: string[];
  chatRows: any;
  onSendPublicMessage: () => void;
  onSendPrivateMessage: (to: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onSendBotMessage: () => void;
}

export default useSocket;