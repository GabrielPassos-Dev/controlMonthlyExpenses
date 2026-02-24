export default function FinancialList({list}) {
  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-md w-80 flex flex-col gap-4 justify-center items-center">
      {list.map((currentItem) => (
        <div key={currentItem.id}>
          <p>{currentItem.salary}</p>
        </div>
      ))}

        
    </div>
  );  
}
