import React from 'react'
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import useSocket from './Hooks/useSocket';

export const ChatClient = () => {    
    const {isConnected, members, chatRows, onSendPublicMessage, onSendPrivateMessage, onSendBotMessage, onConnect, onDisconnect} = useSocket()

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#EDEDEF',
      display: 'flex',
      alignItems: 'center',
    }}>
      <CssBaseline />
      <Container 
        maxWidth="lg" 
        style={{ height: '90%' }}
        >

        <Grid container style={{ height: '100%' }}>
          {/** Grid com os contatos conectados */}
          <Grid 
            item xs={2} 
            sx={{
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',  
            }}
            style={{ 
              backgroundColor: '#2D46C9',
              color: 'white',
              fontFamily: 'segoe UI'
            }}
            >

            <List component="nav">
              {members.map(item =>
                <ListItem key={item} onClick={() => {{onSendPrivateMessage(item)};}} button>
                  <ListItemText style={{ fontWeight: 800 }} primary={item} />
                </ListItem>
              )}
            </List>

          </Grid>
          

          {/* Grid das mensagens enviadas  */}
          <Grid style={{ position: 'relative' }} item container direction="column" xs={10} >
            <Paper style={{ flex: 1 }}>
              <Grid item container style={{ height: '100%' }} direction="column">
                <Grid item container style={{ flex: 1 }}>
                  <ul style={{
                    paddingTop: 20,
                    paddingLeft: 44,
                    listStyleType: 'none',
                  }}>
                    {chatRows.map((item, i) =>
                      <li key={i} style={{ paddingBottom: 9 }}>{item}</li>
                    )}
                  </ul>
                </Grid>

                {/* Botões de envio de mensagem */}
                <Grid item style={{ margin: 10 }}>
                  {isConnected && 
                  
                  <Button 
                    style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" disableElevation onClick={onSendPublicMessage}>Mensagem pública</Button>
                  }
                  
                  {isConnected && <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" disableElevation onClick={onSendBotMessage}>Mensagem para o Bot</Button>}
                  {isConnected && <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" disableElevation onClick={onDisconnect}>Sair</Button>}
                  {!isConnected && <Button style={{ marginRight: 7, color: "#232F3E", borderColor: "#232F3E" }} variant="outlined" size="small" disableElevation onClick={onConnect}>Entrar</Button>}
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
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div >
  )
};