import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [code, setCode] = useState(''); 
    const [user, setUser] = useState(''); 
    const navigate = useNavigate(); 

    const handleLogin = (e) => {
        e.preventDefault();
        if (code === '1234' && user ==='admin') {//Esta hardcodeado por que no sabía si requerías login
            navigate('/home'); 
        } else {
            alert('Código incorrecto'); 
        }
    };
    return (  
        <main className="login">
            <div className="card">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <label className="text">Usuario</label>
                    <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)} // Actualiza el estado con el valor del input
                            className="input"
                        />
                    <label className="text">Contraseña</label>
                    <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)} // Actualiza el estado con el valor del input
                            className="input"
                        />
                    <button type="submit" className="btn">Acceder</button>
                </form>
            </div>
        </main>
    );
}

export default Login;
