import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminContext from "../context/AdminContext";

function Localmate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { createLocalmate } = useContext(AdminContext);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("contactNumber", data.phone);
      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append("image", data.profilePicture[0]);
      } else {
        throw new Error("Profile picture is missing or invalid");
      }

      await createLocalmate(formData); // Call the API function
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
      console.error("Error creating localmate:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const errorStyles = "text-red-500 text-xs italic";

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center overflow-hidden">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Create Localmate Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", {
                required: "First name is required",
                maxLength: {
                  value: 50,
                  message: "First name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "First name should contain only letters",
                },
              })}
              className={inputStyles}
            />
            {errors.firstName && (
              <span className={errorStyles}>{errors.firstName.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", {
                required: "Last name is required",
                maxLength: {
                  value: 50,
                  message: "Last name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Last name should contain only letters",
                },
              })}
              className={inputStyles}
            />
            {errors.lastName && (
              <span className={errorStyles}>{errors.lastName.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid Indian phone number",
                },
              })}
              className={inputStyles}
            />
            {errors.phone && (
              <span className={errorStyles}>{errors.phone.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="profilePicture"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              id="profilePicture"
              {...register("profilePicture", {
                required: "Profile picture is required",
                validate: {
                  singleFile: (value) =>
                    value.length === 1 || "Only one file can be uploaded",
                  fileSize: (value) =>
                    value[0]?.size < 5000000 ||
                    "File size should be less than 5MB",
                  fileType: (value) =>
                    ["image/jpeg", "image/png", "image/jpg"].includes(
                      value[0]?.type
                    ) || "Only JPEG, PNG, and JPG formats are supported",
                },
              })}
              className={inputStyles}
            />
            {errors.profilePicture && (
              <span className={errorStyles}>
                {errors.profilePicture.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Localmate;
