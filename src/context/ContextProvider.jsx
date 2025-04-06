import React, { useState } from "react";
import AdminContext from "./AdminContext.jsx";
import axios from "axios";

const AdminProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const createLocalmate = async (localmate) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/localmate/`,
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
        `${baseURL}/api/localmate/?page=${currentPage}&limit=${localmatesPerPage}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <AdminContext.Provider value={{ createLocalmate, fetchAllLocalmates }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
