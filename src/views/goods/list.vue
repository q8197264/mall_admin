<template>
  <div class="app-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sku_id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="商品名称">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'http://www.mall.cn/goods/'+scope.row.id+'/show'">
            <span>{{scope.row.sku_name}}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="店辅">
        <template slot-scope="scope">
          <span>{{scope.row.shop_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="品牌">
        <template slot-scope="scope">
          <span>{{scope.row.brand_name}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="价格" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="库存" width="250" prop="stock">
        <template slot-scope="scope">
          <template>
            <el-input-number size="mini" v-model="scope.row.stock" controls-position="right"
                             @change="changeStock(scope.row)"></el-input-number>
            <!--<el-button type="text" @click="dialogFormVisible = true">SKU</el-button>-->
          </template>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" label="图片">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/example/edit/'+scope.row.id">
            <img :src="scope.row.images" alt="" style="width: 50px;height: 50px">
          </router-link>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="操作" width="120">-->
        <!--<template slot-scope="scope">-->
          <!--<router-link :to="'/goods/edit/'+scope.row.status">-->
            <!--<el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>-->
          <!--</router-link>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- Form -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="el-dialog__body"><span>商品货号：</span> <span>6946605</span>
        <div class="el-input el-input--small el-input-group el-input-group--append"
             style="width: 50%; margin-left: 20px;">
          <!---->
          <input type="text" autocomplete="off" placeholder="按sku编号搜索" class="el-input__inner">
          <!----><!---->
          <div class="el-input-group__append">
            <button type="button" class="el-button el-button--default">
              <!---->
              <i class="el-icon-search"></i>
              <!---->
            </button>
          </div>
        </div>
        <div
          class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition"
          style="width: 100%; margin-top: 20px;">
          <div class="hidden-columns">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 500px;">
              <colgroup>
                <col name="el-table_2_column_12" width="80">
                <col name="el-table_2_column_16" width="80">
                <col name="el-table_2_column_17" width="80">
                <col name="el-table_2_column_13" width="80">
                <col name="el-table_2_column_14" width="80">
                <col name="el-table_2_column_15" width="100">
                <col name="gutter" width="0">
              </colgroup>
              <thead class="has-gutter">
              <tr class="">
                <th colspan="1" rowspan="1" class="el-table_2_column_12  is-center   is-leaf">
                  <div class="cell">SKU编号</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_2_column_16  is-center   is-leaf">
                  <div class="cell">颜色</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_2_column_17  is-center   is-leaf">
                  <div class="cell">容量</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_2_column_13  is-center   is-leaf">
                  <div class="cell">销售价格</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_2_column_14  is-center   is-leaf">
                  <div class="cell">商品库存</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_2_column_15  is-center   is-leaf">
                  <div class="cell">库存预警值</div>
                </th>
                <th class="gutter" style="width: 0px; display: none;"></th>
              </tr>
              </thead>
            </table>
          </div>
          <div class="el-table__body-wrapper is-scrolling-left">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 500px;">
              <colgroup>
                <col name="el-table_2_column_12" width="80">
                <col name="el-table_2_column_16" width="80">
                <col name="el-table_2_column_17" width="80">
                <col name="el-table_2_column_13" width="80">
                <col name="el-table_2_column_14" width="80">
                <col name="el-table_2_column_15" width="100">
              </colgroup>
              <tbody>
              <tr class="el-table__row">
                <td class="el-table_2_column_12 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!----></div>
                  </div>
                </td>
                <td class="el-table_2_column_16 is-center ">
                  <div class="cell">
                    金色
                  </div>
                </td>
                <td class="el-table_2_column_17 is-center ">
                  <div class="cell">
                    16G
                  </div>
                </td>
                <td class="el-table_2_column_13 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_14 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_15 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!----></div>
                  </div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="el-table_2_column_12 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_16 is-center ">
                  <div class="cell">
                    金色
                  </div>
                </td>
                <td class="el-table_2_column_17 is-center ">
                  <div class="cell">
                    32G
                  </div>
                </td>
                <td class="el-table_2_column_13 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_14 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_15 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="el-table_2_column_12 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_16 is-center ">
                  <div class="cell">
                    银色
                  </div>
                </td>
                <td class="el-table_2_column_17 is-center ">
                  <div class="cell">
                    16G
                  </div>
                </td>
                <td class="el-table_2_column_13 is-center ">
                  <div class="cell">
                    <div class="el-input"><!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!----></div>
                  </div>
                </td>
                <td class="el-table_2_column_14 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!----></div>
                  </div>
                </td>
                <td class="el-table_2_column_15 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!----></div>
                  </div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="el-table_2_column_12 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_16 is-center ">
                  <div class="cell">
                    银色
                  </div>
                </td>
                <td class="el-table_2_column_17 is-center ">
                  <div class="cell">
                    32G
                  </div>
                </td>
                <td class="el-table_2_column_13 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_14 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!---->
                      <!---->
                    </div>
                  </div>
                </td>
                <td class="el-table_2_column_15 is-center ">
                  <div class="cell">
                    <div class="el-input">
                      <!---->
                      <input type="text" autocomplete="off" class="el-input__inner">
                      <!---->
                      <!----><!---->
                    </div>
                  </div>
                </td>
              </tr><!----></tbody>
            </table><!----><!----></div><!----><!----><!----><!---->
          <div class="el-table__column-resize-proxy" style="display: none;"></div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, changeStock } from '@/api/goods'

  /**
   import axios from 'axios'
   axios.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    next()
  })
   * let baseURL = "http://localhost:3000"
   * axios.defaults.baseURL = baseURL
   **/
  export default {
    name: 'goodsList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        // gridData: [{
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-04',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-01',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-03',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    mounted() {
      window.vue = this
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      changeStock(row) {
        var params = {}
        params.sku_id = row.sku_id
        params.stock = row.stock
        changeStock(params).then(response => {
          console.log(response.data)
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
