<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">success</span>
    </nav-bread>
    <div>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
        <div class="order-create-main" v-for="item in orderList">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{item.orderId}}</span>
            <span>Order total：{{item.orderTotal}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
    import NavHeader from "../components/NavHeader";
    import NavFooter from "../components/NavFooter";
    import NavBread from "../components/NavBread";
    import {currency} from "../util/currency";
    import axios from "axios"
    export default {
        name: "OrderSuccess",
        components:{
            NavHeader,
            NavFooter,
            NavBread,
        },
        data(){
            return{
              orderList:[]
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                var param = {
                    orderId:this.$route.query.orderId
                }
                axios.post('/users/orderList',param).then(response=>{
                   let res = response.data;
                   if(res.status == 0){
                       this.orderList = res.result;
                   }
                });
            }
        }
    }
</script>

