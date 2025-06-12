const addDecimals = (num) => {
    return (Math.round(parseFloat(num) * 100) / 100).toFixed(2);
};

export function calcPrices(orderItems) {
    // Calculate the items price
    const itemsPrice = addDecimals(
        orderItems.reduce((acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity), 0)
    );

    // Calculate the shipping price
    const shippingPrice = addDecimals(itemsPrice >= 500 ? 0 : 50);

    // Calculate the tax price
    const taxPrice = addDecimals(0 * itemsPrice);

    // Calculate the total price
    const totalPrice = addDecimals(
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    );

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}