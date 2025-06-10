import { Box, Button, TextField, useMediaQuery, useTheme, Autocomplete,  } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import React from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const TaskForm = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(max-width:600px)");
  const colors = tokens(theme.palette.mode);

  const handleFormSubmit = (values) => {
    console.log("Form Data:", values);
    alert('Form submitted successfully!');
  };

  const initialValues = {
    taskname: "",
    taskowner: "",
    description: "",
    priority: "",
  };

  const checkoutSchema = yup.object().shape({
    taskname: yup.string().required("Required"),
    taskowner: yup.string().required("Required"),
    description: yup.string().required("Required"),
    priority: yup.string().required("Required"),
  });

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      border: "1px solid #ccc",
      backgroundColor: "#ffffff",
      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
      "&:hover": {
        borderColor: "#999",
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
      },
      padding: "8px 12px",
      height: "50px",
    },
    "& .MuiInputLabel-root": {
      color: "#555",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  };

  const priorityOptions = ["Urgent", "High", "Low"];

  return (
    <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns={isNonMobile ? "repeat(1, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))"}
              sx={{
                "& > div": { gridColumn: isNonMobile ? "span 1" : undefined },
                backgroundColor: "#ffffff",
                marginTop: "20px"
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Task Name"
                name="taskname"
                value={values.taskname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.taskname && !!errors.taskname}
                helperText={touched.taskname && errors.taskname}
                sx={{ ...textFieldStyles, gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Task Owner"
                name="taskowner"
                value={values.taskowner}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.taskowner && !!errors.taskowner}
                helperText={touched.taskowner && errors.taskowner}
                sx={{ ...textFieldStyles, gridColumn: "span 1" }}
              />
          
          <Autocomplete
                fullWidth
                options={priorityOptions}
                value={values.priority || null}
                onChange={(event, newValue) => {
                  setFieldValue("priority", newValue || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Priority"
                    sx={textFieldStyles}
                    error={!!touched.priority && !!errors.priority}
                    helperText={touched.priority && errors.priority}
                  />
                )}
                sx={{
                  gridColumn: "span 1",
                  '& .MuiAutocomplete-listbox': {
                    maxHeight: '200px',
                    padding: 0,
                    '& .MuiAutocomplete-option': {
                      minHeight: '32px',
                      padding: '4px 16px',
                    }
                  }
                }}
                freeSolo
                forcePopupIcon
                popupIcon={<ArrowDropDownIcon />}
              />

                <TextField
                fullWidth
                variant="outlined"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                multiline
                rows={4} // You can adjust this number to change the height
                sx={{ 
                    ...textFieldStyles, 
                    gridColumn: "span 1",
                    "& .MuiOutlinedInput-root": {
                    ...textFieldStyles["& .MuiOutlinedInput-root"],
                    height: "auto", // Override the fixed height
                    minHeight: "120px", // Set a minimum height
                    alignItems: "flex-start" // Align text to top
                    }
                }}
                />

           
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                  transition: "0.3s",
                  backgroundColor: colors.blueAccent[700],
                  color: "#ffffff",
                  textTransform: "none",
                  "&:hover": { 
                    backgroundColor: colors.blueAccent[600], 
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)" 
                  },
                }}
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TaskForm;