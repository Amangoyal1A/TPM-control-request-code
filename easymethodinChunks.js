const sendRequests = async (tpm) => {
    // Calculate requests per second
    const requestsPerSecond = tpm / 60;
    // Calculate interval between each request in milliseconds
    const interval = 1000 / requestsPerSecond;
    // Number of requests to send in each batch
    const batchSize = 10;
  
    let startIndex = 0;
    let index = requests.length;
  
    // Helper function to pause execution for the given interval
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    // Send requests in batches
    while (index > 0) {
      const batch = requests.slice(startIndex, startIndex + batchSize);
  
      if (batch.length === 0) {
        return;
      }
  
      for (let i = 0; i < batch.length; i++) {
        const queuedBatch = batch[i];
        if (queuedBatch) {
          makeRequest(queuedBatch);
        }
        await wait(interval);
      }
  
      startIndex += batchSize;
      index -= batchSize;
    }
  };
  
  // Set the desired Transactions Per Minute (TPM)
  const tpm = 50;
  sendRequests(tpm);
  