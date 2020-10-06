class Orderbook {
  constructor(name) {
    this.name = name
    this.orders = [];
  }

  //submit new order
  submit(payload) {
    const existingOrder = this.orders.find(existingOrder => existingOrder.id === payload.id)
    if(existingOrder) {
      const newDetails = this.handleMatchingOrder(payload, existingOrder)
      this.orders.forEach(order => {
        if(order === order.id) {
          order.details = newDetails;
        }
      })
      console.log(this.orders)
    } else {
      this.orders.push(payload)
    }
  }

  //update existing order with new details from the incoming payload
  handleMatchingOrder(existingOrder, order) {
    const newDetails = Object.assign(existingOrder.details, order.details)
    return newDetails
  }

  //distribute order to other running instances
  distributeOrder(otherInstances) {
    const recentlyAddedOrder = this.orders[this.orders.length - 1]
    otherInstances.forEach(instance => {
      if(instance.name != this.name) {
        instance.submit(recentlyAddedOrder)
      }
    })
  }
}

module.exports = Orderbook;
