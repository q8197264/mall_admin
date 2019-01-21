<template>
  <div ref="refs">
    <div v-for="(colorSku, index) in skuList">
      <!--{{colorSku}}-->
      {{colorSku.spec}}
      <el-tag
      :key="tag"
      v-for="tag in colorSku.dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(colorSku, tag)">
      {{tag}}
      </el-tag>
      <el-input
      class="input-new-tag"
      v-if="colorSku.inputVisible"
      v-model="colorSku.inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm(colorSku)"
      @blur="handleInputConfirm(colorSku)"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput(colorSku)">+ New Tag</el-button>
    </div>

    <!--<div>-->
    <!--尺码-->
    <!--<el-tag-->
    <!--:key="tag"-->
    <!--v-for="tag in sizeSku.dynamicTags"-->
    <!--closable-->
    <!--:disable-transitions="false"-->
    <!--@close="handleClose(sizeSku, tag)">-->
    <!--{{tag}}-->
    <!--</el-tag>-->
    <!--<el-input-->
    <!--class="input-new-tag"-->
    <!--v-if="sizeSku.inputVisible"-->
    <!--v-model="sizeSku.inputValue"-->
    <!--ref="saveTagInput"-->
    <!--size="small"-->
    <!--@keyup.enter.native="handleInputConfirm(sizeSku)"-->
    <!--@blur="handleInputConfirm(sizeSku)"-->
    <!--&gt;-->
    <!--</el-input>-->
    <!--<el-button v-else class="button-new-tag" size="small" @click="showInput(sizeSku)">+ New Tag</el-button>-->
    <!--</div>-->
  </div>


</template>

<script>
  import { fetchSkuList } from '@/api/goods'

  export default {
    name: 'sku',
    data() {
      return {
        skuList: [{}]
      }
    },
    mounted() {
      this.fetchSkuList()
      console.log(this.skuList)
    },
    methods: {
      fetchSkuList() {
        fetchSkuList({}).then(response => {
          let i = 0
          for (var index in response.data) {
            this.skuList[i].spec = response.data[index].spec
            this.skuList[i].dynamicTags = response.data[index].value
            this.skuList[i].inputVisible = false
            this.skuList[i].inputValue = ''
            this.skuList.push({})
            i++
          }
          this.skuList.pop()
        })
      },
      handleClose(sku, tag) {
        sku.dynamicTags.splice(sku.dynamicTags.indexOf(tag), 1)
      },
      showInput(sku) {
        sku.inputVisible = true
        this.$nextTick(_ => {
          console.log(this.$refs)
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm(sku) {
        var inputValue = sku.inputValue
        if (inputValue) {
          sku.dynamicTags.push(inputValue)
        }
        sku.inputVisible = false
        sku.inputValue = ''
      }
    }
  }
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
