// @ts-nocheck
export const createMockMedusaService = (overrides = {}) => {
  const chainable = () => {
    const chain = {
      primaryKey: () => chain,
      nullable: () => chain,
      default: () => chain,
    }
    return chain
  }

  return {
    MedusaService: () =>
      class MockMedusaBase {
        constructor() {
          Object.assign(this, overrides)
        }
      },
    model: {
      define: () => ({
        indexes: () => ({}),
      }),
      id: chainable,
      text: chainable,
      number: chainable,
      json: chainable,
      boolean: chainable,
      dateTime: chainable,
      bigNumber: chainable,
      float: chainable,
      array: chainable,
      enum: () => chainable(),
      hasOne: () => chainable(),
      hasMany: () => chainable(),
      belongsTo: () => chainable(),
      manyToMany: () => chainable(),
    },
  }
}
