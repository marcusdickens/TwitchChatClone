
import React, { useEffect, useState } from 'react';
import {StreamChat} from 'stream-chat';
import MessagingContainer from './components/MessagingContainer'
import Auth from "./components/Auth"
import Video from './components/Video'
import {Chat,Channel} from 'stream-chat-react';
import {useCookies} from 'react-cookie'
import '@stream-io/stream-chat-css/dist/css/index.css';

const client = StreamChat.getInstance('kvjfwedgn6km');

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  const [channel, setChannel] = useState(null)
  const [users, setUsers] = useState(null)
  const authToken = cookies.AuthToken

  useEffect( async () => {
    if(authToken) {
      const {users} = await client.queryUsers({role: 'user'})
      setUsers(users)
    }
   
  }, []);

  const setupClient = async () => {
    try {
      await client.connectUser(
        {
          id: cookies.UserId,
          name: cookies.Name,
          hashedPassword: cookies.HashedPassword
        },
        authToken
      )

      const channel = await client.channel("gaming", "gaming-chat-demo", {
        name: "Gaming Chat Demo",
      })
      setChannel(channel)

    } catch (err) {
      console.log(err);
    }
  };

  if(authToken) setupClient();

  return (
    <>
      {!authToken && <Auth/>}
      {authToken && <Chat client={client} darkMode={true}>
        <Channel channel={channel}>
          <Video/>
          <MessagingContainer users={users}/>
        </Channel>
      </Chat>}
    </>
  )
}

export default App;