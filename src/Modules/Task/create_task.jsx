import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; 
import Swal from "sweetalert2";
const CreateTarea = () => {
    const [prioridades, setPrioridades] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState("");
    const [estados, setEstados] = useState([]);
    const [estado, setEstado] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrioridades = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/get_prioridades");
                const data = await response.json();

                if (Array.isArray(data.Prioridades)) {
                    setPrioridades(data.Prioridades); 
                } else {
                    console.error("Error: La respuesta de prioridades no es un arreglo");
                    setPrioridades([]); 
                }
            } catch (error) {
                console.error("Error al obtener prioridades:", error);
                setPrioridades([]); 
            }
        };

        const fetchEstado = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/get_estados");
                const data = await response.json();

                if (Array.isArray(data.Estados)) {
                    setEstados(data.Estados); 
                } else {
                    console.error("Error: La respuesta de prioridades no es un arreglo");
                    setEstados([]); 
                }
            } catch (error) {
                console.error("Error al obtener estados:", error);
            }
        };
        fetchPrioridades();
        fetchEstado();
    }, []);
    useEffect(() => {
        console.log("estado")
        console.log(estado)
    },[estado]);
    
    useEffect(() => {
        console.log("prioridad")
        console.log(prioridad)
    },[estado]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let prioridadEntera = parseInt(prioridad, 10);
        let estadoEntera = parseInt(estado, 10);
        const nuevaTarea = { titulo, descripcion, prioridad: prioridadEntera, estado: estadoEntera, fecha_vencimiento: fechaVencimiento };

        try {
            const response = await fetch("http://127.0.0.1:5000/create_tarea", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaTarea),
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Tarea creada con éxito",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/home");
                });
               
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error al crear la tarea",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al crear la tarea",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    return (
        <main className="p-4 relative">
            <button
                onClick={() => navigate("/home")}
                className="absolute top-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
            >
                <Home size={24} />
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">Crear Nueva Tarea</h1>
            
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value.toUpperCase())}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
                        }
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <select
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    >
                        <option value="" disabled>Selecciona una prioridad</option>
                        {prioridades.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    >
                        <option value="" disabled>Seleccionar estado</option>
                        {estados.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                    <input
                        type="date"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-full shadow-lg hover:bg-blue-700"
                >
                    Crear Tarea
                </button>
            </form>
        </main>
    );
};

export default CreateTarea;

