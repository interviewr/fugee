import { all, put, takeLatest } from 'redux-saga/effects'
import {
  MUTE_PENDING,
  MUTE_SUCCESS,
  MUTE_ERROR,
  UNMUTE_PENDING,
  UNMUTE_SUCCESS,
  UNMUTE_ERROR,
  PAUSE_VIDEO_PENDING,
  PAUSE_VIDEO_SUCCESS,
  PAUSE_VIDEO_ERROR,
  RESUME_VIDEO_PENDING,
  RESUME_VIDEO_SUCCESS,
  RESUME_VIDEO_ERROR
} from '../actions'
import StreamStore from '../services/StreamStore'
import myPeerId from '../constants'

function mutePeerAudio (peerId) {
  const audioStreamTracks = StreamStore.get(peerId).getAudioTracks()
  audioStreamTracks.forEach((track) => {
    track.stop()
  })
}

function pausePeerVideo (peerId) {
  const videoStreamTracks = StreamStore.get(peerId).getVideoTracks()
  videoStreamTracks.forEach((track) => {
    track.stop()
  })
}

function * mute () {
  try {
    mutePeerAudio(myPeerId)
    yield put({ type: MUTE_SUCCESS })
  } catch (error) {
    yield put({ type: MUTE_ERROR, payload: { error } })
  }
}

function * unmute () {
  try {
    // TODO: unmute audio stream tracks
    yield put({ type: UNMUTE_SUCCESS })
  } catch (error) {
    yield put({ type: UNMUTE_ERROR, payload: { error } })
  }
}

function * pauseVideo () {
  try {
    pausePeerVideo(myPeerId)
    yield put({ type: PAUSE_VIDEO_SUCCESS })
  } catch (error) {
    yield put({ type: PAUSE_VIDEO_ERROR, payload: { error } })
  }
}

function * resumeVideo () {
  try {
    // TODO: resume video stream tracks
    yield put({ type: RESUME_VIDEO_SUCCESS })
  } catch (error) {
    yield put({ type: RESUME_VIDEO_ERROR })
  }
}

export default function () {
  return all([
    takeLatest(MUTE_PENDING, mute),
    takeLatest(UNMUTE_PENDING, unmute),
    takeLatest(PAUSE_VIDEO_PENDING, pauseVideo),
    takeLatest(RESUME_VIDEO_PENDING, resumeVideo)
  ])
}
