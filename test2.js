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
  group_id: "28d1f9a8-882b-46f2-b5fb-99b2610e14c1",
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

const calculateInterval = (tpm) => {
  const requestsPerSecond = tpm / 60;
  return 1000 / requestsPerSecond;
};

const sendRequests = (tpm) => {
  const interval = calculateInterval(tpm);
  const vehicleRegistrationNumbers = requests;

  let count = 0;
  const intervalId = setInterval(() => {
    if (count < vehicleRegistrationNumbers.length) {
      makeRequest(vehicleRegistrationNumbers[count], count);
      count++;
    } else {
      // Log when the interval is being cleared
      console.log("All requests sent. Clearing interval.");
      clearInterval(intervalId);
    }
  }, interval);
  console.log(intervalId)
};

// Set the desired Transactions Per Minute (TPM)
const tpm = 1000;
sendRequests(tpm);
