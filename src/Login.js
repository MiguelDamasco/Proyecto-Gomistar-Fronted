import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { userContext } from './App';
import './Login.css';

const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [roles, setRoles] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const {user, setUser} = useContext(userContext);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const MyUser = {
      "id": "",
      "username": "",
      "roles": [],
      "token": ""
    };

    try {
      // Primer request: Login
      const response = await axios.post('http://localhost:8115/login', {
        username,
        password,
      });

      // Guardar el token en localStorage
      const token = response.data.token;
      const myUsername = response.data.username;
      localStorage.setItem('token', token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isAlertClose', "0");
      console.log("token: " + token)
      console.log("username: " + response.data.username);

      // Segundo request: Obtener ID del usuario autenticado
      
        const response2 = await axios.get('http://localhost:8115/user/getId', {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
          params: {
            username, // Parámetro en la URL
          }});

        const id = response2.data.value.id;

        localStorage.setItem('id', response2.data.value.id);
        alert('ID: ' + response2.data.value.id);
        //navigate('/dashboard');

     
        const response3 = await axios.get('http://localhost:8115/user/getRoles', {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
          params: {
            pIdUser: localStorage.getItem('id'), // Parámetro en la URL
          }});
        

        const roles = response3.data.value.map((role) => role.name); // Asume que `value` es un arreglo de objetos con `id` o similar

        if (Array.isArray(roles) && roles.length > 0) {
          // Guarda los roles en localStorage como una cadena JSON
          //const rolesIds = roles.map(role => role.id);
          console.log('roles:' + roles)
          localStorage.setItem('roles', JSON.stringify(roles));

          // Opcional: Muestra los roles en consola o en un alert
          console.log('Roles:', roles);
          alert('Roles: ' + roles.join(', '));
        } else {
          console.warn('No se encontraron roles para el usuario.');
          alert('No se encontraron roles para el usuario.');
        }


        const response4 = await axios.get('http://localhost:8115/user/is_comfirmed', {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
          params: {
            pIdUser: localStorage.getItem('id'), // Parámetro en la URL
          }});

          if(response4.data.value) {
            localStorage.setItem('email_confirm', "1");
          }
          else {
            localStorage.setItem('email_confirm', "0");
          }
          
        localStorage.setItem('request', "0");
        //login({ token, username, id, roles });
        console.log("mi id: " + id);
        console.log("mi username: " + "willy!");
        console.log("mis roles: " + roles.length);
        console.log("mi token: " + token);
        MyUser.id = id;
        MyUser.username = myUsername;
        MyUser.roles = roles;
        MyUser.token = token;
        console.log(MyUser);
        setUser(MyUser);
        //console.log("Mi usuario logeado: " + loggedUser);
        if (roles.includes('ADMIN')) {
          navigate('/admin_panel');
        } else if (roles.includes('USER')) {
          navigate('/dashboard');
        } else {
          alert('No tienes acceso a ningún dashboard.');
        }
      
      alert('Login exitoso');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <form class="form" onSubmit={handleSubmit}>
       <p class="form-title">Ingresar sesión</p>
        <div class="input-container">
          <input 
            type="text" 
            placeholder="Ingrese username" 
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
          <span>
          </span>
      </div>
      <div class="input-container">
          <input 
          type="password" 
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
         <button type="submit" class="submit">
        Ingresar
      </button>

      <p class="signup-link">
        Olvidaste la contraseña?&nbsp;
        <a href="">Restablecer</a>
      </p>
   </form>
    </div>
  );
};

export default Login;

