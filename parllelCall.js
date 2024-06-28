const axios = require("axios");
const { requests } = require("./requestpayload");

const url = "";

const headers = {
 
};

const requestData = (vehicleRegistrationNumber) => ({
  mode: "sync",
  data: {
    vehicle_registration_number: vehicleRegistrationNumber,
    challan: true,
    consent: "Y",
    consent_text: "RC Lite is Verified by author",
  },
  group_id: "",
});

const makeRequest = async (vehicleRegistrationNumber, count) => {
  console.log(`Making request ${count + 1} for vehicle registration number:`, vehicleRegistrationNumber);

  try {
    const response = await axios.post(
      url,
      requestData(vehicleRegistrationNumber.vehicle_registration_number),
      { headers }
    );

    // Log response for debugging purposes
    console.log(`Response for request ${count + 1}: `, response.data);
  } catch (error) {
    // Log error details for debugging purposes
    console.error(`Problem with request ${count + 1}: ${error.message}`);
  }
};

const sendRequestsInParallel = () => {
  const vehicleRegistrationNumbers = requests;

  // Create an array of promises
  const requestPromises = vehicleRegistrationNumbers.map((vehicle, index) =>
    makeRequest(vehicle, index)
  );

  // Use Promise.all to send all requests in parallel
  Promise.all(requestPromises)
    .then(() => {
      console.log("All requests sent and completed.");
    })
    .catch((error) => {
      console.error("Error in sending requests:", error);
    });
};

// Initiate all requests in parallel
sendRequestsInParallel();
