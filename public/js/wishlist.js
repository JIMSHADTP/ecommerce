
$(document).ready(async () => {
  
  try{

    const response = await axios.get('/wishlistItemCount')
    const indexCount = response.data.indexCount ? response.data.indexCount :0
    $(".wishlist-item-count").html(indexCount)

  }catch(err){
    console.log(err);
  }
})


async function addToWishlist(id,productName){

    try {
        const response = await axios({
            method : "post",
            url : `/addtowishlist/${id}`,
            data : {
                name : productName
            }
            
        })
      console.log(response);
      if(response.status == 204){
        let indexCount =Number($(".wishlist-item-count").html())
        indexCount -= 1
        $(".wishlist-item-count").html(indexCount)
        toastr.error("Item removed from wishlist")
        console.log("-1");
      }else if (response.status == 201){
        let indexCount = Number($(".wishlist-item-count").html())
        indexCount += 1
        $(".wishlist-item-count").html(indexCount)
        // toastr.options={"positionClass" : "toast-bottom-center"}
        toastr.success("Item added to wishlist")

        $(`#product`).load(location.href + ` #product>*`, "");
        res.redirect('/')
  
       
      }   
      console.log(response);
    } catch (error) {
      window.location.replace("/login")
        console.log(error); 

        
    }
    
}

async function removeFromWishlist(id,productName){
  try{
    const response = await axios({
      method : "post",
      url : `/addtowishlist/${id}`,
      data :{
        name : productName
      }
    })
    if(response.status == 204 ){
      let indexCount =Number($(".wishlist-item-count").html())
      indexCount -= 1
      $(".wishlist-item-count").html(indexCount)
      toastr.error("Item removed from wishlist")
     
      $(`#wishlistItem-${id}`).load(location.href + ` #wishlistItem-${id}>*`, "");

    }else if (response.status == 201){
      let indexCount = Number($(".wishlist-item-count").html())
        indexCount += 1
        $(".wishlist-item-count").html(indexCount)
  
    }

  }catch(err){
    console.error(err);
  }
}

 
 function wishlist(id,productName){
  
 addToWishlist(id,productName)   
 
}