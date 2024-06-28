const axios = require("axios");
const Bottleneck = require("bottleneck");
const { requests } = require("./requestpayload");


// Function to calculate minTime based on TPM
const calculateMinTime = (tpm) => {
  const tps = tpm / 60;
  return 1000 / tps;
};

// Example usage: Change this value for different TPM rates
const tpm = 180; // Set this to 20, 30, or any other desired TPM
const minTime = calculateMinTime(tpm);

const limiter = new Bottleneck({
  maxConcurrent: 1, // Number of concurrent requests
  minTime: minTime, // Minimum time between requests (in milliseconds)
});


console.log(`For ${tpm} TPM, the minTime is ${minTime} milliseconds.`);

// Function to make a POST request with headers
const makePostRequest = async (data) => {
  const config = {
    headers: {
    },
  };

  try {
    const response =  await axios.post(
      "",
      data,
      config
    );
    console.log(`Response status`, response.status);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

// Wrap the request function with the limiter
const limitedPostRequest = limiter.wrap(makePostRequest);

// Function to handle multiple requests and log latency
const handleRequests = async (requests) => {
  const startTime = Date.now();

  try {

    const promises = requests.map((data) =>
      limitedPostRequest({
        mode: "sync",
        data: {
          vehicle_registration_number: data.vehicle_registration_number,
          challan: true,
          consent: "Y",
          consent_text: "RC Lite is Verified by author",
        },
        group_id: "f4ce8c57-3c5f-44da-a574-b3b3b7522560",
      })
    );
    const results = await Promise.all(promises);

    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`All requests completed in ${latency} milliseconds.`);

    return results;
  } catch (error) {
    console.error("An error occurred while handling requests:", error);
    throw error;
  }
};



handleRequests(requests)
  .then((results) => {
    console.log("All requests have been handled successfully:", results);
  })
  .catch((error) => {
    console.error("An error occurred while handling requests:", error);
  });
