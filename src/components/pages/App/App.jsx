import React from 'react'
import Provider, {
  Connecting,
  Disconnected,
  Connected
} from '../../../containers/Provider'
import RequestUserMedia from '../../../containers/RequestUserMedia'
import Room from '../../../containers/Room'
import Video from '../../atoms/Video'

const App = ({ configUrl, userData, roomName, roomPassword }) => (
  <Provider
    configUrl={configUrl}
    userData={userData}
  >
    <Connecting>
      <h1>Connecting...</h1>
    </Connecting>

    <Disconnected>
      <h1>Lost connection. Reattempting to join...</h1>
    </Disconnected>

    <Connected>
      <RequestUserMedia audio video auto />
      <Room name={roomName} password={roomPassword}>
        {({ room, peers, localMedia, remoteMedia }) => {
          if (!room.joined) {
            return <h1>Joining room...</h1>
          }

          const remoteVideos = remoteMedia.filter(m => m.kind === 'video')
          const localVideos = localMedia.filter(m => m.kind === 'video' && m.shared)
          const items = [...localVideos, ...remoteVideos]

          return (
            <div>
              <h1>{room.providedName}</h1>
              {items.map((item, idx) => (
                <Video
                  key={idx}
                  media={item}
                />
              ))}
            </div>
          )
        }}
      </Room>
    </Connected>
  </Provider>
)

export default App
