<template>
  <div class="div-input" style="padding-bottom: 70px">
    <van-nav-bar
      :title="feed_plan_id ? '变更饲喂计划' : '新增饲喂计划'"
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
    </van-nav-bar>

    <div class="div-title div-title-padbottom8">计划日期</div>
    <van-cell-group inset>
      <van-cell
        style="height: 44px"
        :value="date"
        @click="showDate = true"
        value-class="date-class"
      />
      <van-calendar
        v-model:show="showDate"
        :show-confirm="false"
        @select="onConfirmDate"
        color="var(--van-blue)"
      />
    </van-cell-group>

    <div class="div-title div-title-padbottom8">羊类型</div>
    <van-cell-group inset>
      <van-cell
        :title="animalText"
        is-link
        arrow-direction="down"
        @click="showAnimalPicker = true"
        :title-style="animalTextClass"
      >
      </van-cell>
      <van-popup v-model:show="showAnimalPicker" position="bottom">
        <van-picker
          :columns="option_animal"
          :columns-field-names="{ text: 'animal_name', value: 'animal_id' }"
          @confirm="onConfirmAnimal"
          @cancel="clearAnimal"
          cancel-button-text="清空"
        />
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">饲料名</div>
    <van-cell-group inset>
      <van-cell
        :title="formulaText"
        is-link
        arrow-direction="down"
        @click="showFormulaPicker = true"
        :title-style="formulaTextClass"
      >
      </van-cell>
      <van-popup v-model:show="showFormulaPicker" position="bottom">
        <van-picker
          title="饲料名"
          :columns="option_formula"
          :columns-field-names="{ text: 'formula_name', value: 'formula_id' }"
          @confirm="onConfirm"
          @cancel="clearFeed"
          cancel-button-text="清空"
        />
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">饲料重量</div>
    <van-cell-group inset>
      <van-field
        v-model="feedWeight"
        type="number"
        maxlength="20"
        placeholder="请输入饲料重量..."
      />
      <span class="formula-weight-right">kg</span>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">关联栏舍</div>
    <van-cell-group inset>
      <van-cell style="min-height: 100px" @click="showCoopsSelect = true">
        <div v-for="(item, index) in hutchsText" :key="index">
          {{ item }}
        </div>
      </van-cell>
      <van-popup
        v-model:show="showCoopsSelect"
        round
        position="bottom"
        closeable
        close-icon="close"
      >
        <div style="padding: 15px 0">栏舍选择</div>
        <van-tree-select
          v-model:show="showCoopsSelect"
          v-model:active-id="hutchActiveId"
          v-model:main-active-index="hutchMainActiveIndex"
          :items="hutchsArea"
          @click-item="onConfirmCoops"
        ></van-tree-select>
      </van-popup>
    </van-cell-group>

    <div class="div-title div-title-padbottom8">
      羊数量<span class="right">{{ sheep_count }}</span>
    </div>

    <van-row
      style="
        padding: var(--van-padding-md);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      "
    >
      <van-col span="24">
        <van-button type="primary" block round @click="onClickSubmit"
          >提交</van-button
        >
      </van-col>
    </van-row>
  </div>
</template>
<script>
import { Toast, Notify } from 'vant'
import axios from 'axios'

const changeHutchFormat = data_list => {
  return data_list.map(data => {
    return {
      id: data.room.r_id,
      text: data.room.r_name,
      children: data.hutchsList.map(hutch => {
        return {
          room_id: data.room.r_id,
          text: hutch.h_name,
          id: hutch.h_id,
          r_num: hutch.r_num,
        }
      }),
    }
  })
}

const ANIMAL_TYPE = [
  { animal_name: '种羊', animal_id: '1' },
  { animal_name: '青年母羊', animal_id: '3' },
  { animal_name: '育肥羊', animal_id: '4' },
  { animal_name: '断奶羔羊', animal_id: '5' },
  { animal_name: '哺乳羔羊', animal_id: '6' },
]

export default {
  name: 'fygl_add',
  data() {
    return {
      feed_plan_id: null,
      sheep: {
        animal_name: '青年母羊',
        animal_id: '3',
      },

      showDate: false,
      date: null,

      showFormulaPicker: false,
      option_formula: [],
      formula: null,

      showAnimalPicker: false,
      option_animal: ANIMAL_TYPE,
      animal: null,

      feedWeight: null,

      showCoopsSelect: false,
      hutchsArea: [],
      // hutchActiveId: ['A010', 'C011'],
      hutchActiveId: [],
      hutchMainActiveIndex: 0,
      hutchs: [],

      inloading: false,
    }
  },

  computed: {
    formulaText() {
      return this.formula ? this.formula.formula_name : '请选择饲料...'
    },
    formulaValue() {
      return this.formula ? this.formula.formula_id : null
    },

    formulaTextClass() {
      let s = {
        'text-align': 'left',
      }

      if (this.formulaValue == null || this.formulaValue == undefined) {
        s['color'] = '#aaa'
      }
      return s
    },

    animalText() {
      return this.animal ? this.animal.animal_name : '请选择羊类型...'
    },
    animalValue() {
      return this.animal ? this.animal.animal_id : null
    },

    animalTextClass() {
      let s = {
        'text-align': 'left',
      }

      if (this.animalValue == null || this.animalValue == undefined) {
        s['color'] = '#aaa'
      }
      return s
    },

    hutchsText() {
      let hutchs = this.hutchsArea
        .filter(area => area && !!area.badge && area.children)
        .map(ca => {
          return ca.children
            .filter(ch => this.hutchs.findIndex(c => c.id == ch.id) >= 0)
            .map(ch => ch.text)
        })

      return hutchs.map(row => (row ? _.join(row, ',') : ''))
    },

    sheep_count() {
      let cnt = 0
      this.hutchs.map(h => {
        let num = Number(h.r_num)
        cnt += isNaN(num) ? 0 : num
      })

      return cnt
    },
  },

  watch: {
    inloading(to, from) {
      if (to == false) {
        Toast.clear()
      }
    },
  },

  methods: {
    convertSheepTypeToSheepName(type) {
      if (type == 1) {
        return '种羊'
      } else if (type == 2) {
        return ''
      } else if (type == 3) {
        return '青年母羊'
      } else if (type == 4) {
        return '育肥羊'
      } else if (type == 5) {
        return '断奶羔羊'
      } else if (type == 6) {
        return '哺乳小羊'
      }
    },

    getFeedById() {
      let params = {
        act: 'api_feed_getfeedbyId',
        feed_plan_id: this.feed_plan_id,
      }
      console.log(params)
      axios.post('', params).then(res => {
        console.log(res)
        this.date = res.data.feed_date
        console.log(res.data.sheep_type)
        this.animal = {
          animal_name: this.convertSheepTypeToSheepName(res.data.sheep_type),
          animal_id: res.data.sheep_type,
        }
        this.formula = {
          formula_name: res.data.formula_name,
          formula_id: res.data.formula_id,
        }
        this.feedWeight = res.data.weight
        // for(let i = 0;i < hutchs.length;i++){
        //   for(let j = 0;j < this.hutchsArea.length;j++){
        //     console.log(this.hutchsArea)
        //     // for(let k = 0 ;k < this.hutchsArea[j].children[k].length;k++){
        //     //   console.log(this.hutchsArea[j].children[k])
        //     // }
        //   }
        // }
        this.hutchs = hutcharr;
        // console.log(this.hutchs)

        // this.hutchs = hutchs
        // this.sheeptype = res.data.sheep_type
      })
    },
    onClickLeft() {
      history.back()
    },

    onConfirmAnimal(item) {
      console.log(item)
      this.animal = item
      this.showAnimalPicker = false
    },

    clearAnimal() {
      this.showAnimalPicker = false
      this.animal = null
    },

    onConfirm(item) {
      this.formula = item
      this.showFormulaPicker = false
    },

    clearFeed() {
      this.showFormulaPicker = false
      this.formula = null
    },

    onConfirmDate(date) {
      this.showDate = false
      this.date = date.format('yyyy-MM-dd')
    },

    onConfirmCoops(selNode) {
      let index = this.hutchs.findIndex(c => c.id == selNode.id)
      if (index < 0) {
        this.hutchs.push(selNode)
      } else {
        this.hutchs.splice(index, 1)
      }
      this.hutchActiveId = this.hutchs.map(c => c.id)
      this.hutchsArea.forEach(ca => {
        let selNode = (ca.children || []).filter(
          ch => this.hutchs.findIndex(c => ch && c.id == ch.id) >= 0,
        )
        if (selNode.length > 0) {
          ca.badge = selNode.length
        } else {
          delete ca.badge
        }
      })
    },

    async onClickSubmit() {
      let feedWeight = Number(this.feedWeight)
      if (
        !this.date ||
        !this.animalValue ||
        !this.formulaValue ||
        isNaN(feedWeight) ||
        feedWeight <= 0 ||
        this.hutchs.length == 0
      ) {
        Notify({ message: '请正确填写饲喂计划信息', type: 'warning' })
        return
      }

      let param = {
        act: 'api_feed_create',
        total_cnt: this.sheep_count,
        feed_plan_id: this.feed_plan_id ? this.feed_plan_id : 0,
        feed_date: this.date,
        animal_type: this.animalValue,
        formula_id: this.formulaValue,
        feed_weight: this.feedWeight,
        rooms: _.uniq(this.hutchs.map(h => h.room_id)).map(room_id => {
          return {
            room_id,
            hutchs: this.hutchs
              .filter(h => h.room_id == room_id)
              .map(h => {
                return {
                  hutch_id: h.id,
                }
              }),
          }
        }),
      }

      console.info(param)

      this.inloading = true
      try {
        let res = await axios.post('', param)

        if (!res || res.code != 0) {
          Notify({
            message: res && res.msg ? res.msg : '提交失败',
            type: 'warning',
          })
          return
        }

        window.$swgl_add_back = true
        this.$router.push('/app/swgl')
      } catch (ex) {
        console.log(ex)
        Notify({
          message: res && res.msg ? res.msg : '提交失败',
          type: 'warning',
        })
      } finally {
        this.inloading = false
      }
    },

    async initBaseDate() {
      try {
        let res = await axios.post('', {
          act: 'api_user_feedformula',
          org_id: this.$store.state.store_org.org_id,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        let data = res.data
        this.option_formula = data.formula_list

        res = await axios.post('', {
          act: 'api_user_choosegroup',
          org_id: this.$store.state.store_org.org_id,
        })

        if (!res || res.code != 0 || !res.data) {
          return
        }

        data = res.data
        this.hutchsArea = changeHutchFormat(data.room_list)
        // console.log(this.hutchsArea[0])
        // console.log(Object.getOwnPropertyNames(this.hutchsArea).length)
       
        let areasArr = this.$route.query.areas.split(",");
        console.log(this.hutchsArea[0]['children'][0]['text'])
        
        for(let i = 0;i < areasArr.length;i++){
          let len = Object.getOwnPropertyNames(this.hutchsArea).length;
         
          for(let j = 0; j < len - 1;j ++){
            let childrenLen = Object.getOwnPropertyNames(this.hutchsArea[j]['children']).length;
            for(let k  = 0;k < childrenLen - 1;k++){
              console.log(this.hutchsArea[j]['children'][k]['text'])
              if(this.hutchsArea[j]['children'][k]['text'] == areasArr[i]){
                this.onConfirmCoops(this.hutchsArea[j]['children'][k])
              }
            }
          }
        }
        // for(let i = 0;i < this.areasArr.length;i++){
        //   for(let j = 0;j < this.hutchsArea.length;j++){
        //     for(let k = 0;k < this.hutchsArea[j].children.length;k++){
        //       if(this.hutchsArea[j].children[k].text == areasArr[i]){
        //         this.onConfirmCoops(this.hutchsArea[j].children[k])
        //       }
        //     }
        //   }
        // }
       
      } catch (ex) {
        console.info(ex)
      }

      // try {
      //   let res = await axios.post("",  {
      //     act: "api_feed_detail",
      //     feed_plan_id: this.feed_plan_id,
      //   })

      //   if (!res || res.code != 0 || !res.data) {
      //     return
      //   }

      //   let data = res.data

      //   this.date = data.feed_date
      //   this.animalValue = data.animal_type
      //   this.formulaValue = data.formula_id
      //   this.feedWeight = data.feed_weight
      // } catch(ex) {

      // }
    },
  },

  mounted() {
    this.feed_plan_id = this.$route.query.feedId
    console.log('feed_plan_id:' + this.feed_plan_id)
    this.initBaseDate();
  
    this.getFeedById()
  },

  beforeRouteLeave(to, form, next) {
    let leave = true
    if (window.event.type === 'popstate') {
      if (
        this.showFormulaPicker ||
        this.showCoopsSelect ||
        this.showDate ||
        this.inloading
      ) {
        leave = false

        this.inloading = false
        this.showDateFrom = false
        this.showDateTo = false
        this.showFormulaPicker = false
        this.showCoopsSelect = false
      }
    }

    next(leave)
  },
}
</script>
<style scoped>
.formula-weight-right {
  position: absolute;
  right: 16px;
  top: 12px;
  color: #888;
}

.ycsb-button {
  width: 30vw;
}
</style>