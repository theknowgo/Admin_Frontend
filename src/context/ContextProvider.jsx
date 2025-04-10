import React, { useState } from "react";
import AdminContext from "./AdminContext.jsx";
import axios from "axios";

const AdminProvider = ({ children }) => {
  const adminBaseURL = import.meta.env.VITE_API_ADMIN_BASE_URL;
  const userBaseURL = import.meta.env.VITE_API_USERS_BASE_URL;

  const createLocalmate = async (localmate) => {
    try {
      const response = await axios.post(
        `${adminBaseURL}/api/localmate/`,
        localmate,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error(error.response.data.message);
      throw new Error(error.response.data.message || "An error occurred");
    }
  };

  const fetchAllLocalmates = async (currentPage, localmatesPerPage) => {
    try {
      const response = await axios.get(
        `${adminBaseURL}/api/localmate/?page=${currentPage}&limit=${localmatesPerPage}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const fetchHelpAndSupport = async (currentPage, ticketsPerPage) => {
    try {
      const response = await axios.get(
        `${userBaseURL}/api/v1/help/?page=${currentPage}&limit=${ticketsPerPage}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const fetchAllUsers = async (currentPage, usersPerPage) => {
    try {
      const response = await axios.get(
        `${userBaseURL}/api/user/?page=${currentPage}&limit=${usersPerPage}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const fetchTicketsByNumber = async (number) => {
    try {
      const response = await axios.get(
        `${userBaseURL}/api/v1/help/users/${number}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const closeTicket = async (ticketId) => {
    try {
      const response = await axios.patch(
        `${userBaseURL}/api/v1/help/${ticketId}`
      );
      console.log("Response:", response.data);
      if (response.data?.status === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        createLocalmate,
        fetchAllLocalmates,
        fetchHelpAndSupport,
        fetchTicketsByNumber,
        closeTicket,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
