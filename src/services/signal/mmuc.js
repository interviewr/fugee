const RAVEN_CORE_NS = ''
const RAVEN_CORE_DATACHANNEL = ''
const MMUC_NS = ''

export default (client, stanzas) => {
  const types = stanzas.utils

  const RavenUser = stanzas.define({
    element: 'user',
    fields: {
      customerData: {
        get: () => {
          const data = types.getText(this.xml)
          if (data) {
            return JSON.parse(data)
          }

          return {}
        }
      },
      roomId: types.attribute('rid'),
      sessionId: types.attribute('sid'),
      type: types.attribute('type')
    },
    name: 'ravenUserInfo',
    namespace: RAVEN_CORE_NS
  })

  const MediaStream = stanzas.define({
    element: 'mediastream',
    fields: {
      msid: types.attribute('msid'),
      audio: types.attribute('audio'),
      video: types.attribute('video')
    },
    name: '_mediaStream',
    namespace: MMUC_NS
  })

  const DataChannel = stanzas.define({
    element: 'description',
    fields: {
      applicationType: {
        value: 'datachannel'
      }
    },
    name: '_datachannel',
    namespace: RAVEN_CORE_DATACHANNEL,
    tags: ['raven-application']
  })

  const Conference = stanzas.define({
    element: 'conf',
    fields: {
      bridged: types.boolAttribute('bridged'),
      lastN: types.numberAttribute('last-n'),
      media: types.attribute('media')
    },
    name: 'mmuc',
    namespace: MMUC_NS
  })

  const Status = stanzas.define({
    element: 'status',
    fields: {
      active: types.boolAttribute('active'),
      media: types.attribute('media'),
      mode: types.attribute('mode'),
      ready: types.boolAttribute('ready'),
      stamp: types.dateAttribute('stamp')
    },
    name: 'mmucStatus',
    namespace: MMUC_NS
  })

  const ParticipantState = stanzas.define({
    element: 'state',
    fields: {
      speaking: types.boolAttribute('speaking')
    },
    name: 'mmuc',
    namespace: MMUC_NS
  })

  const CallControl = stanzas.define({
    element: 'query',
    fields: {
      endMedia: types.boolSub(MMUC_NS, 'end-media')
    },
    name: 'mmuc',
    namespace: MMUC_NS
  })

  const StartCall = stanzas.define({
    element: 'start-media',
    fields: {
      media: types.attribute('media')
    },
    name: 'startMedia',
    namespace: MMUC_NS
  })

  stanzas.extend(CallControl, StartCall)

  stanzas.withPresence((Presence) => {
    stanzas.extend(Presence, Conference)
    stanzas.extend(Presence, MediaStream, 'mediaStreams')
    stanzas.extend(Presence, RavenUser)
  })

  stanzas.withMessage((Message) => {
    stanzas.extend(Message, Status)
    stanzas.extend(Message, ParticipantState)
  })

  stanzas.withIQ((IQ) => {
    stanzas.extend(IQ, CallControl)
  })

  stanzas.withDefinition('content', 'urn:xmpp:jingle:1', (Content) => {
    stanzas.extend(Content, DataChannel)
  })

  stanzas.withDefinition('jingle', 'urn:xmpp:jingle:1', (Jingle) => {
    stanzas.extend(Jingle, MediaStream, 'mediaStreams')
  })
}
