Natural Food Is Always Healthy

Organic Food Is Good For Health

   let categoryid = productModel.findOne({category},{_id:0,category:1})


   deleteCategory: async (req, res) => {
    try {
     const findcate =  await productModel.find().populate("category")
     console.log(findcate);
     findcate.category.forEach(findcate => {
      findcate.id
      console.log(findcate.id);
     })
   
console.log(req.params.id);
     if(find == req.params.id){
      
      console.log("category exist");
      res.redirect('/admin/getcategory')
     }else{
      await categoryModel.findByIdAndDelete().exec()
      console.log("category deleted");
      res.redirect('/admin/getcategory')
     }

           // req.flash("message", "Category deleted")
     
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')
    }

  }



  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
  integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
  crossorigin="anonymous"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.css">

<script type="text/javascript" charset="utf8"
  src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.js"></script>




  <input class="form-check-input" type="radio" value="<%= index %>" name="addressPosition" id="addressPosition" onclick="getAddressIndex('<%=userAddress.id%>')">











  
<% if(user.Address.length>0) {%>
  <div class="container">
    <div class="row" id="userAddress">
      <% user.Address.forEach((userAddress,index) => {%>
      <div class="col-lg-4  p-md-5 " id="">
        <div class="card">
          <div class="card-body">
            <!-- <form action="/placeOrder" method="post" id="orderForm"> -->
            <h5 class="card-title">
              <ion-icon name="location-outline"></ion-icon>
  
            </h5>
            <address class="card-text"><%= userAddress.firstName + ' ' +userAddress.lastName %><br>
              <%= userAddress.house %>,<br>
              <%= userAddress.address %><br><%= userAddress.city%>, <br>
              <%= userAddress.state %>, <br>
              Pincode :<%= userAddress.pincode %><br>
              Ph :<%= userAddress.phone %>
            </address>
            <ul class="list-inline m-0">
              <!-- <div class="form-check"> -->
                <button class="btn btn-outline-dark" onclick="fillForm('<%=JSON.stringify(userAddress)%>','<%=Number(index)%>')">Use this address</button>
                
                <label class="form-check-label" for="flexCheckIndeterminate">
                </label>
                <li class="list-inline-item float-end">
                  <button data-bs-toggle="modal" data-placement="top" data-bs-target="#exampleModa"><i class="bi bi-pen"></i></button>
                  <button onclick="deleteAddress('<%=userAddress.id%>')" data-toggle="tooltip" data-placement="top" title="Delete"><i class="bi bi-trash" style="font-size: 1.2rem; color: rgb(255, 0, 0);"></i></button></a>
                </li>
              <!-- </div> -->
            </ul>
          </div>
        </div>
      </div>
     
    </div>
    <% }) %>
  </div>
  <% } %>
  
  <!-- Checkout Section Begin -->
  <section class="checkout spad">
    <div class="container">
      <div class="checkout__form">
        <h4>Shipping Details</h4>
  
        <div class="row">
          <div class="col-lg-6 col-md-1">
            <form action="/addAddress" method="post">
              <h5>Add New Address</h5>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="labels">First Name</label>
                  <input type="text" class="form-control" placeholder="" value="" name="firstName" required>
                </div>
                <div class="col-md-6">
                  <label class="labels">Last Name</label>
                  <input type="text" class="form-control" value="" placeholder="" name="lastName" required>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <label class="labels">Address</label>
                  <input type="text" class="form-control" placeholder="Flat, House no., Building," value="" name="house" required><br>
                  <input type="text" class="form-control" placeholder="Area, Street,Village" value="" name="address" required>
                </div>
                <div class="col-md-12">
                  <label class="labels">Town/City</label>
                  <input type="text" class="form-control" placeholder="" value="" name="city" required>
                </div>
                <div class="col-md-12">
                  <label class="labels">State</label>
                  <input type="text" class="form-control" placeholder="" value="" name="state" id="state" required>
                </div>
                <div class="col-md-12">
                  <label class="labels">Pincode</label>
                  <input type="text" class="form-control" placeholder="6-digits" value="" name="pincode" minlength="6" maxlength="6" required>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="labels">Mobile Number</label>
                  <input type="text" class="form-control" placeholder="" value="" name="phone" required>
                </div>
                <div class="col-md-6">
                  <label class="labels">email</label>
                  <input type="text" class="form-control" value="<%=user.email %>" placeholder="">
                </div>
              </div>
              <div class="py-5 md-3"><button class="btn btn-primary rounded-pill py-sm-3 px-sm-5" type="submit">Add Address</button></div>
            </form>
          </div>
  
  
  
  
  
          <div class="col-lg-6 col-md-6">
            <form action="/placeOrder" method="post" id="orderForm">
              <% if(findCart.products.length >0) {%>
  
              <div class="checkout__order">
  
                <h4>Your Order</h4>
                <div class="checkout__order__products">Products <span>Total</span></div>
                <% findCart.products.forEach((listItem)=> { %>
                <ul>
                  <li><%= listItem.name %> <span>₹ <%= listItem.offerPrice.toFixed(2) ? (listItem.quantity.toFixed(2) * listItem.offerPrice.toFixed(2)) : (listItem.quantity.toFixed(2) * listItem.price.toFixed(2)) %> </span></li>
                </ul>
                <% }) %>
                <div class="checkout__order__subtotal">Subtotal <span>₹ <del><%= findCart.subTotal %></del></span></div>
                <div class="checkout__order__total">Discount<span>₹ <%= (findCart.subTotal.toFixed(2) - findCart.total.toFixed(2)) %></span></div>
                <% if(couponCode) {%>
                <div class="checkout__order__total">coupon code<span class="text-muted">₹ <%=couponCode%></span></div>
                <div class="checkout__order__total">Coupon Discount<span class="text-muted">₹ <%=couponDiscount  %></span></div>
                <div class="checkout__order__total">Total <span>₹ <%= (findCart.total - couponDiscount) %></span></div>
                <% } else {%>
                <div class="checkout__order__total">Total <span>₹ <%= findCart.total%></span></div>
                <% } %>
                <!-- <div class="checkout__input__checkbox"> -->
                  <label for="payment">
                  
                    <input type="radio" id="cod" name="paymentType" value="cash-on-delivery" class="form-check-input" checked> Cash On Delivery
                    <span class="checkmark"></span>
                  </label>
                <!-- </div> -->
                <!-- <div class="checkout__input__checkbox"> -->
                  <label for="paypal">
           
                    <input type="radio" id="online-payment" name="paymentType" class="form-check-input" value="razorPay"> online payment
                    <!-- <span class="checkmark"></span> -->
  
                  </label>
                </div>
                <input type="hidden" value="" id="myAddress" name="myAddress">
                <button type="submit" class="btn btn-primary rounded-pill py-sm-3 px-sm-5">PLACE ORDER</button>
  
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <% } %>
  
  <!-- Checkout Section End -->
  
  <%- include("../partials/footer") %>
  
  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script src="/js/checkout.js"></script>
  <script src="/js/address-auto-complete.js"></script>
  
  <!-- 
  <script src="/js/checkout.js"></script> -->
  
  
  <script>
    function getAddressIndex(id) {
      let address = document.getElementById("myAddress").value = id
    }
    console.log(address);
    document.forms["orderForm"].addEventListener("submit", async (event) => {
      event.preventDefault();
      const paymentType = $('input[name=paymentType]:checked', '#orderForm').val()
      console.log(paymentType);
      if (paymentType == "cash-on-delivery") {
  
        checkout(address)
  
      }
    });
  
    async function checkout(address) {
      try {
        const response = await axios({
          url: '/placeOrder',
          method: 'post',
          data: address
        })
        if (response.status == 200) {
  
          await Swal.fire(
            'success!',
            `completed`,
            'success'
  
          )
        }
  
      } catch (error) {
  
      }
    }
  </script>