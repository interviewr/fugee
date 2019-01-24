import React, { useState } from 'react'
import styled from 'styled-components'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import history from '../../../services/history'

const LoginContainer = styled.div`
  position: relative;
`

const Login = () => {
  const [room, setRoom] = useState('')

  const handleEnterClick = () => {
    history.push(`/${room}`)
  }

  return (
    <LoginContainer>
      <Input
        value={room}
        placeholder='Please enter room id'
        onChange={setRoom}
      />
      <Button
        title='Enter'
        onClick={handleEnterClick}
        disabled={!room}
      />
    </LoginContainer>
  )
}

export default Login
