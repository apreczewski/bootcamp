import React from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Button } from 'shards-react';

import { Container } from './styles';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'No mínimo 6 caracteres')
    .required('A senha é obrigatória'),
});

export default function SignUp() {
  return (
    <Container>
      <img src={logo} alt="GoBarber" />
      <Form schema={schema}>
        <input type="name" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="confirmPassword" placeholder="Confirm-Password" />
        <Button>Register</Button>
        <Link to="/">SignIn</Link>
      </Form>
    </Container>
  );
}
