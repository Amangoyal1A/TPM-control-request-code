const axios = require("axios");
const { requests } = require("./requestpayload");



const requestData = (vehicleRegistrationNumber) => ({
  mode: "sync",
  data: {
    vehicle_registration_number: vehicleRegistrationNumber,
    challan: true,
    consent: "Y",
    consent_text: "RC Lite is Verified by author",
  },
  group_id: "red1f9a8-882b-46f2-b5fb-99b2610e14c3",
});

const makeRequest = async (vehicleRegistrationNumber) => {
  console.log(
    `Making request  for vehicle registration number:`,
    vehicleRegistrationNumber.vehicle_registration_number
  );

  try {
    const response = await axios.post(
      url,
      requestData(vehicleRegistrationNumber.vehicle_registration_number),
      { headers }
    );
  } catch (error) {
    // Log error details for debugging purposes
    console.error(`Problem with request  ${error.message}`);
  }
};

const sendRequests = async (tpm) => {
  // Calculate requests per second
  const requestsPerSecond = tpm / 60;
  // Calculate interval between each request in milliseconds
  const interval = 1000 / requestsPerSecond;
  // Number of requests to send in each batch
  const batchSize = 10;

  let startIndex = 0;
  let index = requests.length;

  // Send requests in batches
  while (index !== 0) {
    const batch = requests.slice(startIndex, startIndex + batchSize);

    if (batch.length === 0) {
      return;
    }
    let count = 0;
    while (count !== batch.length) {
      const queuedBatch = batch.shift();
      if (!queuedBatch) {
        break;
      }
      const intervalId = setInterval(() => {
        makeRequest(queuedBatch);
        clearInterval(intervalId);
      }, interval);

      count++;
    }

    startIndex += batchSize;

    index--;
  }
};

// Set the desired Transactions Per Minute (TPM)
const tpm = 50;
sendRequests(tpm);
