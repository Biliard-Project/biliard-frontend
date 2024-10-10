// Modal.js
export default function Modal({ children }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">{children}</div>
      </div>
    );
  }
  