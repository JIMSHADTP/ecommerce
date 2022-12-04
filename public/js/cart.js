
$(document).ready(async () => {
    try {
        const response = await axios.get("/cartItemCount")
        const itemCount = response.data.itemCount ? response.data.itemCount : 0
        $(".cart-item-count").html(itemCount)
    } catch (err) {
        console.error(err);
    }
})

async function deleteItem(productId, cartCount) {
    try {
        const response = await axios({
            method: "delete",
            url: `/deleteCartItem/${productId}`,
            data: {
                cartCount: parseInt(cartCount)
            }
        })
        let itemCount = Number($(".cart-item-count").html())
       
        itemCount -= cartCount
        if (itemCount != 0) {
            document.getElementById(`cartItem-${productId}`).remove()
            $(".cart-item-count").html(itemCount)

        } else {

        } toastr.error('cart item deleted')
        window.location.reload()
        $(`#cartItem-${productId}`).load(location.href + ` #cartItem-${productId}>*`, "");
    } catch (error) {
        console.error(error)
    }
}

async function addToCart(productId, productName, price, quantity, offerPrice) {

    let itemQty = document.getElementById(`itemQty-${productId}`)?.value
    if (quantity == -1 && itemQty == 1) {
        deleteItem(productId, 1);
    }
    else {
        try {
         
            const response = await axios({
                method: "post",
                url: `/addtocart/${productId}`,
                data: {
                    name: productName,
                    price: Number.parseFloat(price),
                    quantity: Number.parseInt(quantity),
                    offerPrice: Number.parseFloat(offerPrice),
                }
            })
       
            if (response.status == 200) {
                toastr.options = { "positionClass": "toastr-bottom-right" }
                toastr.error('this product is out of stock')

            } else {
                if (quantity == -1) {

                }
                let itemCount = Number($(".cart-item-count").html())
                itemCount += Number.parseInt(quantity)
                $(".cart-item-count").html(itemCount)
            }
            toastr.success('cart item quantity updated')
            $(`#cartItem-${productId}`).load(location.href + ` #cartItem-${productId}>*`, "");
            $(`#cartItemtotal`).load(location.href + ` #cartItemtotal>*`, "");
        } catch (err) {
            window.location = '/login'
            console.error(err);
        }
    }
}

function cart(id, name, price, offerPrice) {

    let quantity = document.getElementById("itemQty").value
    addToCart(id, name, price, quantity, offerPrice)


}
