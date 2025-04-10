import React, { useState, useEffect, useContext } from "react";
import AdminContext from "../context/AdminContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function HelpandSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userIDFilter, setUserIDFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalUserID, setModalUserID] = useState("");
  const { fetchHelpAndSupport, fetchTicketsByNumber, closeTicket } =
    useContext(AdminContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHelpAndSupport(currentPage, ticketsPerPage);

        setTickets(data.data);
        setFilteredTickets(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, ticketsPerPage]);

  useEffect(() => {
    const results = tickets.filter((ticket) => {
      const matchesSearchTerm =
        String(ticket._id).includes(searchTerm) ||
        String(ticket.title).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "" || ticket.status === statusFilter;

      return matchesSearchTerm && matchesStatus;
    });
    setFilteredTickets(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tickets]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleUserIDFilter = async () => {
    await fetchTicketsByNumber(modalUserID)
      .then((data) => {
        setFilteredTickets(data.data);
        setModalUserID("");
        toast.success(data.message);
      })
      .catch(() => {
        toast.error("Error fetching tickets by user number");
      });

    setIsFilterModalOpen(false);
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
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
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-400"
          }`}
        >
          {number}
        </button>
      </li>
    ));
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      // Call the API or function to close the ticket
      await closeTicket(ticketId).then((response) => {
        if (response) {
          toast.success("Ticket closed successfully.");
        } else {
          toast.error("Failed to close the ticket.");
        }
      });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: "Closed" } : ticket
        )
      );
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close the ticket.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Loading Tickets...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Help and Support Tickets
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by ID or Title"
          className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
        />

        <select
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                ID
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                User ID
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Closed At
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Open/Close
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{ticket._id}</td>
                <td className="border px-4 py-2">{ticket.userID}</td>
                <td className="border px-4 py-2">{ticket.title}</td>
                <td className="border px-4 py-2">{ticket.description}</td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {ticket.closedAt
                    ? new Date(ticket.closedAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {ticket.status === "Closed" ? (
                    <button
                      onClick={() => handleCloseTicket(ticket._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 cursor-pointer"
                    >
                      Open Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCloseTicket(ticket._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 cursor-pointer"
                    >
                      Close Ticket
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <ul className="flex items-center space-x-2">
          {currentPage > 1 && (
            <li>
              <button
                onClick={prevPage}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-blue-400"
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
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-400"
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Filter by User Number</h2>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={modalUserID}
              onChange={(e) => setModalUserID(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUserIDFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default HelpandSupport;
