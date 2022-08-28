const pubsub = require("./pubsub");

const TOPICS = {
  ROOM: "room_",
};

const query = async ({ token = "", input }) => {
  const { got } = await import("got");

  const { result } = await got
    .post("http://localhost/inventory/api", {
      json: {
        ...input,
      },
      headers: {
        Cookie: `PHPSESSID=${token}`,
      },
    })
    .json();

  return result;
};

const resolvers = {
  Mutation: {
    async updateInventory(_, { data }, { token }) {
      const { equipment } = await query({
        input: { type: "entry", action: "updateEquipment", input: data },
        token,
      });

      pubsub.publish(TOPICS.ROOM + equipment.location_id, { room: equipment });

      return equipment;
    },
    async login(_, { data }) {
      const { got } = await import("got");

      const { result } = await got
        .post("http://localhost/inventory/api", {
          json: {
            type: "user",
            action: "login",
            input: data,
          },
          headers: {
            Cookie: {
              PHPSESSID: "i523r6lsc6p8s1iv76uca123ft",
            },
          },
        })
        .json();

      return { message: result.message, type: result.type };
    },
  },
  Query: {
    async initialData(_, __, { token }) {
      const [rooms, { assignments }] = await Promise.all([
        query({
          input: { type: "entry", action: "rooms" },
          token,
        }),
        query({
          input: { type: "entry", action: "user" },
          token,
        }),
      ]);

      return { rooms, assignments };
    },
    async room(_, { room }, { token }) {
      const rooms = await query({
        input: { type: "entry", action: "rooms", input: { room } },
        token,
      });

      return rooms[0].equipments;
    },
    async scan(_, { id, roomID }, { token }) {
      const { equipment } = await query({
        input: { type: "entry", action: "equipment", input: { id, roomID } },
        token,
      });

      return equipment;
    },
  },
  Subscription: {
    room: {
      subscribe: (_, { roomID }) => pubsub.asyncIterator(TOPICS.ROOM + roomID),
    },
  },
};

module.exports = {
  resolvers,
};
