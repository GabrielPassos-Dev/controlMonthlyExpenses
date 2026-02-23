import { Link } from "react-router-dom";

export default function ViwHistoryFinancial(){
    return(
        <div className="bg-slate-800 p-4 rounded-xl shadow-md w-80 flex flex-col gap-4 justify-center items-center">
            <h1>Ver historico financeiro</h1>
             <Link to={'/history'} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition w-full text-center">ver</Link>
        </div>
    )
}