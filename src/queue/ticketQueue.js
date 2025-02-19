const { Queue, Worker } = require("bullmq");
const Redis = require("ioredis");

// Configure Redis connection
const connection = new Redis({
  host: "127.0.0.1", // Redis host
  port: 6379, // Redis port
  maxRetriesPerRequest: null, // Required for BullMQ
});

// Create the job queue
const ticketQueue = new Queue("ticketQueue", { connection });

// Worker to process escalations
const worker = new Worker(
  "ticketQueue",
  async (job) => {
    console.log(`Escalating ticket: ${job.data.ticketId}`);

    try {
      // Import escalateTicket function
      const ticketsV2 = require("../controllers/api/v2/tickets");

      // Create a mock req object for the worker
      const req = {
        body: {
          ticketId: job.data.ticketId,
          socketId: job.data.socketId,
        },
        headers: job.data.headers,  // Using passed headers
        user: job.data.user,        // Using passed user info
      };

      // Call escalation logic
      await ticketsV2.escalateTicket(req, {
        json: (response) => console.log("Escalation Response:", response),
      });
    } catch (error) {
      console.error("Error processing job:", error);
    }
  },
  { connection }
);

module.exports = { ticketQueue, worker };
