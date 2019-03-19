import React from 'react'
import { connect } from 'react-redux'
// import Provider, {
//   Connecting,
//   Disconnected,
//   Connected
// } from '../../../containers/Provider'
// import RequestUserMedia from '../../../containers/RequestUserMedia'
// import Room from '../../../containers/Room'

import Signal from '../../../services/signal'

const connectToXMPP = () => (dispatch, getState) => {
  const signal = new Signal(dispatch, getState, {
    jid: 'admin@localhost',
    wsURL: 'ws:127.0.0.1:5280/xmpp-websocket'
  })

  signal.connect()
}

const mapDispatchToProps = (dispatch) => ({
  connect: () => dispatch({})
})

class App extends React.PureComponent {
  componentDidMount () {
    // this.props.connect()
    const signal = new Signal(() => {}, () => {}, {
      jid: 'admin@localhost',
      transport: 'websocket',
      wsURL: 'ws:127.0.0.1:5280/xmpp-websocket'
    })

    signal.connect()
    signal.sendMessage({
      to: 'admin@localhost',
      body: 'Hello!'
    })
  }

  render () {
    return (
      <h1>Yay!</h1>
    )
  }
}

// const App = ({ configUrl, userData, roomName, roomPassword }) => (
//   <Provider
//     configUrl={configUrl}
//     userData={userData}
//   >
//     <Connecting>
//       <h1>Connecting...</h1>
//     </Connecting>

//     <Disconnected>
//       <h1>Lost connection. Reattempting to join...</h1>
//     </Disconnected>

//     <Connected>
//       <RequestUserMedia audio video auto />
//       <Room name={roomName} password={roomPassword}>
//         {({ room, peers, localMedia, remoteMedia }) => {
//           if (!room.joined) {
//             return <h1>Joining room...</h1>
//           }

//           return (
//             <div>
//               <h1>{room.providedName}</h1>
//             </div>
//           )
//         }}
//       </Room>
//     </Connected>
//   </Provider>
// )

export default connect(null, mapDispatchToProps)(App)
