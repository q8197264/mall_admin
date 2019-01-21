<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">商品发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">下架</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                商品标题
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <span>分类:</span>
                <el-cascader label="商品分类:" :options="options" change-on-select @change="categoryChange"></el-cascader>
              </el-row>
            </div>

            <div class="postInfo-container">

              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="店铺:" class="postInfo-container-item">
                    <el-select v-model="postForm.author" filterable remote placeholder="搜索店铺"
                               :remote-method="getRemoteBrandList">
                      <el-option v-for="(item,index) in shopListOptions" :key="item+index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </el-col>
        </el-row>
        <el-row>
          <Sku></Sku>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容"
                    v-model="postForm.content_short">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.image_uri"/>
        </div>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { validateURL } from '@/utils/validate'

  import Sku from './sku'

  import { fetchGoods, publishGoods, fetchCategory } from '@/api/goods'
  import { fetchBrandList } from '@/api/brand'
  import { shopSearch } from '@/api/shop'

  const defaultForm = {
    status: 'draft',
    title: '', // 商品题目
    content: '', // 商品描述
    content_short: '', // 商品摘要
    source_uri: '', // 商品外链
    image_uri: '' // 商品图片
  }

  export default {
    name: 'detail',
    components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Sku },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        shopListOptions: [],
        brandListOptions: [],
        rules: {
          image_uri: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }],
          source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        },
        options: []
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      }
    },
    created() {
      if (this.isEdit) {
        // edit
        const id = this.$route.params && this.$route.params.id
        console.log(this.fetchData(id))
      } else {
        // add
        this.fetchCategory()
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      fetchCategory() {
        fetchCategory({}).then(response => {
          this.options = response.data
        })
      },
      fetchData(id) {
        fetchGoods(id).then(response => {
          this.postForm = response.data
          // Just for test
          this.postForm.title += `   Goods Id:${this.postForm.id}`
          this.postForm.content_short += `   Goods Id:${this.postForm.id}`
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true

            publishGoods(this.postForm)

            this.$notify({
              title: '成功',
              message: '发布商品成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      },
      categoryChange(value) {
        this.postForm.category_ids = value
      },
      getRemoteBrandList(query) {
        fetchBrandList(query).then(response => {
          if (!response.data.items) return
          this.brandListOptions = response.data.items.map(v => v.name)
        })
      },
      getRemoteShopList(query) {
        shopSearch(query).then(response => {
          console.log(response.data)
          if (!response.data.items) return

          this.shopListOptions = response.data.items.map(v => v.name)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }

      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;

        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;

          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
