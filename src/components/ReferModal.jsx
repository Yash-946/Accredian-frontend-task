// src/components/ReferModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from 'react-hot-toast';


Modal.setAppElement("#root");

const ReferModal = ({ isOpen, onRequestClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const animatedComponents = makeAnimated();
  const menuPortalTarget = document.getElementById('root');

  const options = [
    { value: "fullstack course", label: "Fullstack" },
    { value: "Frontend course", label: "Frontend" },
    { value: "Backend course", label: "Backend" },
    { value: "DevOps course", label: "DevOps" },
    { value: "Web3 course", label: "Web3" },
  ];

  const handleSelectChange = (selectedOptions) => {
    setSelectedCourses(selectedOptions);
  };

  const resetForm = () => {
    reset(); // Reset the form using react-hook-form's reset function
    setSelectedCourses([]); // Clear the selected courses
  };

  const handleClose = () => {
    resetForm(); // Reset the form and clear the state
    onRequestClose(); // Call the provided onRequestClose function to close the modal
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = {
      ...data,
      courses: selectedCourses.map((course) => course.value),
    };
    // console.log(formData);

    try {
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/referdata`, formData);
      const data = response.data;
      // console.log(data.status);

      if(!data.status){
        toast.error("Check your inputs")
      }
      toast.success('Your referral sent successfully')

    } catch (error) {
      toast.error("Something went wrong")
    } 
    setLoading(false)
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Refer a Friend"
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto my-10"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Refer a Friend</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="w-block text-gray-700 mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className={classNames("w-full p-2 border rounded", {
              "border-red-500": errors.name,
            })}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="w-block text-gray-700 mb-2" htmlFor="referredTo">
            Your Friend's Name
          </label>
          <input
            type="text"
            id="referredTo"
            {...register("referredTo", { required: "Name is required" })}
            className={classNames("w-full p-2 border rounded", {
              "border-red-500": errors.referredTo,
            })}
            placeholder="Enter your Friend's name"
          />
          {errors.referredTo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.referredTo.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Your Friend's Email
          </label>
          <input
            type="email"
            id="email"
            required
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className={classNames("w-full p-2 border rounded", {
              "border-red-500": errors.email,
            })}
            placeholder="Enter your friend's email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Select courses */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Refer Courses
          </label>

          <Select
            isMulti
            required
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options}
            onChange={handleSelectChange}
            maxMenuHeight={130}
            menuPlacement="auto"
            menuPortalTarget={menuPortalTarget}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                padding: 2,
              }),
            }}
          />
        </div>

        <div className="flex">
          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              loading
            </button>
          ) : (
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Referral
            </button>
          )}

          <button
            onClick={handleClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReferModal;
