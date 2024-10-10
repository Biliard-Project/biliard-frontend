import Link from "next/link";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* white overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-darkgreen text-white z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div>
          <div className="flex gap-5 items-center px-6 py-3">
            <img
              src="/assets/sidebar.png"
              className="img-sidebar cursor-pointer"
              onClick={onClose}
            />
            <div className="text-2xl font-semibold">BiliarD</div>
          </div>
          <hr className="border-t-1 w-full border-white -mt-0.5 mb-4" />

          {/* feature sidebar */}
          <div className="py-6 px-8">
            <ul className="text-lg ">
              <li className="mb-7">
                <Link href="/" className="flex items-center">
                  <img src="/assets/home.png" className="inline-block mr-5" />
                  Home
                </Link>
              </li>
              <li className="mb-7">
                <Link href="/monitoring" className="flex items-center">
                  <img
                    src="/assets/monitoring.png"
                    className="inline-block mr-5"
                  />
                  Monitoring
                </Link>
              </li>
              <li className="mb-7">
                <Link href="/weekly-report" className="flex items-center">
                  <img
                    src="/assets/weekly-report.png"
                    className="inline-block mr-5"
                  />
                  Weekly Report
                </Link>
              </li>
              <li>
                <Link href="/data-pasien" className="flex items-center">
                  <img src="/assets/data.png" className="inline-block mr-5" />
                  Data Pasien
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
