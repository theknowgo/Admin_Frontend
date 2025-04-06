import React, { useState, useEffect, useContext } from "react";
import AdminContext from "../context/AdminContext";

function LocalmateList() {
  const [localmates, setLocalmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [localmatesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // Keep track of total pages from API
  const [filteredLocalmates, setFilteredLocalmates] = useState([]);
  const { fetchAllLocalmates } = useContext(AdminContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllLocalmates(currentPage, localmatesPerPage);

        setLocalmates(data.users);
        setFilteredLocalmates(data.users);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, localmatesPerPage]); // Re-fetch data when currentPage or localmatesPerPage changes

  useEffect(() => {
    const results = localmates.filter(
      (localmate) =>
        String(localmate._id).includes(searchTerm) ||
        String(localmate.contactNumber).includes(searchTerm)
    );
    setFilteredLocalmates(results);
    setCurrentPage(1); // Reset to first page after search
  }, [searchTerm, localmates]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastLocalmate = currentPage * localmatesPerPage;
  const indexOfFirstLocalmate = indexOfLastLocalmate - localmatesPerPage;
  const currentLocalmates = filteredLocalmates.slice(
    indexOfFirstLocalmate,
    indexOfLastLocalmate
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    }
    if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <li key={number} className="px-2 py-1">
        <button
          onClick={() => paginate(number)}
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-300"
          }`}
        >
          {number}
        </button>
      </li>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Loading Localmates...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Localmate List</h1>

      <input
        type="text"
        placeholder="Search by ID or Phone"
        className="w-full px-4 py-2 border rounded mb-4"
        onChange={handleSearch}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Ban Count</th>
            </tr>
          </thead>
          <tbody>
            {currentLocalmates.map((localmate) => (
              <tr key={localmate._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{localmate._id}</td>
                <td className="border px-4 py-2">{`${localmate.firstName} ${localmate.lastName}`}</td>
                <td className="border px-4 py-2">{localmate.contactNumber}</td>
                <td className="border px-4 py-2">
                  {localmate.isPermanentlyBanned ? "Banned" : "Active"}
                </td>
                <td className="border px-4 py-2">{localmate.banCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <ul className="flex items-center space-x-2">
          {currentPage > 1 && (
            <li>
              <button
                onClick={prevPage}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-blue-300"
              >
                Previous
              </button>
            </li>
          )}
          {renderPageNumbers()}
          <li>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-300"
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LocalmateList;
