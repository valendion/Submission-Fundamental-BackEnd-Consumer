require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const listener = new Listener(new PlaylistsService(), new MailSender());

  const conn = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await conn.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  await channel.consume(
    'export:playlists',
    (message) => listener.listen(message),
    { noAck: true }
  );
};

init();
