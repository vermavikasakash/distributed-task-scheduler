const amqp = require("amqplib");

const TASK_QUEUE = process.env.RABBITMQ_TASK_QUEUE || "tasks";
const RETRY_QUEUE = `${TASK_QUEUE}.retry`;
const DEAD_LETTER_EXCHANGE =
  process.env.RABBITMQ_DEAD_LETTER_EXCHANGE || `${TASK_QUEUE}.dlx`;
const RETRY_DELAY_MS = Number(process.env.TASK_RETRY_DELAY_MS || 5200);

let connection;
let channel;

const connectRabbitMQ = async () => {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  channel = await connection.createConfirmChannel();

  await channel.assertExchange(DEAD_LETTER_EXCHANGE, "direct", {
    durable: true,
  });
  await channel.assertQueue(TASK_QUEUE, { durable: true });
  await channel.bindQueue(TASK_QUEUE, DEAD_LETTER_EXCHANGE, TASK_QUEUE);
  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": DEAD_LETTER_EXCHANGE,
      "x-dead-letter-routing-key": TASK_QUEUE,
      "x-message-ttl": RETRY_DELAY_MS,
    },
  });

  connection.on("close", () => {
    connection = undefined;
    channel = undefined;
  });

  console.log(`Connected to RabbitMQ. Queue: ${TASK_QUEUE}`);
  return channel;
};

const publishTask = async (task, options = {}) => {
  const rabbitChannel = await connectRabbitMQ();
  const queue = options.retry ? RETRY_QUEUE : TASK_QUEUE;

  rabbitChannel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), {
    persistent: true,
    contentType: "application/json",
    headers: {
      retryCount: options.retryCount || 0,
    },
  });

  await rabbitChannel.waitForConfirms();
};

const closeRabbitMQ = async () => {
  if (channel) {
    await channel.close();
  }

  if (connection) {
    await connection.close();
  }

  channel = undefined;
  connection = undefined;
};

module.exports = {
  TASK_QUEUE,
  RETRY_QUEUE,
  DEAD_LETTER_EXCHANGE,
  connectRabbitMQ,
  publishTask,
  closeRabbitMQ,
};
