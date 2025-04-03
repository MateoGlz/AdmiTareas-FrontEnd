import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";  
import { Home, Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
const EditTarea = () => {
    const [prioridades, setPrioridades] = useState([]); 
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState("");
    const [estados, setEstados] = useState([]);
    const [estado, setEstado] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const { id } = useParams();  
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/get_tarea/${id}`);
                const data = await response.json();
                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
                setPrioridad(data.prioridad_id);
                setEstado(data.estado_id);
                const fechaVencimientoFormatted = new Date(data.fecha_vencimiento).toISOString().split('T')[0];
                setFechaVencimiento(fechaVencimientoFormatted);
            } catch (error) {
                console.error("Error al obtener la tarea:", error);
            }
        };

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

        fetchTarea();  
        fetchPrioridades();
        fetchEstado();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tareaActualizada = { titulo, descripcion, prioridad_id:prioridad, estado_id:estado, fecha_vencimiento: fechaVencimiento };

        try {
            const response = await fetch(`http://127.0.0.1:5000/actualizar_tarea/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tareaActualizada),
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Tarea actualizada con éxito",
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
            console.error("Error al actualizar la tarea:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema con la actualización de la tarea.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
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
                    navigate("/home"); 
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
    return (
        <main className="p-4 relative">
            <button
                onClick={() => navigate("/home")}
                className="absolute top-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
                <Home size={24} />
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">Editar Tarea</h1>
            
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
                        {prioridades.length > 0 ? (
                            prioridades.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))
                        ) : (
                            <option value="" disabled>No hay prioridades disponibles</option>
                        )}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    >
                       <option value="" disabled>Selecciona Estado</option>
                        {estados.length > 0 ? (
                            estados.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))
                        ) : (
                            <option value="" disabled>No hay estados</option>
                        )}
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

                <div className="flex gap-2 justify-end mt-6">
                    <button
                        type="submit"
                        className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        <Pencil size={18} className="mr-1" /> Actualizar
                    </button>

                    <button onClick={() => handleEliminar(id)}
                        type="button"
                        className="flex items-center bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        <Trash size={18} className="mr-1" /> Eliminar
                    </button>
                </div>
            </form>
        </main>
    );
};

export default EditTarea;
