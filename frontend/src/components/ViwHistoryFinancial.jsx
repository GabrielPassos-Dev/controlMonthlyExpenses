import { Link } from "react-router-dom";

export default function ViwHistoryFinancial(){
    return(
        <div className="bg-white p-4 rounded-xl shadow-md w-80 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">Ver historico</h1>
             <Link to={'/history'} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition text-center">Ver</Link>
        </div>
    )
}