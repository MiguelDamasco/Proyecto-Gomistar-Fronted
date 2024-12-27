
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import ModalPassword from './ModalPassword';
import ModalUsername from './ModalUsername';
import'./css/emailConfirmation.css';


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
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ marginRight: '10px' }}>Bienvenido, {username}!</span>
    <div className="logout-container" style={{ display: 'flex', alignItems: 'center' }}>
        <button className="Btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="sign" style={{ marginRight: '5px' }}>
                <svg viewBox="0 0 512 512" style={{ width: '16px', height: '16px' }}>
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
            </div>
            <div className="text">Salir</div>
        </button>
    </div>
</nav>
        <div className="main-container">
<div class="info">
    <div class="info__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m12 1.5c-5.79844 0-10.5 4.70156-10.5 10.5 0 5.7984 4.70156 10.5 10.5 10.5 5.7984 0 10.5-4.7016 10.5-10.5 0-5.79844-4.7016-10.5-10.5-10.5zm.75 15.5625c0 .1031-.0844.1875-.1875.1875h-1.125c-.1031 0-.1875-.0844-.1875-.1875v-6.375c0-.1031.0844-.1875.1875-.1875h1.125c.1031 0 .1875.0844.1875.1875zm-.75-8.0625c-.2944-.00601-.5747-.12718-.7808-.3375-.206-.21032-.3215-.49305-.3215-.7875s.1155-.57718.3215-.7875c.2061-.21032.4864-.33149.7808-.3375.2944.00601.5747.12718.7808.3375.206.21032.3215.49305.3215.7875s-.1155.57718-.3215.7875c-.2061.21032-.4864.33149-.7808.3375z"></path></svg>
    </div>
    <div class="info__title">Confirmar <a href='/dashboard/user'>email</a></div>
    <div class="info__close"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#393a37"></path></svg></div>
</div>
          <div className="field">
            <p>Nombre:</p>
            <input type="text" value={name} readOnly />
            <button onClick={() => handleOpenModal('name', name)} class="edit-button">Modificar</button>
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
  