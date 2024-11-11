const SummaryCard = ({ children }) => {
    return (
      <div className="w-full lg:w-3/4 bg-yellow p-4 rounded-xl shadow-md text-black">
        <h3 className="text-lg font-semibold text-darkgreen mb-4">Summary</h3>
        {children}
      </div>
    );
  };
  
  export default SummaryCard;
  