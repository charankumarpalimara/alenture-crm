import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, useMediaQuery
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const CrmForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  // ✅ **Validation Schema**
  const checkoutSchema = yup.object().shape({
    status: yup.string().required("Status is required"),
    priority: yup.string().required("Priority is required"),
    ticketType: yup.string().required("Ticket Type is required"),
    department: yup.string().required("Department is required"),
    assignTo: yup.string().required("Assignee is required"),
    subject: yup.string().required("Subject is required"),
    experienceDetails: yup.string().required("Experience Details are required"),
    attachments: yup.mixed().required("File attachment is required"),
  });

  // ✅ **Initial Values**
  const initialValues = {
    status: "",
    priority: "",
    ticketType: "",
    department: "",
    assignTo: "",
    subject: "",
    experienceDetails: "",
    attachments: [],
  };

  // ✅ **Dropdown Component**
  const DropdownField = ({ label, name, value, handleChange, options }) => {
    return (
      <FormControl fullWidth sx={{ marginBottom: "15px" }}>
        <InputLabel shrink={!!value}>{label}</InputLabel> {/* Shrink label when a value is selected */}
        <Select
          name={name}
          value={value}
          onChange={handleChange}
          label={label} // Pass the label to the Select component
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // ✅ **Styled TextField Component**
  const StyledTextField = ({ label, name, value, handleChange, handleBlur, error, multiline = false, rows = 1 }) => {
    return (
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!error}
        helperText={error}
        multiline={multiline}
        rows={rows}
        sx={{ marginBottom: "15px" }}
      />
    );
  };

  return (
    <Box m="20px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
              <Box sx={{ gap: 1 }}>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }} mb={1}>Customer :</Typography>
                <DropdownField  name="status" value={values.status} handleChange={handleChange} options={[
                  "charan", "satya", "jai ram", "nani"
                ]} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }} mb={1}>Priority :</Typography>
                <DropdownField  name="priority" value={values.priority} handleChange={handleChange} options={[
                  "Low", "Medium", "High", "Urgent"
                ]} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }} mb={1}>Ticket Type :</Typography>
                <DropdownField  name="ticketType" value={values.ticketType} handleChange={handleChange} options={[
                  "Issue", "Request", "Query"
                ]} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }} mb={1}>Department :</Typography>
                <DropdownField  name="department" value={values.department} handleChange={handleChange} options={[
                  "Support", "Sales", "Technical", "HR"
                ]} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }} mb={1}>Assign To :</Typography>
                <DropdownField  name="assignTo" value={values.assignTo} handleChange={handleChange} options={[
                  "User1", "User2", "User3"
                ]} />
              </Box>
            </Box>

            <Box mt={3} mb={2}>
              <Typography fontSize="16px" fontWeight="bold" mb={1}>Subject</Typography>
            </Box>
            <StyledTextField
              // label="Subject"
              name="subject"
              value={values.subject}
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={touched.subject && errors.subject}
            />
            <Box mt="24px">
              <Box mt={3} mb={2}>
                <Typography fontSize="16px" fontWeight="bold" mb={1}>Request Details</Typography>
              </Box>
              <StyledTextField
                // label="Details of your experience"
                name="experienceDetails"
                value={values.experienceDetails}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={touched.experienceDetails && errors.experienceDetails}
                multiline
                rows={4}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="h6" fontWeight="bold" mb={1}>Attachments</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                width: isMobile ? "100%" : "30%",
                position: "relative",
                cursor: "pointer",
                // backgroundColor: "#f9f9f9",
                marginY: "15px"
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <Box sx={{ width: "17%" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="40"
                  height="32"
                  stroke="gray"
                  fill="white"
                  strokeWidth="14"
                >
                  <path d="M64 480H296.2C305.1 491.8 317.3 502.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H220.1C232.8 0 245.1 5.057 254.1 14.06L369.9 129.9C378.9 138.9 384 151.2 384 163.9V198.6C372.8 201.8 362.1 206 352 211.2V192H240C213.5 192 192 170.5 192 144V32H64C46.33 32 32 46.33 32 64V448C32 465.7 46.33 480 64 480V480zM347.3 152.6L231.4 36.69C229.4 34.62 226.8 33.18 224 32.48V144C224 152.8 231.2 160 240 160H351.5C350.8 157.2 349.4 154.6 347.3 152.6zM448 351.1H496C504.8 351.1 512 359.2 512 367.1C512 376.8 504.8 383.1 496 383.1H448V431.1C448 440.8 440.8 447.1 432 447.1C423.2 447.1 416 440.8 416 431.1V383.1H368C359.2 383.1 352 376.8 352 367.1C352 359.2 359.2 351.1 368 351.1H416V303.1C416 295.2 423.2 287.1 432 287.1C440.8 287.1 448 295.2 448 303.1V351.1zM576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM432 256C370.1 256 320 306.1 320 368C320 429.9 370.1 480 432 480C493.9 480 544 429.9 544 368C544 306.1 493.9 256 432 256z" />
                </svg>
              </Box>
              <Typography sx={{ fontSize: "16px", color: "#000000" }}>Attach Files</Typography>

              {/* Hidden File Input */}
              <input
                id="fileInput"
                type="file"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    console.log("Selected file:", file.name);
                  }
                }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="24px">
              <Button type="submit" variant="contained" sx={{ padding: "14px 24px", fontSize: "14px", fontWeight: "bold", borderRadius: "3px", boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)", color: "#ffffff", backgroundColor: "#3e4396", "&:hover": "#535ac8", textTransform: "none" }}>
                Allot Experience
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CrmForm;