const axios = require("axios");
const { requests } = require("./requestpayload");




// Function to set the global variable
function stopRunner(newValue) {
  running = newValue;
  console.log(`Running state set to: ${running}`);
}

module.exports = {
  stopRunner,
};

const requestData = (vehicleRegistrationNumber) => ({
  mode: "sync",
  data: {
    vehicle_registration_number: vehicleRegistrationNumber,
    challan: true,
    consent: "Y",
    consent_text: "RC Lite is Verified by author",
  },
  group_id: "ppd1f9a8-882b-46f2-b5fb-99b2610e14c3",
});

const makeRequest = async (vehicleRegistrationNumber) => {
  console.log(
    `Making request  for vehicle registration number:`,
    vehicleRegistrationNumber.vehicle_registration_number
  );
  console.log("running state", running);
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
  // Helper function to send a batch of requests
  const sendBatch = async (batch) => {
    for (let i = 0; i < batch.length; i++) {
      const queuedBatch = batch[i];
      if (queuedBatch) {
        makeRequest(queuedBatch);
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  };

  // Send requests in batches
  while (index !== 0 && running) {
    const batch = requests.slice(startIndex, startIndex + batchSize);

    if (batch.length === 0) {
      return;
    }

    console.log(`here next  ${batchSize} batches--->`);
    await sendBatch(batch);

    startIndex += batchSize;
    index -= batchSize;
  }
};

// Set the desired Transactions Per Minute (TPM)
const tpm = 100;
sendRequests(tpm);
