<template>
  <div>
    <nav-header ref="navHeader"></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a
            href="javascript:void(0)"
            class="default"
            v-bind:class="{'cur':cur}"
            @click="defaultGoods"
          >Default</a>
          <a href="javascript:void(0)" class="price" v-bind:class="{'cur':!cur}" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  v-bind:class="{'cur':priceChecked=='all'}"
                  @click="setPriceFilter('all')"
                >All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter" :key="index">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  v-bind:class="{'cur':priceChecked==index}"
                >{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'static/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="load-more"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
                style="text-align: center;"
              >
                <img src="./../assets/loading-spinning-bubbles.svg" alt v-if="loading" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录，否则无法加入到购物车中！</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="closeModal">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">加入购物车完成！</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">转到购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "../components/NavHeader";
import NavFooter from "../components/NavFooter";
import NavBread from "../components/NavBread";
import Modal from "../components/Modal";
import axios from "axios";

export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "2000.00"
        },
        {
          startPrice: "3000.00",
          endPrice: "4000.00"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      pageSize: 8,
      page: 1,
      busy: true,
      loading: false,
      cur: true,
      mdShow: false,
      mdShowCart: false
    };
  },
  name: "GoodsList",
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted: function() {
    this.getGoodsList();
  },
  computed: {
    cartCount(state) {
      return this.$store.state.cartCount;
    }
  },
  methods: {
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.loading = true;
      axios
        .get("/goods/list", {
          params: param
        })
        .then(result => {
          var res = result.data;
          this.loading = false;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodList = [];
          }
        });
    },
    defaultGoods() {
      this.sortFlag = true;
      this.page = 1;
      this.getGoodsList();
      this.cur = true;
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
      this.cur = false;
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
      this.getGoodsList();
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    loadMore() {
      this.page++;
      if (this.page > 3) {
        return;
      }
      this.busy = false;
      setTimeout(() => {
        this.getGoodsList(true);
      }, 100);
    },
    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(res => {
          if (res.data.status == 0) {
            this.mdShowCart = true;
            this.$refs.navHeader.getCartListCount();
          } else {
            this.mdShow = true;
          }
        });
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    }
  }
};
</script>
