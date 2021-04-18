const { ApolloServer, gql } = require("apollo-server");
const { Bitcoin, sequelize } = require("./models");

const port = process.env.PORT || "4000";

const typeDefs = gql`
  type Bitcoin {
    name: String!
    symbol: String
    price: String!
    imageUrl: String!
    favorite: Boolean
  }
  type Query {
    bitcoin(offset: Int, limit: Int): [Bitcoin]
    favorites: [Bitcoin]
  }
  type Mutation {
    addCoin(symbol: String!): Bitcoin
    removeCoin(symbol: String!): Bitcoin
  }
`;

const mapAttributes = (model, { fieldNodes }) => {
  // get the fields of the Model (columns of the table)
  const columns = new Set(Object.keys(model.rawAttributes));
  const requested_attributes = fieldNodes[0].selectionSet.selections.map(
    ({ name: { value } }) => value
  );
  return requested_attributes.filter((attribute) => columns.has(attribute));
};

const resolvers = {
  Query: {
    bitcoin: async (_, { offset = 0, limit = 10 }, context, info) => {
      const bitcoin = await Bitcoin.findAll({
        limit,
        offset,
        order: [["id", "ASC"]],
        attributes: mapAttributes(Bitcoin, info),
      });
      return bitcoin;
    },
    favorites: async (parent, args, context, info) => {
      const bitcoin = await Bitcoin.findAll({
        where: { favorite: true },
        attributes: mapAttributes(Bitcoin, info),
      });
      return bitcoin;
    },
  },
  Mutation: {
    addCoin: async (_, { symbol }, context, info) => {
      const [updated] = await Bitcoin.update(
        { favorite: true },
        {
          where: { symbol: symbol },
        }
      );
      if (updated) {
        const updatedCoin = await Bitcoin.findOne({
          where: { symbol: symbol },
          attributes: mapAttributes(Bitcoin, info),
        });
        return updatedCoin;
      }
      throw new Error("Bitcoin not updated");
    },
    removeCoin: async (_, { symbol }, context, info) => {
      const [updated] = await Bitcoin.update(
        { favorite: false },
        { where: { symbol: symbol } }
      );
      if (updated) {
        const updatedCoin = await Bitcoin.findOne({
          where: { symbol: symbol },
          attributes: mapAttributes(Bitcoin, info),
        });
        return updatedCoin;
      }
      throw new Error("Bitcoin not updated");
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

server.listen({ port }, () =>
  console.log("Server running at http://figureitout")
);
