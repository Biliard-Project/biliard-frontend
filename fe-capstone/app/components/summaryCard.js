const SummaryCard = ({ children }) => {
    return (
      <div className="w-full text-xl leading-9 lg:w-3/4 bg-yellow p-7 rounded-xl shadow-lg text-black">
        <h3 className="text-2xl font-semibold text-darkgreen mb-4">Summary</h3>
        {children}
      </div>
    );
  };
  
  export default SummaryCard;
  