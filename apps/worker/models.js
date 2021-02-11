module.exports.Task = {
  schema: {
    id: ({ method }) => ({
      type: 'integer',
      required: method === 'GET',
      forbidden: method === 'POST'
    }),
    worker: 'string',
    data: 'object',
    status: {
      type: 'string',
      values: ['waiting', 'completed', 'failed']
    },
    error: {
      type: 'string',
      required: false
    },
    completedAt: 'timestamp',
    timestamps: true // https://knexjs.org/#Schema-timestamps
  },

  methods: {
  }
}
