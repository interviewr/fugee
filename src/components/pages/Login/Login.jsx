import React, { useState } from 'react'
import styled from 'styled-components'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import history from '../../../services/history'

const LoginContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const LoginInner = styled.div`
  width: 350px;
`

const InputWrapper = styled.div`
  margin-bottom: 15px;
`

const Login = () => {
  const [room, setRoom] = useState('')

  const handleEnterClick = () => {
    history.push(`/${room}`)
  }

  return (
    <LoginContainer>
      <LoginInner>
        <InputWrapper>
          <Input
            value={room}
            placeholder='Please enter room id'
            onChange={setRoom}
          />
        </InputWrapper>
        <Button
          title='Enter'
          onClick={handleEnterClick}
          disabled={!room}
        />
      </LoginInner>
    </LoginContainer>
  )
}

export default Login
