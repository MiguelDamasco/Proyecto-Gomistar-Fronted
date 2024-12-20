
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import ModalPassword from './ModalPassword';
import ModalUsername from './ModalUsername';
import BtnModify from './css/BtnModify.css';


const UserDashboard = () => {
    const navigate = useNavigate();
  
    const userId = localStorage.getItem('id');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [usernameModalOpen, setUsernameModalOpen] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');

    const [messages, setMessages] = useState({
        name: { text: '', type: 'normal' },
        lastname: { text: '', type: 'normal' },
        username: { text: '', type: 'normal' },
        email: { text: '', type: 'normal' },
        password: { text: '', type: 'normal' },
      });
      
      
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:8115/userEmployee/getUser', {
            params: { pId: userId },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUsername(response.data.value.username);
          setEmail(response.data.value.email);
          setPassword(response.data.value.password);
          setName(response.data.value.name);
          setLastname(response.data.value.lastname);
        } catch (err) {
          console.error('Error al obtener los datos del usuario:', err);
        }
      };
  
      fetchUserData();
    }, [userId]);
  
    const handleSavePassword = async () => {
      try {
        await axios.patch(
          'http://localhost:8115/userEmployee/modify_password',
          { idUser: userId, oldPassword, newPassword },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setMessages((prevMessages) => ({
            ...prevMessages,
            password: {
              text: 'Contraseña actualizada con éxito!',
              type: 'normal',
            },
          }));

          autoCleanMessage();
        
        setPasswordModalOpen(false);
        alert('Contraseña modificada exitosamente.');
      } catch (err) {
        console.error('Error al modificar la contraseña:', err);
        //alert('Error al modificar la contraseña. Verifica los datos ingresados.');
        setPasswordModalOpen(false);
        changeMessageError(err.response.data.message);
        autoCleanMessage();
      }
    };


    const handleSaveUsername = async () => {
        try {

            const passwordCheckResponse = await axios.post(
                'http://localhost:8115/user/checkPassword',
                { idUser: userId, password },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const usernameCheckResponse = await axios.post(
                'http://localhost:8115/user/checkUsername',
                { username },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );


          await axios.patch(
            'http://localhost:8115/userEmployee/modify_username',
            { idUser: userId, username: newUsername },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );

          console.log("username: " + newUsername);
          console.log("password: " + password);

          const response = await axios.post('http://localhost:8115/login', {
            username: newUsername,
            password,
          });
    
          // Guardar el token en localStorage
          const token = response.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('username', response.data.username);
          console.log("token: " + token)
          console.log("username: " + response.data.username);

          setUsername(response.data.username);
          
          setMessages((prevMessages) => ({
              ...prevMessages,
              username: {
                text: 'Username actualizada con éxito!',
                type: 'normal',
              },
            }));
  
            autoCleanMessage();
          
          setUsernameModalOpen(false);
          alert('Contraseña modificada exitosamente.');
        } catch (err) {
          console.error('Error al modificar la contraseña:', err);
          //alert('Error al modificar la contraseña. Verifica los datos ingresados.');
          setUsernameModalOpen(false);
          changeMessageErrorUsername(err.response.data.message);
          //autoCleanMessage();
        }
      };
  
    const handleOpenPasswordModal = () => {
      cleanMessage();
      setPasswordModalOpen(true);
      setOldPassword('');
      setNewPassword('');
    };

    const handleOpenUsernameModal = () => {
        cleanMessage();
        setUsernameModalOpen(true);
        setNewUsername('');
        setPassword('');
      };
  
    const handleOpenModal = (field, value) => {
      cleanMessage();
      setFieldToEdit(field);
      setCurrentValue(value);
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
      setPasswordModalOpen(false);
      setUsernameModalOpen(false);
      setFieldToEdit('');
      setCurrentValue('');
    };
  
    const handleSave = async (newValue) => {
      try {
        const urlMap = {
          name: 'modify_name',
          lastname: 'modify_lastname',
          username: 'modify_username',
          email: 'modify_email',
        };
        const endpoint = urlMap[fieldToEdit];
        if (!endpoint) return;
  
        await axios.patch(
          `http://localhost:8115/userEmployee/${endpoint}`,
          { idUser: userId, [fieldToEdit]: newValue },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        // Actualizar estado local
        if (fieldToEdit === 'name') setName(newValue);
        else if (fieldToEdit === 'lastname') setLastname(newValue);
        //else if (fieldToEdit === 'username') setUsername(newValue);
        else if (fieldToEdit === 'email') setEmail(newValue);

        changeMessage();
        autoCleanMessage();
  
        setModalOpen(false);

      } catch (err) {
        console.error(`Error al modificar ${fieldToEdit}:`, err);
        changeMessageError(err.response.data.message);
        autoCleanMessage();
      }
    };

    const changeMessage = () => {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          for (let m in newMessages) {
            newMessages[m] = {
              text: m === fieldToEdit ? `${getName()} actualizado con éxito!` : '',
              type: 'normal',
            };
          }
          return newMessages;
        });
      };
      

      const cleanMessage = () => {
        setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            for(let m in newMessages) {
                newMessages[m] = {
                    text: '',
                    type: 'normal',
                };
            }
            return newMessages;
        });
      }
      
      
      const changeMessageError = (error) => {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          for (let m in newMessages) {
            newMessages[m] = {
              text: m === 'password' ? error : '',
              type: m === 'password' ? 'error' : 'normal',
            };
          }
          return newMessages;
        });
      };

      const changeMessageErrorUsername = (error) => {
        setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            for (let m in newMessages) {
                // Solo se modifica el mensaje del username cuando hay un error
                newMessages[m] = {
                    text: m === 'username' ? error : '',
                    type: m === 'username' ? 'error' : 'normal',
                };
            }
            return newMessages;
        });
     };
     
      
      const autoCleanMessage = () => {
        setTimeout(() => {
          cleanMessage();
        }, 3000); // Limpia los mensajes después de 3 segundos.
      };
      
      
      const getMessageStyle = (type) => {
        return { color: type === 'error' ? 'red' : 'green' };
      };
        
      const getName = () => {

        switch(fieldToEdit) {

            case 'name':
                return 'Nombre';
            case 'lastname':
                return 'Apellido';
            case 'email':
                return 'Email';
            case 'username':
                return 'Username';
            case 'password':
                return 'Contraseña';
            default:
                return '';
        }
      }
  
    const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
    };
  
    return (
      <div>
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
          <span style={{ marginRight: '10px' }}>Bienvenido, {username}!</span>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          
        </nav>
        <div className="main-container">
          <div className="field">
            <p>Nombre:</p>
            <input type="text" value={name} readOnly />
            <button onClick={() => handleOpenModal('name', name)} class="edit-button">
  <svg class="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
</button>
            <p style={getMessageStyle(messages.name.type)}>{messages.name.text}</p>
          </div>
          <div className="field">
            <p>Apellido:</p>
            <input type="text" value={lastname} readOnly />
            <button onClick={() => handleOpenModal('lastname', lastname)}>Modificar</button>
            <p style={getMessageStyle(messages.lastname.type)}>{messages.lastname.text}</p>
          </div>
          <div className="field">
            <p>Usuario:</p>
            <input type="text" value={username} readOnly />
            <button onClick={handleOpenUsernameModal}>Modificar</button>
            <p style={getMessageStyle(messages.username.type)}>{messages.username.text}</p>
          </div>
          <div className="field">
            <p>Correo:</p>
            <input type="text" value={email} readOnly />
            <button onClick={() => handleOpenModal('email', email)}>Modificar</button>
            <p style={getMessageStyle(messages.email.type)}>{messages.email.text}</p>
          </div>
          <div className="field">
            <p>Contraseña:</p>
            <input type="password" value="********" readOnly />
            <button onClick={handleOpenPasswordModal}>Modificar</button>
            <p style={getMessageStyle(messages.password.type)}>{messages.password.text}</p>
          </div>
        </div>
  
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={`Editar ${fieldToEdit}`}
          onSave={handleSave}
          currentValue={currentValue}
        />
        <ModalPassword
          isOpen={passwordModalOpen}
          onClose={handleCloseModal}
          title="Modificar Contraseña"
          oldPassword={oldPassword}
          newPassword={newPassword}
          setOldPassword={setOldPassword}
          setNewPassword={setNewPassword}
          onSave={handleSavePassword}
        />

        <ModalUsername
            isOpen={usernameModalOpen}
            onClose={handleCloseModal}
            title="Modificar Username"
            password={password}
            username={newUsername}
            setPassword={setPassword}
            setUsername={setNewUsername}
            onSave={handleSaveUsername}
        />
      </div>
    );
  };
  
  export default UserDashboard;
  