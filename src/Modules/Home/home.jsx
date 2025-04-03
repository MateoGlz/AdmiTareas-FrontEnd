import { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";

const Home = () => {
    const [tareas, setTareas] = useState([]);
    const [tareasIncompletas, setTareasIncompletas] = useState([]);
    const [tareasCompletadas, setTareasCompletadas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerTareas();
    }, []);

    const obtenerTareas = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/get_all_tareas");
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            const todasLasTareas = data.tareas || [];

            const tareasCompletadas = todasLasTareas.filter(tarea => tarea.estado === "Completada");
            const tareasIncompletas = todasLasTareas.filter(tarea => tarea.estado !== "Completada");
            setTareas(data.tareas || []); 
            setTareasIncompletas(tareasIncompletas);
            setTareasCompletadas(tareasCompletadas);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
            setTareas([]); // En caso de error, evita que el estado sea undefined
        }
    };

    const handleButtonClick = () => {
        navigate('/create-tarea'); 
    };

    const handleEliminar = async (id) => {
        const resultado = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
    
        if (!resultado.isConfirmed) return;
    
        try {
            const response = await fetch(`http://127.0.0.1:5000/eliminar_tarea/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Tarea eliminada con éxito",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    obtenerTareas(); 
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error al eliminar la tarea",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
            } catch (error) {
                console.error("Error al eliminar la tarea:", error);
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al eliminar la tarea",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }            
    };

    const obtenerColorPrioridad = (prioridad) => {
        switch (prioridad) {
            case "Urgente": return "bg-red-500"; 
            case "Alta": return "bg-orange-500"; 
            case "Media": return "bg-yellow-500"; 
            case "Baja": return "bg-green-500"; 
            case "Nice Have": return "bg-blue-500"; 
            default: return "bg-gray-500"; 
        }
    };

    return (
        <main className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Lista de Tareas</h1>

            <div className="flex justify-end mb-4">
                <button 
                    className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center hover:bg-blue-700 transition-all"
                    onClick={handleButtonClick}
                >
                    <span className="text-2xl font-bold">+</span>
                    <span className="ml-2">Agregar Tarea</span>
                </button>
            </div>
            <h1 className="text-2xl font-semibold mb-4">Tareas Pendientes</h1>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tareasIncompletas.filter(tarea => tarea.estado !== "Completada").map((tarea) => (
                    <div key={tarea.id} className={`p-6 rounded-lg text-white shadow-lg ${obtenerColorPrioridad(tarea.prioridad)} flex flex-col`}>
                        <h2 className="text-xl font-semibold">{tarea.titulo}</h2>
                        <p className="text-sm mt-2">{tarea.descripcion}</p>
                        <p className="text-sm mt-2 font-light">Prioridad: {tarea.prioridad}</p>
                        <p className="text-sm mt-2 font-light">Estado: {tarea.estado}</p>
                        <p className="text-sm mt-2 font-light">
                            Fecha Vencimiento: {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-MX', {
                                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
                            })}
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => navigate(`/editar-tarea/${tarea.id}`)}
                                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700 transition">
                                <Pencil size={16} className="mr-1" /> Editar
                            </button>
                            <button onClick={() => handleEliminar(tarea.id)}
                                className="flex items-center bg-red-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition">
                                <Trash size={16} className="mr-1" /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-2xl font-semibold mb-4 pt-4">Tareas Completadas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tareasCompletadas.filter(tarea => tarea.estado === "Completada").map((tarea) => (
                    <div key={tarea.id} className="p-6 rounded-lg text-gray-400 bg-gray-800 shadow-lg flex flex-col">
                        <h2 className="text-xl font-semibold">{tarea.titulo}</h2>
                        <p className="text-sm mt-2">{tarea.descripcion}</p>
                        <p className="text-sm mt-2 font-light">Prioridad: {tarea.prioridad}</p>
                        <p className="text-sm mt-2 font-light">Estado: {tarea.estado}</p>
                        <p className="text-sm mt-2 font-light">
                            Fecha Vencimiento: {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-MX', {
                                weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
                            })}
                        </p>
                    </div>
                ))}
            </div>
</div>

        </main>
    );
};

export default Home;
